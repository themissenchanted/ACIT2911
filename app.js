const express = require('express');
const path = require('path');
const utils = require('./utils.js');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const cart_string = "'s Cart";
const session = require('express-session');

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

app.use(session({
  name: "nozamA",
  resave: false,
  saveUninitialized: false,
  secret: "ssh!quiet,it\'asecret!'",
  cookie: {
    maxAge: 1000 * 60 * 60 * 60 * 2,
    sameSite: true,
  }
}));

const redirectCart = (req, res, next) => {
  if (!req.session.username) {
    res.render("landing.hbs", {
      loginlogoutButton: `<li class="nav-item" id="loginbutton">
      <a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a>
      </li>`
    });
  } else {
    next()
  }
};

router.get('/', (request, response) => {
  response.render("landing.hbs", {
    loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>'
  });
});

router.get('/cart', redirectCart, (request, response) => {
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

router.get('/todays_deals', (request, response) => {
  response.sendFile(path.join(__dirname+ "/todays_deals.html"));
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
          request.session.username = request.body.username;
          request.session.cart = result[i].cart;
          response.render('landing.hbs', {
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.body.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
          })
        } else {
          response.render('landing.hbs', {
            popup: "<script>alert(\'Invalid Login Information, try again!'</script>",
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>'
          });
        }
      } else {
        response.render('landing.hbs', {
          popup: '<script>alert("Invalid Login Information, try again!")</script>',
          loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>'
        });
      }
    }
  });
});

app.post('/register', function (request, response) {
  var db = utils.getDb();
  request.body.cart = [];
  db.collection('users').find({username: `${request.body.username}`}).toArray().then(function (result) {
    if (result.length === 0) {
      db.collection('users').insertOne(request.body);
      request.session.username = request.body.username;
      request.session.cart = request.body.cart;
      response.render('landing.hbs', {
        cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
        loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>'
      });
    } else {
      response.render('landing.hbs', {
        popup: '<script>alert(\'Account already exists with that username, try again!\')</script>\n',
        loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>'
      });
    }
  });
});

app.get('/logout', (request, response) => {
  request.session.destroy(err => {
    if (err) {
      response.render('landing.hbs');
    }
    response.clearCookie("nozamA");
    response.render("landing.hbs", {
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>'
    });
  })
});

module.exports = server;

