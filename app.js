const express = require('express');
const path = require('path');
const utils = require('./utils.js');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const cart_string = "'s Cart";
const captchapng = require("captchapng");
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
  if (!request.session.username) {
    response.render("landing.hbs", {
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
  } else {
    response.render('landing.hbs', {
      cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
      loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
    });
  }
});

router.get('/cart', redirectCart, (request, response) => {
  response.sendFile(path.join(__dirname+ "/cart.html"));
});

router.get('/groceries', (request, response) => {
  if (!request.session.username) {
    response.render("groceries.hbs", {
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
  } else {
    response.render('groceries.hbs', {
      cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
      loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
    });
  }
});

router.get('/electronics', (request, response) => {
  if (!request.session.username) {
    response.render("electronics.hbs", {
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
  } else {
    response.render('electronics.hbs', {
      cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
      loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
    });
  }
});

router.get('/instruments', (request, response) => {
  if (!request.session.username) {
    response.render("instruments.hbs", {
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
  } else {
    response.render('instruments.hbs', {
      cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
      loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
    });
  }
});

router.get('/todays_deals', (request, response) => {
  if (!request.session.username) {
    response.render("todays_deals.hbs", {
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
  } else {
    response.render('todays_deals.hbs', {
      cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
      loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
    });
  }
});

app.use('/', router);

var server = app.listen(8080, () => {
  console.log('Server is up and running');
  utils.init();
});

const getVcodeImage = (req, res) => {
  const vcode = parseInt(Math.random() * 9000 + 1000); //Generate random numbers

  // Store the randomly generated verification code in the session
  req.session.vcode = vcode;

  var p = new captchapng(80, 30, vcode); // width,height,numeric captcha
  p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

  var img = p.getBase64();
  var imgbase64 = new Buffer(img, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png"
  });
  res.end(imgbase64);
};

router.get('/vcode',getVcodeImage);

app.post('/login', (request, response) => {

  if (request.body.vcode != request.session.vcode) {
    response.render('landing.hbs', {
      popup: "<script>alert('Invalid Captcha Information, try again!')</script>",
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
    return;
  }

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
          });
        } else {
          response.render('landing.hbs', {
            popup: "<script>alert(\'Invalid Login Information, try again!'</script>",
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
          });
        }
      } else {
        response.render('landing.hbs', {
          popup: '<script>alert("Invalid Login Information, try again!")</script>',
          loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
          imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
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
        loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
        imgTag: '<img id="captchapng" src="/vcode" alt="Smiley Face" height="30" width="80">'
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
      loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
      imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
    });
  })
});

app.use(function(req, res) {
    res.redirect("/");
});

module.exports = server;

