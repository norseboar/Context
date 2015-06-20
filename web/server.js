"use strict";

var express = require('express');
var bodyParser = require('body-parser');

// BASE SETUP ================================================================
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// DEFINE ROUTES =============================================================
var router = express.Router();

// test route
router.get('/', function(req, res) {
  res.json({message: 'hello world!'});
});

// REGISTER ROUTES ===========================================================
app.use('/api', router);

// START SERVER ==============================================================
app.listen(port);
console.log('Listening on port ' + port);
