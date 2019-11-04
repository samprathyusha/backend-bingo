var express = require('express');
var jwt = require('jsonwebtoken');
var route = express.Router();
var state = {}
//importing the controllers
var controller= require('./controllers/controllers.js');
var tokenpage= require('./controllers/token.js');

//tokenpage.ensureToken,tokenpage.verify,

route.post('/userregister',controller.registerusers);
route.post('/finduserlike',controller.finduserlike);
route.post('/login',controller.login);
route.post('/createbingoboard',tokenpage.ensureToken,tokenpage.verify,controller.createbingoboard);
route.post('/listbingowaitingboards',controller.listbingowaitingboards);
route.post('/updatebingoboard',tokenpage.ensureToken,tokenpage.verify,controller.updatebingoboard);
route.post('/checkprivatekey',controller.checkprivatekey);
route.post('/destroy',controller.destroy);
route.post('/profile',tokenpage.ensureToken,tokenpage.verify,controller.profile);
module.exports= route;