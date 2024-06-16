const express=require('express');
const app=express();





app.get('/',(req,res)=>{
res.send("Project is on");
})


app.listen(3000,()=>{
    console.log("Server is running");
})