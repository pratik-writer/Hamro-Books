const express=require('express');
const router=express.Router();
const auth=require('../controllers/auth')
const authmiddleware=require('../middlewares/authorization')
const uploadmiddleware=require('../middlewares/multer');
const cloudinary=require('../middlewares/cloudinary')
const bookinfo=require('../controllers/bookinfo')
const buyer_section_order=require('../controllers/buyer_section')
const seller_section_order=require('../controllers/sellers_section');
const { ensureseller } = require('../middlewares/ensureSeller');



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
router.post("/cancel_orders/:order_id",buyer_section_order.cancel_orders);
router.get("/my_orders",buyer_section_order.my_orders);
router.get("/sort_by_category/:category",buyer_section_order.sort_by_category);
router.get("/fetch_for_homepage",buyer_section_order.fetch_books_for_homepage);
router.get("/add_to_cart/:book_id",buyer_section_order.add_to_cart);
router.get("/fetch_cart",buyer_section_order.fetch_cart);
router.get("/sort_by_category/:category",buyer_section_order.sort_by_category);
router.get("/sort_by_price",buyer_section_order.sort_by_price);




router.get("/pending_orders",ensureseller,seller_section_order.see_pending_orders);
router.post("/update_bookinfo/:book_id",ensureseller,uploadmiddleware.single('image'),seller_section_order.update_book_info);
router.post("/checkout_orders/:order_id",ensureseller,seller_section_order.checkout_orders);
router.post("/delete_book/:book_id",ensureseller,seller_section_order.delete_book);



module.exports=router;