const express=require("express")
const cookierParser=require("cookie-parser")
const cors=require("cors")
// used to create an instance
const app=express()
// allows req.body's data to be read
app.use(express.json())
app.use(cookierParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// require all the routes here
const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")
// using all the routes
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
module.exports=app
