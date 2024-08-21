const mongoose=require('mongoose')
const Users=require('./Users')

const storySchema=new mongoose.Schema({
  title:{
      type:String,
      requird:true,
      trim:true
  },
  body:{
      type:String,
      required:true
  }  ,
  status:{
      type:String,
      default:'public',
      enum:['public','private']
  },
  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Users'
  },
  createdAt:{
      type:Date,
      default:Date.now
  }
})

module.exports=mongoose.model('Story',storySchema)