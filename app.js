const express = require('express');
const utils = require('./utils.js');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const captchapng = require("captchapng");
const session = require('express-session');
const arr = require('./arrMethods');
const sched = require('node-schedule');

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

const getLocalDeal = () => {
    var db = utils.getDb();
    const item = [];
    const newList = Array.from(all_items);
    var randomItemIndex = Math.floor(Math.random() * newList.length);
    var randomItem = newList[randomItemIndex];
    var discount = +(Math.round((randomItem.price * 0.25) + "e+2")  + "e-2");
    randomItem.price -= +(Math.round((discount) + "e+2")  + "e-2");
    item.push(randomItem);
    var myobj = { deal: item };
    db.collection('deal').drop().then(function () {
        db.collection("deal").insertOne(myobj, function(err, res) {
            if (err) throw err;
        });
    }).catch(function () {
        db.collection("deal").insertOne(myobj, function(err, res) {
            if (err) throw err;
        });
    });
};

const redirectNotLoggedIn = (req, res, next) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,
    }];
    var sub_total = [];
    if (req.session.username) {
        if (req.session.cart.length > 0) {
            cart = req.session.cart;
            for (i=0; i < req.session.cart.length; i++) {
                sub_total.push(req.session.cart[i].price * req.session.cart[i].qty);
            }
        }
    }
    if (!req.session.username) {
        res.render("landing.hbs", {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
            modal: '<script type="text/javascript">\n' +
                '    $(window).on(\'load\',function(){\n' +
                '        $(\'#signup\').modal(\'show\');\n' +
                '    });\n' +
                '</script>'
        });
    } else {
        next();
    }
};

router.get('/newItem', (request, response) => {
    if (request.session.username != 'addmin') {
        response.redirect('/todays_deals');
    } else {
        getLocalDeal();
        response.redirect('/todays_deals');
    }
});

