const pool=require('../connection');
const cloudinary=require('../middlewares/cloudinary')





const view_books=async (req,res)=>{
    console.log("last function");
    
    try{
        const user_id=req.user_id;
        console.log(user_id);

        const view_books_query=`Select * from books where listed_by=$1`;
        const view_book_values=await pool.query(view_books_query,[user_id]);

        res.render('sellerr/seller_homepage',{books:view_book_values.rows});

    }
    catch(error)
    {
        console.log(error);
    }
}


const see_pending_orders=async (req,res)=>{
    

    try{
        const seller_id=req.user_id;
    const pending_orders_select_query=`
    SELECT 
      orders.*,books.*,users.*
    FROM 
      orders
    JOIN 
      books ON orders.book_id = books.book_id
    JOIN 
      users ON orders.buyer_id = users.user_id
    WHERE 
      books.listed_by = $1 and delivery_status='On Progress'
  `;
    const pending_orders_list=await pool.query(pending_orders_select_query,[seller_id]);
    //console.log(pending_orders_list.rows);

    res.render('sellerr/view_orders',{orders:pending_orders_list.rows});

    }
    catch(error)
    {
        console.log(error);
    }
}




const update_book_info=async (req,res)=>{

   try{
              
    const {book_id}=req.params;
    console.log(book_id);


    const {title,isbn,edition=null,current_condition,description,price,availiable_quantity,category}=req.body;
    console.log(title);
    const filepath=req.file.path;
    const image_url=await cloudinary.upload_file(filepath);

    const {author_name,publisher_name}=req.body;


    
    const author_idd=await pool.query(`Select author_id from books where book_id=$1`,[book_id]);
    const author_id=author_idd.rows;
    const update_author_info=`Update authors set author_name=$1 where author_id=$2`;
    const author_rows=await pool.query(update_author_info,[author_name,author_id.author_id]);
    

    const publisher_idd=await pool.query(`Select author_id from books where book_id=$1`,[book_id]);
    const publisher_id=publisher_idd.rows;
    const update_publisher_info=`Update publishers set publisher_name=$1 where publisher_id=$2`;
    const publisher_rows=await pool.query(update_publisher_info,[publisher_name,publisher_id.publisher_id]);



    const update_book_info_query=`Update books set title=$1,isbn_number=$2,edition=$3,current_condition=$4,
    description=$5,price=$6,availiable_quantity=$7,category=$8,image_url=$9 where book_id=$10 returning *`;

    const update_book_info_values=[title,isbn,edition,current_condition,description,price,availiable_quantity
        ,category,image_url.secure_url,book_id];
            
        console.log(update_book_info_values);

    const final_insert=await pool.query(update_book_info_query,update_book_info_values);
    console.log(final_insert.rows);


    res.status(201).json({message:"The update was successful"});

   }
   catch(error)
   {
    console.log(error);

   }



}


const cancel_orders=async (req,res)=>
{
    try{

        const {order_id}=req.params;

        const cancel_orders_query=`Update orders set delivery_status=$1 where order_id=$2`;
        await pool.query(cancel_orders_query,['Cancelled',order_id]);

        res.redirect('/pending_orders');

    }
    catch(error)
    {
       console.log(error);
    }
}
const checkout_orders=async (req,res)=>{

    try{
        const {order_id}=req.params



    const delivery_status_update_query=`Update orders set delivery_status=$1 where order_id=$2`;
    const delivery_status_update_value='Shipped';
    
    await pool.query(delivery_status_update_query,[delivery_status_update_value,order_id]);

    const book_id_query=`select book_id from orders where order_id=$1`;
    const book_idd=await pool.query(book_id_query,[order_id]);
    const book_id=book_idd.rows[0].book_id;
    const update_availiable_quantity_query=`Update books set availiable_quantity=availiable_quantity-1 where book_id=$1`;
    await pool.query(update_availiable_quantity_query,[book_id]);

    res.redirect('/pending_orders');
    }

    catch(error)
    {
        console.log(error);
    }


}



const delete_book=async (req,res)=>{


   try{
    const {book_id}=req.params

   const delete_book_query=`Delete from books where book_id=$1`;

   await pool.query(delete_book_query,[book_id]);

   res.status(201).json({message:"The required book has been deleted"});

   }
   catch(error)
   {
    console.log(error);
   }


}

module.exports={see_pending_orders,update_book_info,checkout_orders,delete_book,view_books,cancel_orders};