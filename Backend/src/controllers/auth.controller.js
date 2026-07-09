const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const tokenBlacklistModel=require("../models/blacklist.model")
/**
 * @name registerUserController
 * @description Register a new user, expects username,email and password in req.body
 * @access Public
 */
async function registerUserController(req,res){
    const{username,email,password}=req.body
    if(!username || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide all fields"
        })
    }
    const isUserAlreadyExists=await userModel.findOne({
        $or: [{username},{email}]
    })

    if(isUserAlreadyExists){
        // isUserAlreadyExists.username==username
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }

    // first we hash a password then store it in database
    const hash=await bcrypt.hash(password,10)
    const user=await userModel.create({
        username,
        email,
        password:hash        
    })
    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(200).json({
        success:true,
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


    
}

/**
 *  @name loginUserController
 *  @description Login a user, expects email and password in req.body
 *  @access Public
 */
async function loginUserController(req,res){
    const{email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user)
    {
        return res.status(400).json({
            success:false,
            message:"User does not exist"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            success:false,
            message:"Password is incorrect"
        })
    }
    const token=jwt.sign(
       {id:user._id,username:user.username},
       process.env.JWT_SECRET,
       {expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })



}

/**
 * @name logoutUserController
 * @description Clear token from user cookie and add the token in blacklist
 * @access Public
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}
/**
 * @name getMeController
 * @description Get the current logged in user details
 * @access Private
 */
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        message:"User details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}