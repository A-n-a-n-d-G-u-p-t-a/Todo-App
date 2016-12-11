var express = require("express");
//creating our express app
var app = express();
//requiring mongoose for mongo db
var mongoose = require("mongoose");
//requiring morgan for logs represents to the console
var morgan = require("morgan");
//requiring bodyparser pull information from html post
var bodyParser = require("body-parser");
//requiring mehtod-override for simulate delete and put
var methodOverride = require("method-override");

//connecting with the database
mongoose.connect(
  'mongodb://anandgupta:kukku.193@jello.modulusmongo.net:27017/datyz8Ev');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); //log level dev which logs every request to the console
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); //parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

//defining the model  MongoDB will automatically generate an _id for each todo that we create
var Todo = mongoose.model('Todo', {
  text: String
});

//specifying the routes

//implementing the get method
app.get('/api/todos', function(request, response) {
  //use mongo to get all the todo into the database
  Todo.find(function(err, todos) {
    if (err) {
      response.send(err);
    }
    //return all the todo in json format
    response.json(todos);
  });
});

//implementing the post method
app.post('/api/todos', function(request, response) {
  //create a todo in a database based on the ajax request from angular js
  Todo.create({
    text: request.body.text,
    done: false
  }, function(err, todo) {
    if (err) {
      response.sent(err);
    }
    //get and return all the todo as soon as you create one
    Todo.find(function(err, todos) {
      if (err) {
        response.send(err);
      }
      //return all the todo in json format
      response.json(todos);
    });
  });
});

//implementing the delete method
// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
  Todo.remove({
    _id: req.params.todo_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you delete another
    Todo.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
});

/**
HTTP Verb	URL	Description
GET	/api/todos	Get all of the todos
POST	/api/todos	Create a single todo
DELETE	/api/todos/:todo_id	Delete a single todo
*/

app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

//listen : start app with node server js
app.listen(8080);
console.log("Applicaion listening on port 8080");
