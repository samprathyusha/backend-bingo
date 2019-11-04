var jwt = require('jsonwebtoken');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;


var secretkey="gariyasi"
function Newtoken(data){
console.log(data)
    const token = jwt.sign({ data },secretkey);
    return token;
}

// function verify(data){
//   return new Promise(function(resolve,reject){
// jwt.verify(data,secretkey,function(err,userdata){
//   if(err){
  
//    resolve("forbidden");
//   }
//   else{
//     console.log("this is from token.js page "+userdata);
//     resolve(userdata);
//   }
// })
// })
// }

function verify(req, res, next){
  console.log("verify")

  jwt.verify(req.token,secretkey,function(err,userdata){
    if(err){
      res.sendStatus(403);
      }
    else{
      console.log("this is from token.js page "+userdata);
      req.userdata = userdata;
      next();
    }
  })
  
  }

function ensureToken(req, res, next) {
console.log("ensureToken")
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;

      next();
    } else {
      res.sendStatus(403);
    }
  }

module.exports.Newtoken = Newtoken;
module.exports.ensureToken = ensureToken;
module.exports.verify = verify;