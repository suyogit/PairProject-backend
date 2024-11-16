const express=require("express")
const app=express()

app.use("/test",(req,res)=>{
    res.send("Hello test")
})

app.use("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(3000,()=>{
    console.log("Server started on port 3000")
})