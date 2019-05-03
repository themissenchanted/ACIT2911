const express = require('express');
const path = require('path');
const utils = require('./utils.js');
const bodyParser = require('body-parser');
const hbs = require('hbs');

var app = express();
const router = express.Router();

hbs.registerPartials(__dirname + '/partials');

app.set('views', __dirname);
app.set('view engine', 'hbs');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (request, response) => {
  response.render("landing.hbs");
});

router.get('/cart', (request, response) => {
  response.sendFile(path.join(__dirname+ "/cart.html"));
});

router.get('/groceries', (request, response) => {
  response.sendFile(path.join(__dirname+ "/groceries.html"));
});

router.get('/electronics', (request, response) => {
  response.sendFile(path.join(__dirname + "/electronics.html"));
});

router.get('/instruments', (request, response) => {
  response.sendFile(path.join(__dirname+ "/instruments.html"));
});

app.use('/', router);

var server = app.listen(8080, () => {
  console.log('Server is up and running');
  utils.init();
});

app.post('/login', (request, response) => {
  var db = utils.getDb();
  db.collection('users').find({}).toArray((err, result) => {
    if (err) {
      response.send('Unable to get login right now');
    }
    for (i=0; i < result.length; i++) {
      if (request.body.username === result[i].username) {
        if (request.body.password === result[i].password) {
          response.render('index.hbs', {
            success_login: 'You are logged in!'
          })
        } else {
          response.render('index.hbs', {
            success_login: 'Invalid login info'
          })
        }
      } else {
        response.render('index.hbs', {
          success_login: 'Invalid login info'
        })
      }
    }
  });
});

app.post('/register', function (req, res) {
  var db = utils.getDb();
  req.body.cart = [];
  db.collection('users').insertOne(req.body);
  res.render("landing.hbs", {
    cartLink: "<li class=\"nav-item\" id=\"cart\">\n" +
        "<a href=\"http://localhost:8080/cart\" class=\"nav-link\">Your Cart</a>\n" +
        "</li>"
  });
});

module.exports = server;

