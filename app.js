//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const day = date.getDate();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-nico:test123@cluster0-o3s1r.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })

const obj = require("./TodoModel")

app.get("/", function (req, res) {

  obj.Item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      obj.Item.insertMany(obj.defaultItems, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Items successfully added")
          res.redirect("/")
        }
      })
    } else {
      res.render("list", { listTitle: day, newListItems: founditems });
    }
  })




});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list

  const item = new obj.Item({
    name: itemName
  })
  if (listName === day){
    item.save();
    res.redirect("/");
  } else {
    obj.List.findOne({name: listName}, function(err, foundList){
      if (!err){
        foundList.items.push(item);
        foundList.save()
        res.redirect("/"+ listName)
      }
    })
  }

});

app.post("/delete", function(req,res){
  const checkedItemID = req.body.checkbox
  const listName = req.body.listName

  if (listName === day) {
    obj.Item.findByIdAndRemove(checkedItemID, {useFindAndModify: false}, function(err){
      if (err){
        console.log(err)
      } else {
        res.redirect("/")
      }
    })
  } else {
    obj.List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    })
  }
})

app.get("/:customListName", function (req, res) {
  const customListName =  _.capitalize(req.params.customListName) 
  obj.List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if(!foundList){
        const list = new obj.List({
          name: customListName,
          items: obj.defaultItems
        })
        list.save()
        res.redirect("/" + customListName)
      } else {
        res.render("list",  {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
