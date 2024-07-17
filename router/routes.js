const express=require('express');
const router=express.Router();
const auth=require('../controllers/auth')
const authmiddleware=require('../middlewares/authorization')
const uploadmiddleware=require('../middlewares/multer');
const cloudinary=require('../middlewares/cloudinary')
const bookinfo=require('../controllers/bookinfo')
const buyer_section_order=require('../controllers/buyer_section')
const seller_section_order=require('../controllers/sellers_section');
const { ensureseller,ensurebuyer } = require('../middlewares/ensureSeller');





router.get('/',(req,res)=>{
    res.render("loginpage");

});
router.post('/login',auth.loginuser);

router.get("/register",(req,res)=>{
    res.render('registerpage')
});

router.post('/register',auth.registeruser);

// router.get('/home',authmiddleware,(req,res)=>{
//     res.render('homepage')
// });

router.get('/product_description/:book_id',authmiddleware,ensurebuyer,buyer_section_order.book_description)


router.post("/buy_book/:book_id",authmiddleware,buyer_section_order.place_orders);
router.post("/cancel_orders/:order_id",authmiddleware,buyer_section_order.cancel_orders);
router.get("/my_orders",authmiddleware,buyer_section_order.my_orders);
router.get("/sort_by_category/:category",authmiddleware,buyer_section_order.sort_by_category);
router.get("/buyer_homepage",authmiddleware,buyer_section_order.fetch_books_for_homepage);
router.get("/add_to_cart/:book_id",authmiddleware,buyer_section_order.add_to_cart);
router.get("/remove_from_cart/:book_id",authmiddleware,buyer_section_order.remove_from_cart);
router.get("/fetch_cart",authmiddleware,authmiddleware,buyer_section_order.fetch_cart);
router.get("/sort_by_category/:category",authmiddleware,buyer_section_order.sort_by_category);
router.get("/sort_by_price",authmiddleware,buyer_section_order.sort_by_price);
router.get("/search",authmiddleware,buyer_section_order.search);




router.get("/seller_home_page",authmiddleware,ensureseller,seller_section_order.view_books);
router.get("/pending_orders",authmiddleware,ensureseller,seller_section_order.see_pending_orders);
router.get('/add_a_book',authmiddleware,ensureseller,bookinfo.add_book_page);
router.post('/add_a_book',authmiddleware,ensureseller,uploadmiddleware.single('image'),bookinfo.bookdetails_upload);
router.post("/update_bookinfo/:book_id",authmiddleware,ensureseller,uploadmiddleware.single('image'),seller_section_order.update_book_info);
router.post("/checkout_orders/:order_id",authmiddleware,ensureseller,seller_section_order.checkout_orders);
router.post("/delete_book/:book_id",authmiddleware,ensureseller,seller_section_order.delete_book);
router.post("/cancel_order/:order_id",authmiddleware,ensureseller,seller_section_order.cancel_orders);
//router.post("/view_books",authmiddleware,ensureseller,seller_section_order.view_books);



module.exports=router;