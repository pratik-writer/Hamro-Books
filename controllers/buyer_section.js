const pool=require('../connection');


const place_orders=async (req,res)=>{
    console.log("The beginning");


try{
    const {book_id}=req.params;

    console.log(book_id);

const buyer_id=req.cookies.user_id;

console.log(buyer_id);

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


const place_order_query=`Insert into orders(seller_id,buyer_id,book_id,book_name,delivery_location,
receiver_contact,delivery_status,price)
values($1,$2,$3,$4,$5,$6,$7,$8)`;

const place_order_values=[seller_id.listed_by,buyer_id,book_id,book_name.title,
    delivery_location.address,receiver_contact.phone_number,delivery_status,book_price.price];


 await pool.query(place_order_query,place_order_values);
res.status(201).json({message:"Orders received successfully"});
}

catch(error)
{
    console.log(error);
    res.status(500).json({error:"Values couldnot be inserted into orders"})
}


}


const my_orders=async (req,res)=>{


    try{
        const my_id=req.cookies.user_id;

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

module.exports={place_orders,my_orders};