const express=require('express');
const router=express.Router();
const auth=require('../controllers/auth')
const authmiddleware=require('../middlewares/authorization')
const uploadmiddleware=require('../middlewares/multer');
const cloudinary=require('../middlewares/cloudinary')
const bookinfo=require('../controllers/bookinfo')
const buyer_section_order=require('../controllers/buyer_section')



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


router.post('/upload-bookinfo',uploadmiddleware.single('image'),bookinfo.bookdetails_upload);

router.post("/buy_book/:book_id",buyer_section_order.place_orders);

router.get("/my_orders",buyer_section_order.my_orders);



module.exports=router;