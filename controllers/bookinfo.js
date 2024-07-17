const pool=require('../connection');
const cloudinary=require('../middlewares/cloudinary');
const multer=require('multer');
const path=require('path');




const add_book_page=(req,res)=>{
    res.render('sellerr/add_book');
};


const bookdetails_upload=async (req,res)=>
    {
     
    try{
        const filepath=req.file.path;
    const image_url=await cloudinary.upload_file(filepath);
    console.log(image_url.secure_url);
            
        




    const {title,isbn,edition=null,current_condition,description,price,availiable_quantity,category}=req.body;
     
    console.log(title,isbn,edition,current_condition,description,price,availiable_quantity,category);

    const author_name=req.body.author_name;
    const insert_author_query=`Insert into authors(author_name) values($1)`;
    const insert_author_value=[author_name];
    const author_id_query=`Select author_id from authors where author_name=$1`;

    const publisher_name=req.body.publisher_name;
    const publisher_id_query=`Select publisher_id from publishers where publisher_name=$1`;
   const  insert_publisher_query=`Insert into publishers(publisher_name) values($1)`;
    const insert_publisher_value=[publisher_name];


    //Have to make changes here as cookie.user_id gives currently logged in user id
    const listed_by_user_id=req.user_id;
    //console.log(listed_by_user_id);
    //const listed_by_user_id=1;
   // const listed_by_query=`Select user_id from users where user_id=$1`;

    await pool.query(insert_author_query,insert_author_value);
    await pool.query(insert_publisher_query,insert_publisher_value);

    const author_inf=await pool.query(author_id_query,insert_author_value);
    const publisher_inf=await pool.query(publisher_id_query,insert_publisher_value);
    const author_id=author_inf.rows[0].author_id;
    const publisher_id=publisher_inf.rows[0].publisher_id;
   
    //const listed_by=await pool.query(listed_by_query,listed_by_id); 
    //The method to execute listed_by id in book has to be resolved further and 
    //the listed_by_query code line is written above
    


    const wholeinfo_query=`Insert into books(title,isbn_number,edition,current_condition,
    description,price,listed_by,author_id,
    publisher_id,availiable_quantity,image_url,category) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;
    const wholeinfo_value=[title,isbn,edition,current_condition,description,price,listed_by_user_id,author_id,publisher_id,availiable_quantity,image_url.secure_url,category];


    await pool.query(wholeinfo_query,wholeinfo_value);
    console.log("Second last line");

    res.redirect('/add_a_book');
    // res.status(201).json({message:"Books updated successfully"});

    }

    catch(error)
    {
        console.error('Error uploading book details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }



    


};


module.exports={bookdetails_upload,add_book_page};
