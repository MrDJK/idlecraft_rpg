# IdleCraft

IdleCraft was a game based upon Minecraft written in Vue & NodeJS. The idea was to emulate Minecraft as a sort of text based rpg.


## Installation

### Server

```
cd server
npm install
sequelize-cli db:migrate
sequelize-cli db:seed
```

Open `.env` and update the variables in there

### Client

*If you have Vue CLI you can just import the client folder and let VueCLI to do the rest*

```
cd client
npm install
```

Open `.env` and update the variables in there

## Running the game

### Server

```
cd server
nodemon server.js
```

### Client

*I advise using VueCLI to import the project and to run it*

```
cd client
npm serve
```

