const express=require('express');
const router=express.Router();
const auth=require('../controllers/auth')
const authmiddleware=require('../middlewares/authorization')



router.get('/',(req,res)=>
{
    res.send("Welcome here");
});

router.get('/login',(req,res)=>{
    res.render("loginpage");

});
router.post('/login',auth.loginuser);

router.get("/register",(req,res)=>{
    res.render('registerpage')
});

router.post('/register',auth.registeruser);

router.get('/home',authmiddleware,(req,res)=>{
    res.render('homepage')
});


module.exports=router;