router.get('/', (request, response) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    if (!request.session.username) {
        response.render("landing.hbs", {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('landing.hbs', {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>'
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
            cart: request.session.cart,
            items: request.session.cart,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
        });
    } else {
        response.render('cart.hbs', {
            cart: request.session.cart,
            items: request.session.cart,
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
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    if (!request.session.username) {
        response.render("groceries.hbs", {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            products: require('./data/groceries'),
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('groceries.hbs', {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            products: require('./data/groceries'),
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        });
    }
});

router.get('/electronics', (request, response) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    if (!request.session.username) {
        response.render("electronics.hbs", {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            products: require('./data/electronics'),
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('electronics.hbs', {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            products: require('./data/electronics'),
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        });
    }
});

router.get('/instruments', (request, response) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    if (!request.session.username) {
        response.render("instruments.hbs", {
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            cart: cart,
            products: require('./data/instruments'),
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('instruments.hbs', {
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            cart: cart,
            products: require('./data/instruments'),
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>'
        });
    }
});

router.get('/aboutus', (request, response) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,
    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    if (!request.session.username) {
        response.render("aboutus.hbs", {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    } else {
        response.render('aboutus.hbs', {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        });
    }
});

router.get('/todays_deals', (request, response) => {
        var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,
    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    var db = utils.getDb();
    db.collection("deal").findOne({}, function(err, result) {
        if (err) throw err;
        if (!request.session.username) {
            response.render("todays_deals.hbs", {
                cart: cart,
                sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
                imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">',
                item: result.deal
            });
        } else {
            response.render('todays_deals.hbs', {
                cart: cart,
                sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
                item: result.deal
            });
        }
    });
});

app.use('/', router);

var server = app.listen(8080, () => {
    console.log('Server is up and running');
    utils.init();
    setTimeout(function(){ getLocalDeal() }, 3000);
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
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
    if (request.body.vcode != request.session.vcode) {
        response.render('landing.hbs', {
            cart: cart,
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
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
                sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                cart: cart,
                popup: '<script>\n' +
                    '    $(document).ready(function(){\n' +
                    '        alert(\'Invalid login information, try again!\');\n' +
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
        }
        for (i=0; i < result.length; i++) {
            if (request.body.username === result[i].username) {
                if (request.body.password === result[i].password) {
                    request.session.username = result[i].username;
                    request.session.cart = result[i].cart;
                    request.session.points = result[i].points;
                    if (request.session.cart.length == 0) {
                        var cart = [{
                            title: "No Items",
                            price: 0,
                            qty: 0,
                        }];
                    } else {
                        cart = request.session.cart;
                        for (i=0; i < request.session.cart.length; i++) {
                            sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
                        }
                    }
                    response.render('landing.hbs', {
                        sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                        cart: cart,
                        loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>'
                    });
                } else {
                    var cart = [{
                        title: "No Items",
                        price: 0,
                        qty: 0,
                    }];
                    response.render('landing.hbs', {
                        cart: cart,
                        sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                        popup: '<script>\n' +
                            '    $(document).ready(function(){\n' +
                            '        alert(\'Invalid login information, try again!\');\n' +
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
                }
            } else {
                response.render('landing.hbs', {
                    cart: cart,
                    sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                    popup: '<script>\n' +
                        '    $(document).ready(function(){\n' +
                        '        alert(\'Invalid login information, try again!\');\n' +
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
            }
        }
    });
});

app.post('/register', function (request, response) {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
    var sub_total = [];
    if (request.session.username) {
        if (request.session.cart.length > 0) {
            cart = request.session.cart;
            for (i=0; i < request.session.cart.length; i++) {
                sub_total.push(request.session.cart[i].price * request.session.cart[i].qty);
            }
        }
    }
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
                cart: cart,
                sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
                loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>'
            });
        } else {
            response.render('landing.hbs', {
                cart: cart,
                sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
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
        var cart = [{
            title: "No Items",
            price: 0,
            qty: 0,

        }];

        response.render("landing.hbs", {
            cart: cart,
            sub_total: 0,
            loginlogoutButton: '<li class="nav-item" id="loginbutton"><a href="#" class="nav-link" data-toggle="modal" data-target="#login">Login</a></li>',
            imgTag: '<img id="captchapng" src="/vcode" alt="Smiley face" height="30" width="80">'
        });
    })
});

app.get('/add_cart/:id', redirectNotLoggedIn, (request, response) => {
    var check = true;
    var check2 = true;
    for (i=0; i < all_items.length; i++) {
        if (request.params.id === all_items[i].id) {
            if (request.session.cart.length === 0) {
                request.session.cart.push(all_items[i]);
                break;
            } else {
                check = false;
                break;
            }
        }
    }
    if (!check) {
        for (a=0; a < request.session.cart.length; a++) {
            if (request.session.cart[a].id === request.params.id) {
                check2 = false;
                request.session.cart[a].qty += 1;
                break;
            }
        }
        if (check2) {
            for (g=0; g < all_items.length; g++) {
                if (request.params.id === all_items[g].id) {
                    request.session.cart.push(all_items[g]);
                    break;
                }
            }
        }
    }
    var db = utils.getDb();
    var myquery = { username: `${request.session.username}` };
    var newvalues = { $set: { cart: request.session.cart} };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
    response.redirect('back')
});

app.get('/add_deal/:id', redirectNotLoggedIn, (request, response) => {
    var db = utils.getDb();
    var check = false;
    db.collection('deal').find({}).toArray((err, result) => {
        if (result.length === 1) {
            for (i=0; i < request.session.cart.length; i++) {
                if (request.params.id == request.session.cart[i].id) {
                    request.session.cart[i].qty += 1;
                    check = true;
                }
            }
            if (!check) {
                request.session.cart.push(result[0].deal[0]);
            }
            var myquery = { username: `${request.session.username}` };
            var newvalues = { $set: { cart: request.session.cart} };
            db.collection("users").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                response.redirect('back');
            });
        }
    });
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
    response.redirect('back')
});

app.get('/plusOne/:id', redirectNotLoggedIn, (request, response) => {
    for (i=0; i < request.session.cart.length; i++) {
        if (request.session.cart[i].id === request.params.id) {
            if (request.session.cart[i].qty == 5) {
                break;
            } else {
                request.session.cart[i].qty += 1;
            }
        }
    }
    var db = utils.getDb();
    var myquery = { username: `${request.session.username}` };
    var newvalues = { $set: { cart: request.session.cart} };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
    response.redirect('back')
});

app.get('/minusOne/:id', redirectNotLoggedIn, (request, response) => {
    for (i=0; i < request.session.cart.length; i++) {
        if (request.session.cart[i].id === request.params.id) {
            if (request.session.cart[i].qty == 1) {
                delete request.session.cart[i];
            } else {
                request.session.cart[i].qty -= 1;
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
    response.redirect('back')
});

app.get('/checkout', redirectNotLoggedIn, (request, response) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,
    }];
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
            cart: request.session.cart,
            items: request.session.cart,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points),
            script: '<script>\n' +
                '    $(document).ready(function (){\n' +
                '        var mymodal = document.querySelector(\'.popup3\');\n' +
                '        mymodal.style.visibility = \'visible\';\n' +
                '        mymodal.style.opacity = \'1\';\n' +
                '    })\n' +
                '</script>'
        });
    }
    for (i=0; i < request.session.cart.length; i++) {
        request.session.points += (Math.round((request.session.cart[i].price * request.session.cart[i].qty) * 0.25));
    }
    request.session.cart = [];
    var db = utils.getDb();
    var myquery = { username: `${request.session.username}` };
    var newvalues = { $set: { cart: request.session.cart, points: Math.round(request.session.points)} };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
    response.render('landing.hbs', {
        cart: cart,
        sub_total: 0,
        loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
        orderPlaced: '<script>\n' +
            '    var mymodal = document.querySelector(\'.popup5\');\n' +
            '    mymodal.style.visibility = \'visible\';\n' +
            '    mymodal.style.opacity = \'1\';\n' +
            '    setTimeout(function(){\n' +
            '        var mymodal = document.querySelector(\'.popup5\');\n' +
            '        mymodal.style.visibility = \'hidden\';\n' +
            '        mymodal.style.opacity = \'0\'; }, 3000)\n' +
            '</script>'
    });
});

app.get('/checkout_points', redirectNotLoggedIn, (request, response) => {
    var cart = [{
        title: "No Items",
        price: 0,
        qty: 0,

    }];
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
            cart: request.session.cart,
            items: request.session.cart,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points),
            script: '<script>\n' +
                '    $(document).ready(function (){\n' +
                '        var mymodal = document.querySelector(\'.popup3\');\n' +
                '        mymodal.style.visibility = \'visible\';\n' +
                '        mymodal.style.opacity = \'1\';\n' +
                '    })\n' +
                '</script>'
        });
    }
    if (request.session.points < point_cost) {
        response.render('cart.hbs', {
            cart: request.session.cart,
            items: request.session.cart,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            sub_total: Math.round(arr.arrSum(sub_total) * 100) / 100,
            tax: Math.round((arr.arrSum(sub_total) * 0.12) * 100) / 100,
            total: Math.round((arr.arrSum(sub_total) * 1.12) * 100) / 100,
            currentPoints: request.session.points,
            point_cost: arr.arrSum(sub_total_points),
            script: '<script>\n' +
                '    $(document).ready(function (){\n' +
                '        var mymodal = document.querySelector(\'.popup4\');\n' +
                '        mymodal.style.visibility = \'visible\';\n' +
                '        mymodal.style.opacity = \'1\';\n' +
                '    })\n' +
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
            cart: cart,
            loginlogoutButton: '<li class="nav-item" id="cart"><a href="http://localhost:8080/logout" class="nav-link">Logout</a></li>',
            orderPlaced: '<script>\n' +
                '    var mymodal = document.querySelector(\'.popup5\');\n' +
                '    mymodal.style.visibility = \'visible\';\n' +
                '    mymodal.style.opacity = \'1\';\n' +
                '    setTimeout(function(){\n' +
                '        var mymodal = document.querySelector(\'.popup5\');\n' +
                '        mymodal.style.visibility = \'hidden\';\n' +
                '        mymodal.style.opacity = \'0\'; }, 3000)\n' +
                '</script>'
        });
    }
});

var j = sched.scheduleJob('0 0 * * *', function(){
    var db = utils.getDb();
    const item = [];
    var randomItemIndex = Math.floor(Math.random() * all_items.length);
    var randomItem = all_items[randomItemIndex];
    var discount = +(Math.round((randomItem.price * 0.25) + "e+2")  + "e-2");
    randomItem.price -= +(Math.round((discount) + "e+2")  + "e-2");
    item.push(randomItem);
    var myobj = { deal: item };
    db.collection('deal').drop().then(function () {
        db.collection("deal").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log(res)
        });
    }).catch(function () {
        db.collection("deal").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log(res)
        });
    });
});

app.use(function(req, res) {
    res.redirect("/");
});

module.exports = server;
