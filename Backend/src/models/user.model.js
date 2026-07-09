const mongoose = require("mongoose");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username already taken"],
        required:true,
    },
    email:{
        type:String,
        unique:[true,"Email already taken"],
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})
const userModel=mongoose.model("userModel",userSchema)
module.exports=userModel