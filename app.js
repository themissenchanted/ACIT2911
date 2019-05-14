const express = require('express');
const path = require('path');
const utils = require('./utils.js');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const cart_string = "'s Cart";
const captchapng = require("captchapng");
const session = require('express-session');
const arr = require('./arrMethods');

var electronics_products = require('./data/electronics');
var instruments_products = require('./data/instruments');
var groceries_products = require('./data/groceries');
var all_items = electronics_products.concat(instruments_products, groceries_products);

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

const redirectNotLoggedIn = (req, res, next) => {
    if (!req.session.username) {
        res.render("landing.hbs", {
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
            modal: '<script type="text/javascript">\n' +
                '    $(window).on(\'load\',function(){\n' +
                '        $(\'#signup\').modal(\'show\');\n' +
                '    });\n' +
                '</script>'
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

router.get('/cart', redirectNotLoggedIn, (request, response) => {
    var sub_total = [];
    var sub_total_points = [];
    for (i=0; i < request.session.cart.length; i++) {
        sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
        sub_total_points.push(request.session.cart[i].points * request.session.cart[i].qty);
    }
    if (!request.session.username) {
        response.render("cart.hbs", {
            items: request.session.cart,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
        });
    } else {
        response.render('cart.hbs', {
            items: request.session.cart,
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points)
        });
    }
});

router.get('/groceries', (request, response) => {
    if (!request.session.username) {
        response.render("groceries.hbs", {
            products: groceries_products,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('groceries.hbs', {
            products: groceries_products,
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        });
    }
});

router.get('/electronics', (request, response) => {
    if (!request.session.username) {
        response.render("electronics.hbs", {
            products: electronics_products,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('electronics.hbs', {
            products: electronics_products,
            cartLink: `<li class="nav-item dropdown" id="cart"><a href="http://localhost:8080/cart"
 class="nav-link dropdown-toggle" role="button" data-toggle="dropdown"><img src="img/cart.png" class="cart-icon">My Cart
 </a><div class="dropdown-menu dropmenu cart-dropmenu">
                    <div class="cart-menu"><h5>Product Name</h5><p>$5.99</p>
                        <div class="row">
                            <div class="col-8">
                              <p>quantity:</p>
                            </div>
                            <div class="col-4">
                              <span><a><img src="img/minus.png" class="cart-button"></a> 1 <a><img src="img/plus.png" 
                              class="cart-button"></a></span>
                            </div>
                        </div>
                    </div>
                    <div class="cart-menu"><h5>Product Name</h5><p>$7.99</p>
                        <div class="row">
                            <div class="col-8">
                              <p>quantity:</p>
                            </div>
                            <div class="col-4">
                              <span><a href="#"><img src="img/minus.png" class="cart-button"></a> 2 <a><img src="img/plus.png" 
                              class="cart-button"></a></span>
                            </div>
                        </div>
                    </div>
                    <div class="cart-total">Total: $999.99</div>
                    <button class="btn btn-pink">Checkout</button>
                </div></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        });
    }
});

router.get('/instruments', (request, response) => {
    if (!request.session.username) {
        response.render("instruments.hbs", {
            products: instruments_products,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('instruments.hbs', {
            products: instruments_products,
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        });
    }
});

router.get('/newItem', redirectNotLoggedIn, (request, response) => {
    const item = [];
    var randomItemIndex = Math.floor(Math.random() * all_items.length);
    var randomItem = all_items[randomItemIndex];
    item.push(randomItem);
    request.session.deal = item;
    response.redirect('/todays_deals');
});

router.get('/todays_deals', (request, response) => {
    if (!request.session.username) {
        response.render("todays_deals.hbs", {
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
            item: request.session.deal
        });
    } else {
        response.render('todays_deals.hbs', {
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            item: request.session.deal
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
            popup: '<script>\n' +
                '    $(document).ready(function(){\n' +
                '        alert(\'Invalid verification code, try again!\');\n' +
                '    });\n' +
                '</script>',
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
            modal: '<script type="text/javascript">\n' +
                '    $(window).on(\'load\',function(){\n' +
                '        $(\'#login\').modal(\'show\');\n' +
                '    });\n' +
                '</script>'
        });
        return;
    }

    var db = utils.getDb();
    db.collection('users').find({}).toArray((err, result) => {
        if (err) {
            response.send('Unable to get login right now');
        }
        if (result.length === 0) {
            response.render('landing.hbs', {
                popup: '<script>\n' +
                    '    $(document).ready(function(){\n' +
                    '        alert(\'Invalid login information, try again!\');\n' +
                    '    });\n' +
                    '</script>',
                loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
                imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
            });
        }
        for (i=0; i < result.length; i++) {
            if (request.body.username === result[i].username) {
                if (request.body.password === result[i].password) {
                    request.session.username = result[i].username;
                    request.session.cart = result[i].cart;
                    request.session.points = result[i].points;
                    response.render('landing.hbs', {
                        cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.body.username + cart_string}</a></li>`,
                        loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
                    });
                } else {
                    response.render('landing.hbs', {
                        popup: '<script>\n' +
                            '    $(document).ready(function(){\n' +
                            '        alert(\'Invalid login information, try again!\');\n' +
                            '    });\n' +
                            '</script>',
                        loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
                        imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
                    });
                }
            } else {
                response.render('landing.hbs', {
                    popup: '<script>\n' +
                        '    $(document).ready(function(){\n' +
                        '        alert(\'Invalid login information, try again!\');\n' +
                        '    });\n' +
                        '</script>',
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
    request.body.points = 0;
    db.collection('users').find({username: `${request.body.username}`}).toArray().then(function (result) {
        if (result.length === 0) {
            db.collection('users').insertOne(request.body);
            request.session.username = request.body.username;
            request.session.cart = request.body.cart;
            request.session.points = request.body.points;
            response.render('landing.hbs', {
                cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
                loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>'
            });
        } else {
            response.render('landing.hbs', {
                popup: '<script>\n' +
                    '    $(document).ready(function(){\n' +
                    '        alert(\'An account already exists with that username, try again!\');\n' +
                    '    });\n' +
                    '</script>',
                loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
                imgTag: '<img id="captchapng" src="/vcode" alt="Smiley Face" height="30" width="80">',
                modal: '<script type="text/javascript">\n' +
                    '    $(window).on(\'load\',function(){\n' +
                    '        $(\'#signup\').modal(\'show\');\n' +
                    '    });\n' +
                    '</script>'
            });
        }
    });
});

app.get('/logout', redirectNotLoggedIn, (request, response) => {
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

app.get('/add_cart/:id', redirectNotLoggedIn, (request, response) => {
    for (i=0; i < all_items.length; i++) {
        if (request.params.id === all_items[i].id) {
            try {
                if (request.params.id == request.session.cart[i].id) {
                    request.session.cart[i].qty += 1;
                    break;
                } else {
                    request.session.cart.push(all_items[i]);
                    break;
                }
            } catch (e) {
                request.session.cart.push(all_items[i]);
                break;
            }
        }
    }
    var db = utils.getDb();
    var myquery = { username: `${request.session.username}` };
    var newvalues = { $set: { cart: request.session.cart} };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
    response.redirect('/cart')
});

app.post('/update_cart', redirectNotLoggedIn, (request, response) => {
    const keys = Object.keys(request.body);
    var item = keys[1];
    for (i=0; i < request.session.cart.length; i++) {
        if (request.session.cart[i].id === item) {
            if (request.body.qty == 0) {
                delete request.session.cart[i];
            } else {
                request.session.cart[i].qty = request.body.qty;
            }
        }
    }
    request.session.cart = arr.arrayRemove(request.session.cart, null);
    var db = utils.getDb();
    var myquery = { username: `${request.session.username}` };
    var newvalues = { $set: { cart: request.session.cart} };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
    response.redirect('/cart')
});

app.get('/checkout', redirectNotLoggedIn, (request, response) => {
    var sub_total = [];
    var sub_total_points = [];
    for (i=0; i < request.session.cart.length; i++) {
        sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
        sub_total_points.push(request.session.cart[i].points * request.session.cart[i].qty);
    }
    var point_cost = 0;
    for (i=0; i < request.session.cart.length; i++) {
        point_cost += (request.session.cart[i].points * request.session.cart[i].qty)
    }
    if (request.session.cart.length === 0) {
        response.render('cart.hbs', {
            items: request.session.cart,
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points),
            script: '<script>\n' +
                '    $(document).ready(function(){\n' +
                '        alert(\'You need to add something to your cart first silly!\');\n' +
                '    });\n' +
                '</script>'
        });
    }
    for (i=0; i < request.session.cart.length; i++) {
        request.session.points += (Math.round((request.session.cart[i].price * request.session.cart[i].qty) / 4));
    }
    request.session.cart = [];
    var db = utils.getDb();
    var myquery = { username: `${request.session.username}` };
    var newvalues = { $set: { cart: request.session.cart, points: Math.round(request.session.points)} };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
    response.render('landing.hbs', {
        cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
        loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        orderPlaced: '<script>\n' +
            '    $(document).ready(function(){\n' +
            '        alert(\'Your order has been placed, thank you!\');\n' +
            '    });\n' +
            '</script>'
    });
});

app.get('/checkout_points', redirectNotLoggedIn, (request, response) => {
    var sub_total = [];
    var sub_total_points = [];
    for (i=0; i < request.session.cart.length; i++) {
        sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
        sub_total_points.push(request.session.cart[i].points * request.session.cart[i].qty);
    }
    var point_cost = 0;
    for (i=0; i < request.session.cart.length; i++) {
        point_cost += (request.session.cart[i].points * request.session.cart[i].qty)
    }
    if (request.session.cart.length === 0) {
        response.render('cart.hbs', {
            items: request.session.cart,
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points),
            script: '<script>\n' +
                '    $(document).ready(function(){\n' +
                '        alert(\'You need to add something to your cart first silly!\');\n' +
                '    });\n' +
                '</script>'
        });
    }
    if (request.session.points < point_cost) {
        response.render('cart.hbs', {
            items: request.session.cart,
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points),
            script: '<script>\n' +
                '    $(document).ready(function(){\n' +
                '        alert(\'You do not have enough points to make this purchase yet, try earning some more!\');\n' +
                '    });\n' +
                '</script>'
        });
    } else {
        request.session.points -= point_cost;
        request.session.cart = [];
        var db = utils.getDb();
        var myquery = { username: `${request.session.username}` };
        var newvalues = { $set: { cart: request.session.cart, points: request.session.points} };
        db.collection("users").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
        });
        response.render('landing.hbs', {
            cartLink: `<li class="nav-item" id="cart"><a href="http://localhost:8080/cart" class="nav-link">${request.session.username + cart_string}</a></li>`,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            orderPlaced: '<script>\n' +
                '    $(document).ready(function(){\n' +
                '        alert(\'Your order has been placed, thank you!\');\n' +
                '    });\n' +
                '</script>'
        });
    }
});

app.use(function(req, res) {
    res.redirect("/");
});

module.exports = server;
