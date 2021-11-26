require("dotenv").config();

const User = require('./socket/user');
const db = require("./models");

const http = require('http').createServer();
const port = process.env.PORT || 3000;
const io = require("socket.io")(http, {
  port: 3000,
  serveClient: false,
  cors: {
    origin: process.env.WEB_URL,
    methods: ["POST", "GET"],
    credentials: true,
  }
});

const jwt = require('jsonwebtoken')

const bcrypt = require("bcrypt");

const fs = require('fs')
const {Op} = require("sequelize");
const {omit} = require("lodash/object");

const chatCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let commands = [];

for (const file of chatCommands) {
  const command = require(`./commands/${file}`);

  commands.push(command);
}

let users = [];

let messages = [];

(async () => {
  messages = await db.chat_messages.findAll({
    limit: 100,
    order: [
      [
        ['id', 'DESC']
      ]
    ],
    include: [{
      model: db.Characters,
      attributes: ['id', 'user_id', 'username', 'badge', 'title'],
      include: [{
        model: db.User,
        attributes: ['id', 'staff']
      }]
    },]
  });

  // messages = messages.map(m => {
  //   let message = m;
  //   message.Character = omit(message, ['Character.heat', 'Character.gold']);
  //
  //   console.log(message.Character.toString())
  //
  //   return message;
  // });


  const date = (new Date())
  let userList = await db.User.findAll({
    include: [
      {
        model: db.Characters,
        where: {
          'session_ends': {
            [Op.gt]: date.getTime() // Get all sessions that are active
          },
          'current_skill': {
            [Op.ne]: null
          }
        }
      }
    ]
  });

  userList.every(async u => {
    const user = new User();
    await user.loadUser(u);
    user.setSocketIO(io)
    await user.startSkill(u.Character.current_skill)
    users.push(user);

    console.log(`Found user, ${u.Character.username}`)
  })
})();

setInterval(() => {
  console.log(`Users online ${users.length}`);
  io.emit('players online', users.length)
}, 5000)

