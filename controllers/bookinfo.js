const pool=require('../connection');
const cloudinary=require('../middlewares/cloudinary')


const bookdetails_upload=async (req,res)=>
    {

       
        
    try{
        const filepath=req.file.path;
    const image_url=await cloudinary.upload_file(filepath).secure_url;
            
        




    const {title,isbn,edition=null,current_condition,description,price,is_availiable,category}=req.body;
     

    const author_name=req.body.author_name;
    const insert_author_query=`Insert into authors(author_name) values($1)`;
    const insert_author_value=[author_name];
    const author_id_query=`Select author_id from authors where author_name=$1`;

    const publisher_name=req.body.publisher_name;
    const publisher_id_query=`Select publisher_id from publishers where publisher_name=$1`;
   const  insert_publisher_query=`Insert into publishers(publisher_name) values($1)`;
    const insert_publisher_value=[publisher_name];

    const listed_by_id=[1];//[req.cookie.user_id];
    const listed_by_query=`Select username from users where user_id=$1`;

    await pool.query(insert_author_query,insert_author_value);
    await pool.query(insert_publisher_query,insert_publisher_value);

    const author_inf=await pool.query(author_id_query,insert_author_value);
    const publisher_inf=await pool.query(publisher_id_query,insert_publisher_value);
    const author_id=author_inf.rows[0].author_id;
    const publisher_id=publisher_inf.rows[0].publisher_id;
   
    const listed_by=await pool.query(listed_by_query,listed_by_id);
    


    const wholeinfo_query=`Insert into books(title,isbn_number,edition,current_condition,
    description,price,listed_by,author_id,
    publisher_id,is_availiable,image_url,category) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;
    const wholeinfo_value=[title,isbn,edition,current_condition,description,price,listed_by.rows[0].listed_by,author_id,publisher_id,is_availiable,image_url,category];


    await pool.query(wholeinfo_query,wholeinfo_value);
    res.send(201).json({message:"Books updated successfully"});

    }

    catch(error)
    {
        console.error('Error uploading book details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }



    


};


module.exports={bookdetails_upload};