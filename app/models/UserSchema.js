var mongoose= require('mongoose');
const userdetailsschema=mongoose.Schema({
  
  UserName:{
    type:String,
    require:true
  },

  Email:{
    type:String,
    require:true
  },
  PhoneNumber:{
    type:String,
    require:true
  },
  Password:{
      type:String,
      require:true
  }
});

const registerusers=module.exports=mongoose.model('registerusers', userdetailsschema);