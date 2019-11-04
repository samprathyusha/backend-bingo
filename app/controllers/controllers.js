//importing schema
const registerusers = require('../models/UserSchema.js');
const encrypanddecrypt = require('./Encryptanddecrypt.js');
const tokenpage= require('./token');
const newbingogame= require('../models/BingoGameSchema')



exports.registerusers = function (req, res, next) {
    console.log(req.body);
    encrypanddecrypt.encrypt(req.body.Password).then(encryptedpassword => {

        let newuserdetails = new registerusers({
            UserName: req.body.name,
            Email: req.body.email,
            PhoneNumber: req.body.phonenumber,
            Password: encryptedpassword
        })



        registerusers.find({ $or: [{ UserName: req.body.name }, { Email: req.body.email }, { PhoneNumber: req.body.phonenumber }] }, function (err, user) {
            console.log(user);

            if (err) {
                res.json(err);
            } else if (user.length == 0) {

                newuserdetails.save((err, newuserdetails) => {
                    if (err) {
                        res.json(err);
                    } else {
                        console.log("userdetails has added to the database");
                        res.json("RegisterSuccessful");
                    }
                });
            } else if (user.length > 0) {
                res.json("ThisUserExist");
            }
        })
    })
}


exports.login = function (req, res, next) {
    console.log(req.body)
    registerusers.find({ PhoneNumber: req.body.phonenumber }, function (err, user) {
        if (err) {
            res.json(err);
        } else {
            if (user.length > 0) {
console.log(user);
                var password = { "encryptpassword": user[0].Password, "requestedpassword": req.body.Password }
                //decryp the user.password and comparing it with the req.body.password
                encrypanddecrypt.decrypt(password).then(result => {
                    if (result) {

                        var setToken = tokenpage.Newtoken(user[0]);
                        console.log(setToken);


                        res.status(200).json({
                            status: '200',
                            token: 'jwt ' + setToken
                        });


                    } else {
                        console.log("password is invalid");
                        res.json("password is invalid");
                    }

                })
            } else if (user.length == 0) {
                res.json("this number is not get register");
            }
        }

    });
}

exports.finduserlike = function (req, res, next) {
    console.log(req.body)
    if (req.body.enteredid == "phonenumber") {
        var query = { PhoneNumber: req.body.entereddata }
    } else if (req.body.enteredid == "Email") {
        var query = { Email: req.body.entereddata }

    } else if (req.body.enteredid == "Name") {
        var query = { UserName: req.body.entereddata }

    }
    registerusers.find(query, function (err, user) {
        if (err) {

        } else {


            console.log(user);
            if (user.length == 0) {
                res.json(req.body.enteredid + " available");
            } else if (user.length > 0) {
                res.json(req.body.enteredid + " not available")

            }
        }
    })
}


exports.createbingoboard=function(req,res,next){
  console.log("createbingoboard");
  console.log(req.body);
  var data=req.body;
  var userdata=req.userdata;
  var val = Math.floor(1000 + Math.random() * 9000);
  data.BoardId=userdata.data.UserName+val;
  data.PlayerOneDetails={'userid':userdata.data._id,'username':userdata.data.UserName};
  let newbingoboard= new newbingogame(data)     
      console.log(newbingoboard);
      newbingoboard.save((err, newbingoboard) => {
          if (err) {
              res.json(err);
          } else {
              console.log("room has created successfully"+newbingoboard);
              res.json(newbingoboard);
          }
      });
}


exports.listbingowaitingboards=function(req,res,next){
console.log("listbingowaitingboards");
console.log(req.body);
newbingogame.find({PlayerTwoDetails:{$exists: false } },{ _id: 1,BoardId:1}).sort({_id:-1}).then(result=>{
    console.log(result);
    res.json(result);
   })
}


exports.updatebingoboard=function(req,res,next){
    var userdata=req.userdata;
    console.log(userdata);
    console.log(req.body.BoardId);
    console.log(req.body.RoomId)

    var update={
        PlayerTwoDetails:{'userid':userdata.data._id,'username':userdata.data.UserName},
        PlayerTwoBoard:req.body.PlayerTwoBoard
    }
    newbingogame.updateOne({_id:req.body.RoomId,PlayerTwoDetails:{$exists:false}},{$set:update}).then(result=>{
      console.log(result);
      if(result.nModified==0){
        res.json({mgs:"Sorry some one already entered into game"});
      }else if(result.nModified==1){
         res.json({mgs:"Successfully",PlayerTwoBoard:req.body.PlayerTwoBoard,BoardId:req.body.BoardId});
      }
    })
}

exports.checkprivatekey=function(req,res,next){
    console.log(req.body);
    var roomid=req.body.roomid;
    newbingogame.find({_id:roomid},{_id:0,Privatekey:1}).then(result=>{
        console.log(JSON.stringify(result[0]));
        if(JSON.stringify(result[0])=="{}"){
            console.log("no private key");
            res.json("no private key");
        }else{
            console.log(result);
            res.json(result[0].Privatekey);
        }
       })
}

exports.destroy=function(req,res,next){
    console.log('request');
    console.log(req.body);
    newbingogame.deleteOne({_id:req.body.roomid},function(err,result){
        if(err){
            res.json('somethingwentwrong');
        }else if(result.deletedCount==1){
res.json('deleted');
        }
    })
}

exports.profile=function(req,res,next){
    console.log(req.userdata.data._id);
    //  console.log('profile : ' + req.userdata);
     var userdata=req.userdata;
     newbingogame.find( { $or: [ { 'PlayerOneDetails.userid':  req.userdata.data._id  }, { 'PlayerTwoDetails.userid':  req.userdata.data._id  } ] } ).then(result=>{
          console.log(result.length);
         var details= req.userdata.data;
         details.totalgames=result.length;
          res.json(details);

     })
}