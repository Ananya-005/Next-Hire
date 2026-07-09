const mongoose=require("mongoose")
const blacklistTokenSchema= new mongoose.Schema({
    token:{
        type:String,
        required:["true","token is required to blacklist"] 
    }
    },{
        timestamps:true
})

const tokenBlacklistModel=mongoose.model("tokenBlacklistModel",blacklistTokenSchema)

module.exports=tokenBlacklistModel