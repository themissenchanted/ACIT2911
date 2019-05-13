const request = require('supertest')("http://localhost:8080");
const assert = require('chai').assert;
const expect = require('chai').expect;
const nock = require('nock');
const superagent = require('superagent');
const supertest = require('supertest');
const should = require('chai').should;

var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('./app.js');
const tdd = require('./arrMethods.js');

describe('GET /', function () {
    it("should return landing page", function (done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /groceries', function () {
    it("should return grocery webpage", function (done) {
        chai.request(app)
            .get('/groceries')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /electronics', function () {
    it("should return electronics webpage", function (done) {
        chai.request(app)
            .get('/electronics')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /instruments', function () {
    it("should return instruments webpage", function (done) {
        chai.request(app)
            .get('/instruments')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /todays_deals', function () {
    it("should return todays_deals webpage", function (done) {
        chai.request(app)
            .get('/todays_deals')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            })
    });
});

describe("POSTS /register", function () {
    it('should signup as mocha@gmail.com ', (done) => {
        chai.request.agent(app)
            .post('/register')
            .send({
                username: "mocha@gmail.com",
                password: "Test1234",
            });
            done();
    });
});

describe("POSTS /login", function () {
    it('should login as mocha@gmail.com ', (done) => {
        chai.request.agent(app)
            .post('/login')
            .send({
                username: "mocha@gmail.com",
                password: "Test1234",
            });
        done();
    });
});

describe("GET /unknownPage", function () {
    it('should redirect for unknown route', function (done) {
        chai.request(app)
            .get('/unknown')
            .end(function(err, res) {
                expect(res).to.redirect;
                done();
            });
    });
});

describe('GET /vcode', function () {
    it("should return the users cart", function (done) {
        chai.request(app)
            .get('/cart')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            })
    });
});

describe('GET /cart', function () {
    it("should return the users cart", function (done) {
        chai.request(app)
            .get('/cart')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            })
    });
});

describe('POST /add_cart/:id', function () {
    it("should add something to the cart and redirect to the cart page", function (done) {
        chai.request(app)
            .post('/add_cart/headphones1')
            .send({
                "id": "headphones1",
                "img": "<img class=\"card-img-top img-fit\" src=\"img/products/electronics/headphones.png\" alt=\"Card image cap\">",
                "title": "Slick Headphones",
                "description": "Amazing look. Amazing sound. Amazing taste.",
                "price": 89.99,
                "qty": 1,
                "cartImg": "<img src=\"img/products/electronics/headphones.png\" class=\"img-fit cart-img\" alt=\"cart item image\">"
            });
        done();
    });
});

describe('GET /checkout', function () {
    it("should run the checkout functions", function (done) {
        chai.request(app)
            .get('/cart')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            })
    });
});

describe("POSTS /update_cart", function () {
    it('should login as mocha@gmail.com ', (done) => {
        chai.request.agent(app)
            .post('/update_cart')
            .send({
                qty: 2,
                "headphones1": "headphones1",
            });
        done();
    });
});

describe("Summing Arrays", function () {
    it("should sum all the values inside an array", function (done) {
        let sum = tdd.arrSum([1, 2, 3]);
        assert.equal(sum, 6);
        done();
    })
});