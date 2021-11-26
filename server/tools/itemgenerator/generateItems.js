require("dotenv").config({
  path: "../../.env"
});

const db = require("../../models")

const fs = require("fs");

let itemList = `let itemList = {}`;

async function getItems() {
  return await db.Item.findAll()
}

getItems().then(res => {
  for(const item in res) {
    const i = res[item];
    const itemName = i.name.replace(/[^\w\s]/gi, '').toUpperCase().split(' ').join('_');

    if(!itemName || itemName.match(/^\d/))
      continue

    console.log(i);
    itemList += `
itemList.${itemName} = {
  id: ${i.id},
  name: "${i.name}",
  ref: "${itemName}",
  attack: ${i.attack},
  defense: ${i.defense},
  speed: ${i.speed},
  sockets: ${i.sockets},
  armor_penetration: ${i.armor_penetration}
}
    `
  }

  writeFile()
})


function writeFile() {

  itemList += `
module.exports = itemList`

  fs.writeFile('items.js', itemList, (err) => {
    if(!err)
      console.log("Item list build")
    else
      console.log(err)
  });

}
