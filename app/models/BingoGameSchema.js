var mongoose= require('mongoose');
const newbingogame=mongoose.Schema({
  PlayerOneBoard:{
    type:Array,
    require:true
  },
  PlayerOneDetails:{
    type:JSON,
    require:true
  },
  PlayerTwoBoard:{
    type:Array,
    require:true
  },
  PlayerTwoDetails:{
    type:JSON,
    require:true
  },
  BetCost:{
    type:String,
    require:true
  },
  GameWinner:{
    type:JSON,
    require:true
  },
  Privatekey:{
    type:String,
    require:true
  },
  BoardId:{
    type:String,
    require:true
  }
});

const bingoboard=module.exports=mongoose.model('BingoGameRoom', newbingogame);