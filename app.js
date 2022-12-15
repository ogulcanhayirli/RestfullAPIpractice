const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Succesfully Deleted All Articles");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle").get(function(req,res){
    const requestedTitle = req.params.articleTitle;
    Article.findOne({title:requestedTitle}, function(err, requestedArticle){    
        if(requestedArticle){
            res.send(requestedArticle);
        } else {
            res.send("No articles matching that title");
        }
    })
}).put(function(req,res){
    const requestedTitle = req.params.articleTitle;
    Article.findOneAndReplace({title:requestedTitle}, 
        {title: req.body.title, content:req.body.content},
        function(err){
            if(!err){
                res.send("You have successfully replaced the article");
            } else{
                res.send(err)
            }
        });
}).patch(function(req,res){
    const requestedTitle = req.params.articleTitle;
    Article.updateOne({title:requestedTitle}, 
        {title: req.body.title, content:req.body.content}, 
        function(err){
            if(!err){
                res.send("You have successfully updated the article");
            } else{
                res.send(err)
            }
        });
}).delete(function(req,res){
    const requestedTitle = req.params.articleTitle;
    Article.deleteOne({title:requestedTitle}, 
        function(err){
            if(!err){
                res.send("You have successfully deleted the article");
            } else{
                res.send(err)
            }
        });
});


app.listen(process.env.PORT || port, function () {
  console.log("Server started on port 3000");
});