io.on("connection", (socket) => {

  let user = {},
    authd = false;

  console.log('Connection received');

  const sessionRefreshTimer = setInterval(() => {
    if (user.socket && user.socket.connected) {
      console.log("User is active, refreshing session");
      user.touchSession();
    } else {
      console.log("User is not connected, removing timer ")
      clearInterval(sessionRefreshTimer)
    }
  }, 1000 * 60 * 5)

  socket.use(([event, ...args], next) => {
    console.log("Middleware for event", event, args);

    if (event.startsWith("guest:") && authd) {
      return next(new Error("You cannot do this while logged in"))
    }

    if (event.startsWith("auth:") && !authd) {
      return next(new Error("you must be logged in"))
    }

    next()
  })

  socket.on("guest:login", async (params) => {
    const {username, password} = params;
    let validation = {};

    if (!username || username.length < 3) {
      validation['username'] = "Username not found"
    }

    if (!password || password.length < 4) {
      validation['password'] = "Password Invalid"
    }

    if (Object.keys(validation).length !== 0) {
      socket.emit("login error", validation)
      return;
    }


    const user = await db.User.findOne({
      where: {
        username: username
      },
    });

    if (!user) {
      socket.emit("login error", {
        'username': 'Username not found'
      });
      return;
    }

    const compare = await bcrypt.compare(password, user.password)

    if (compare) {
      const token = jwt.sign({
        id: user.id,
        username
      }, 'qwerty12345', {
        audience: 'me',
        issuer: 'idlecraft',
        expiresIn: '5d'
      })
      socket.emit('login success', token)
    } else {
      socket.emit("login error", {
        'password': 'Password is invalid'
      })
    }
  });

  socket.on("guest:register", async (params) => {
    const {username, password, password_confirmation, email} = params;

    let errors = {},
      password_encrypted = '';

    if (password === password_confirmation && password.length > 5) {
      password_encrypted = await bcrypt.hash(password, 10);
    } else {
      errors['password'] = "Passwords must match and contain at least 5 characters"
    }

    if (username.length < 3 || username.length > 16) {
      errors['username'] = "Usernames must be between 3 and 16 characters long"
    }

    if (!validateEmail(email)) {
      errors['email'] = 'Invalid email'
    } else {
      const emailExists = await db.User.findOne({
        where: {
          email: email
        }
      });

      if (emailExists)
        errors['email'] = 'Email already in use'
    }

    const userExists = await db.User.findOne({
      where: {
        username: username
      }
    });

    if (userExists)
      errors['username'] = "Username must be unique"

    if (Object.keys(errors).length !== 0) {
      socket.emit("register error", errors);

      return;
    }

    const newUser = await db.User.create({
      username: username,
      password: password_encrypted,
      email: email
    });


    await db.UserLevels.create({
      user_id: newUser.id
    });

    await db.Characters.create({
      user_id: newUser.id,
      username: username
    })


    const token = jwt.sign({
      id: newUser.id,
      username: newUser.username
    }, 'qwerty12345', {
      audience: 'me',
      issuer: 'idlecraft',
      expiresIn: '6h'
    });

    socket.emit("register success", token)
  });

  socket.on("auth:refresh:token", () => {
    try {

      const token = jwt.sign({
        id: user.id,
        username: user.username,
      }, 'qwerty12345', {
        audience: 'me',
        issuer: 'idlecraft',
        expiresIn: '5d'
      });

      socket.emit("add:jwt", token)
    } catch (err) {
      console.log("failed signing jwt for", user.username);
    }
  })

  socket.on("auth", async ({token}) => {
    console.log("authenticating socket");

    console.log('test', token, user)

    try {
      const sign = jwt.verify(token, 'qwerty12345', {
        audience: 'me',
        issuer: 'idlecraft',
      });

      const uIndex = users.findIndex(u => {
        return u.user.user.id === sign.id;
      })

      // If they are already have a session then just disconnect their old socket and set the new socket
      if (uIndex > -1) {
        console.log("We found a session lets disconnect them")
        users[uIndex].disconnect();
        users[uIndex].setSocket(socket, io);
        await users[uIndex].loadUser(sign);
        user = users[uIndex];
      } else {
        user = new User();
        user.setSocket(socket, io);
        await user.loadUser(sign);
        users.push(user);
      }

      // Update the session so they can skill and do things
      user.touchSession();
      authd = true;

      socket.emit('ready to play')
      socket.emit("redirect to play")
    } catch (err) {
      console.log('invalid token', err, token)
      socket.emit("invalid token", 'invalid')
      socket.emit("logout");
    }
  });

  socket.on("auth:start skill", async (skill) => {
    user.stopSkill();
    await user.startSkill(skill);
  });

  socket.on("auth:stop skill", (skill) => {
    user.stopSkill();
  });

  socket.on('get chat history', () => {
    if (Object.keys(user).length === 0) {
      console.log("Can't get chat history as user is empty")
      setTimeout(() => {
        console.log(Object.keys(user).length)
      }, 5000)
      return;
    }

    user.emit('send history', messages);
    user.emit("new chat message", {
      from: 'System',
      message: 'Welcome to general chat',
      system: true,
    })
  });

  socket.on('players online', () => socket.emit('players online', users.length))

  socket.on("chat send message", async (message) => {
    user.chatSendMessage(message, messages)
  });

  socket.on("delete message", id => {
    const message = messages.find(m => m.id === id);

    console.log("Found message", message);
    message.deleted_at = new Date();
    message.save();

    io.emit('delete message', message.id)
  });

  socket.on("timeout user", async userid => {
    console.log("timing out user", userid);
    let target = null;
    target = users.find(u => u.user.user.id === userid);

    if (!target) {
      target = await db.User.findOne({
        where: {
          id: userid
        }
      });

      target.muted = new Date().getTime() + (10 * 60 * 1000)

      target.save();
    } else {
      target.muteUser(10)
    }

    io.to(`user-${userid}`).emit('timeout', {
      message: "You have been timed out for 10 minutes"
    })

    console.log("Found user to timeout", target);
  })

  socket.on("error", (err) => {
    if (err) {
      console.log(err);
      socket.emit("error", err)
    }
  });

  socket.on("craft", (table) => {
    console.log(table);
    user.craftItem(table);
  });

  socket.on("equip item", (itemId) => {
    user.equipItem(itemId)
  })

  socket.on("unequip item", (itemId) => {
    user.unEquipItem(itemId)
  });

  socket.on("open item", (itemId) => {
    user.openItem(itemId);
  });

  socket.on("eat item", async (obj) => {
    await user.eatItem(obj.item, obj.amount);
  });

  socket.on("consume for heat", async (item) => {
    await user.consumeForHeat(item.item, item.amount);
  });

  socket.on("add to combat inventory", async (item) => {
    await user.addToCombatInventory(item.item, item.amount);
  });

  socket.on("consume combat inventory", async (itemId) => {
    await user.consumeCombatInventoryItem(itemId);
  });

  socket.on("remove from combat inventory", async (itemId) => {
    await user.removeFromCombatInventory(itemId);
  });

  socket.on("add friend", async (userId) => {
    await user.addRelationship(userId, 'friend');
  })

  socket.on("block user", async (userId) => {
    await user.addRelationship(userId, 'block');
  })


  socket.on("remove friend", async (userId) => {
    await user.removeRelationship(userId, 'friend');
  })

  socket.on("unblock user", async (userId) => {
    await user.removeRelationship(userId, 'block');
  })

  socket.on("sell item", (itemId) => {
    user.sellItem(itemId);
  });

  socket.on("disconnect", () => {
    console.log(user)
    if (user.user && user.user.character) {
      clearInterval(sessionRefreshTimer)
      user.touchSession();
      console.log('Disconnecting user', user.user.character.username)
    }
  });

});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
