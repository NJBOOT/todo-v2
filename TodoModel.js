const mongoose = require('mongoose');

const itemsSchema = {
    name: String
}
const Item = mongoose.model("Item", itemsSchema)


const item1 = new Item({
    name: "Buy food"
  })
  
  const item2 = new Item({
    name: "Cook food"
  })
  
  const item3 = new Item({
    name: "Eat food"
  })
  
const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

module.exports = {Item, defaultItems, List}
