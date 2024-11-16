const express=require("express")
const app=express()

// app.use("/test",(req,res)=>{
//     res.send("Hello test")
// })

// app.use("/",(req,res)=>{
//     res.send("Hello World")
// })

app.get("/user",(req,res)=>{
    console.log(req.query)
    res.send("Hello test")
})

app.get("/cart/:id/:name",(req,res)=>{
    console.log(req.params)
    res.send("Hello test")
})


app.get("/test",(req,res)=>{
    res.send("Hello test")
})

app.post("/test",(req,res)=>{
    res.send("posted succesfully")
})

app.delete("/test",(req,res)=>{
    res.send("deleted successfully")
})

app.listen(3000,()=>{
    console.log("Server started on port 3000")
})