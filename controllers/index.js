//Third-party package to generate verification code
const captchapng = require("captchapng");

//Import the methods inside the tools
const databaseTools = require('../tools/util.js');

var products = require('../data/products.json');

/**
 * Final processing, return to the login page to the browser
 */
module.exports.getLoginPage = (req, res) => {

    res.render("login");
};

module.exports.getUserInfo = (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    if (!req.query.username || req.query.username !== req.session.username) {
        return res.redirect('/?username=' + req.session.username);
    }

    res.render('index', {
        title: 'NodeJS Online Market',
        products,
        username: req.session.username
    });
    console.log(JSON.stringify(req.session.userinfo, null, 4))
};

/**
 * Final processing, return to the registration page to the browser
 */
module.exports.getRegisterPage = (req, res) => {
    res.render("register");
};

/**
 * Final processing, save username password
 * Return result to the browser
 */
module.exports.register = (req, res) => {
    const result = {
        status: 0,
        message: "You have signed up successfully!"
    };
    console.log(req.body);
    //Go to the database to query whether the user has already existed.
    // If already exists, return the username to the browser.
    databaseTools.findOne('accountInfo', {
        username: req.body.username
    }, (err, doc) => {
        if (doc) {
            //Username exists
            result.status = 1;
            result.message = "Username already exists!";

            res.json(result);
        } else {

            databaseTools.findOne('accountInfo', {
                phonenum: req.body.phonenum
            }, (err, doc) => {
                if (doc) {
                    //Number exists
                    result.status = 1;
                    result.message = "Number already exists!";

                    res.json(result);
                } else {
                    databaseTools.findOne('accountInfo', {
                        email: req.body.email
                    }, (err, doc) => {
                        if (doc) {
                            //Email exists
                            result.status = 1;
                            result.message = "Email already exists!";

                            res.json(result);
                        } else {
                            databaseTools.insertOne("accountInfo", req.body, (err, result2) => {

                                if (result2 == null) {
                                    //Failure
                                    result.status = 2;
                                    result.message = "Sign up failed!";
                                }

                                res.json(result);
                            });
                        }
                    });
                }
            });
        }
    })
};

/**
 * Final processing, return image verification code
 */
module.exports.getVcodeImage = (req, res) => {
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

/**
 * log in processing
 */
module.exports.login = (req, res) => {
    const result = {
        status: 0,
        message: "Log in successful!"
    };

    // Verification code
    if (req.body.vcode != req.session.vcode) {
        result.status = 1;
        result.message = "Invalid verification code";
        res.json(result);
        return;
    }
    // Go to the database and verify with username & password
    databaseTools.findOne("accountInfo", {
        username: req.body.username,
        password: req.body.password
    }, (err, doc) => {
        if (doc == null) {
            result.status = 2;
            result.message = "Invalid user name or password";
        } else {
            console.log(doc);
            //Login successfully, Save account detail to the session
            req.session.username = req.body.username;
            req.session.userinfo = doc;
        }

        res.json(result);
    })
};

/**
 * log out processing
 */
module.exports.logout = (req, res) => {
    //Empty the value in the session
    req.session.username = null;

    //Jump back to the login interface
    res.send(`<script>window.location.href='/login'</script>`)
};