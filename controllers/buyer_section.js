const pool=require('../connection');


const place_orders=async (req,res)=>{
    console.log("The beginning");


try{
    const {book_id}=req.params;
    const {quantity}=req.body;

    console.log(book_id);
    console.log(quantity);

const buyer_id=req.user_id;
console.log(buyer_id);

const is_availiable_query=`select availiable_quantity from books where book_id=$1`;
const is_availiablee=await pool.query(is_availiable_query,[book_id])
const is_availiable=is_availiablee.rows;

console.log(is_availiable[0].availiable_quantity);

if(quantity>is_availiable[0].availiable_quantity)
{
    throw new Error("Out of Stock");
}

const seller_idd=await pool.query(`Select listed_by from books where book_id=$1`,[book_id]);
const seller_id=seller_idd.rows[0];
console.log(seller_id.listed_by);

const delivery_locationn=await pool.query(`Select address from users where user_id=$1`,[buyer_id]);
const delivery_location=delivery_locationn.rows[0];
console.log(delivery_location.address);


const receiver_contactt=await pool.query(`Select phone_number from users where user_id=$1`,[buyer_id]);
const receiver_contact=receiver_contactt.rows[0];
console.log(receiver_contact.phone_number);

const book_pricee=await pool.query(`Select price from books where book_id=$1`,[book_id]);
const book_price=book_pricee.rows[0];
console.log(book_price);

const book_namee=await pool.query(`Select title from books where book_id=$1`,[book_id]);
    const book_name=book_namee.rows[0];
    console.log(book_name);

const delivery_status='On Progress';//Might have to change the type as it can be changed tto shipped

const total_price=quantity*book_price.price;

const place_order_query=`Insert into orders(seller_id,buyer_id,book_id,book_name,delivery_location,
receiver_contact,delivery_status,quantity,price)
values($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

const place_order_values=[seller_id.listed_by,buyer_id,book_id,book_name.title,
    delivery_location.address,receiver_contact.phone_number,delivery_status,quantity,total_price];


 await pool.query(place_order_query,place_order_values);
// res.status(201).json({message:"Orders received successfully"});
res.redirect(`/remove_from_cart/${book_id}`);
}

catch(error)
{
    console.log(error);
    //console.error(error.message);
    res.status(500).json({error:"Values couldnot be inserted into orders"})
}


}



const book_description=async (req,res)=>{
 try{
    const {book_id}=req.params;
    console.log(book_id);

    const description_query=`Select * from books where book_id=$1`;
    const book_values=await pool.query(description_query,[book_id]);

    console.log(book_values.rows);

    res.render('buyerr/product_descript',{books:book_values.rows});
 }
 catch(error)
 {
    console.log(error);
 }
}


const fetch_books_for_homepage=async (req,res)=>{

try{
    console.log("Beginning");
    const book_fetch_query=`Select * from books`;
    const book_fetch_values=await pool.query(book_fetch_query);
    console.log(book_fetch_values.rows);

    res.render('homepage',{books:book_fetch_values.rows});

    // res.status(201).json({message:"Books have been fetched successfully"});
}
catch(error)
{
    console.log(error);
}

    
}


const my_orders=async (req,res)=>{


    try{
        const my_id=req.user_id;

    const my_orders_select_query=`Select * from orders where buyer_id=$1`;
    const my_orders_list=await pool.query(my_orders_select_query,[my_id]);

    console.log(my_orders_list.rows);
    res.status(201).json({message:"My Orders fetched successfully"});

    }
    catch(error)
    {
        console.log(error);
    }


}


const cancel_orders=async (req,res)=>{

    try{
        
        const user_id=req.user_id;
        const {order_id}=req.params;
        const delivery_status="Cancelled";

    const cancel_order_query=`Update  orders set delivery_status=$1 where order_id=$2`;
    await pool.query(cancel_order_query,[delivery_status,order_id]);

    res.status(201).json({message:"Order cancelled successfully"});

    }
    catch(error)
    {
       console.log(error);
    }

}




const remove_from_cart=async (req,res)=>{

   try{
    const {book_id}=req.params;
    console.log(book_id);
   const user_id=req.user_id;
   console.log(user_id);

   const remove_query=`Delete from cart where book_id=$1 and user_id=$2`;
   await pool.query(remove_query,[book_id,user_id]);

   res.redirect('/fetch_cart');
   }
   catch(error)
   {
    console.log(error);
   }

}
const add_to_cart=async (req,res)=>{
    

    try{
         
        const {book_id}=req.params;
    const user_id=req.user_id;
    console.log(user_id);

    const insert_into_cart_query=`Insert into cart(user_id,book_id) values($1,$2)`;
    const cart_values=await pool.query(insert_into_cart_query,[user_id,book_id]);
    

    res.redirect(`/product_description/${book_id}`);
    


    
    }

    catch(error)
    {
        console.log(error);
    }
    



}


const fetch_cart=async (req,res)=>{

    try{
        
        console.log(req.cookies);
        const user_id=req.user_id;
        console.log(user_id);


    const fetch_cart_query=`SELECT books.*
      FROM cart
      JOIN books ON cart.book_id = books.book_id
      WHERE cart.user_id = $1`;
    const cart_values=await pool.query(fetch_cart_query,[user_id]);

    console.log(cart_values.rows);

    res.render('buyerr/cartt',{cart:cart_values.rows})
 

     //Consider commented values below later

    // const book_data_query=`Select * from books where book_id=$1`;
    // const book_dataa=await pool.query(book_data_query,[book_id]).rows;
    // const book_name=book_dataa.title;
    // const book_image=book_dataa.image_url;
    // const book_price=book_dataa.price;


    // res.status(201.).json({message:"Cart fetch Successful"});
    }
    catch(error)
    {
        console.log(error);
    }

}





const sort_by_category=async (req,res)=>{

try{
    const {category}=req.params;
    console.log(category);


    const sort_by_category_query=`Select * from books  where category=$1`;
    const sort_by_category_values=await pool.query(sort_by_category_query,[category]);
    console.log(sort_by_category_values.rows);

    res.render('category_page',{books:sort_by_category_values.rows});
}
catch(error)
{
    console.log(error);
}
   
}


const sort_by_price=async (req,res)=>{

    try{
        
    
    
        const sort_by_price_query=`Select * from books order by price asc`;
        const sort_by_price_values=await pool.query(sort_by_price_query);
        console.log(sort_by_price_values.rows);
    
        res.status(201).json({message:"The sorted items by price have been received sucessfully"});
    }
    catch(error)
    {
        console.log(error);
    }
       
}


const search=async (req,res)=>{

try{
    const search_keyword=req.query.search_keyword;

console.log(search_keyword);

const search_query=`Select books.*,authors.author_name as author_name,publishers.publisher_name 
 From books left join authors on books.author_id=authors.author_id
 Left join publishers on books.publisher_id=publishers.publisher_id 
 where books.title ilike $1
 or authors.author_name ilike $1
 or publishers.publisher_name ilike $1`;



const searchresults=await pool.query(search_query, [`%${search_keyword}%`]);

console.log(searchresults.rows);


res.status(202).json({message:"Search results fetched successfully"});
}
catch(error)
{
    console.log(error);
}


}

// const review_handling=(req,res)=>{

//     const {rating}=req.body;
//     const book_id=req.params
//     const insert_rating_query=`Insert into reviews(ratings) values($1)`;
//     const insert_rating_value=[rating];
// }





module.exports={place_orders,my_orders,cancel_orders,sort_by_category,sort_by_price,
    fetch_cart,fetch_books_for_homepage,add_to_cart,search,book_description,remove_from_cart};