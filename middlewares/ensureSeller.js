const pool=require('../connection');



// const fetch_user=async (req,res)=>{
//     const ensure_seller_query=`Select * from users where user_id=$1`;
// const ensure_seller_query_values=req.cookies.user_id;


// const user=await pool.query(ensure_seller_query,[ensure_seller_query_values]);
// console.log(user.rows);

// if(user)
// {
//     return user;
// }
// res.status(501).json({message:"the User data could not be found"});

// }


// const ensureseller=async (req,res,next)=>{
//     try{
//         const ensure_seller_query=`Select * from users where user_id=$1`;
//     const ensure_seller_query_values=req.user_id;
    
    
//     const user=await pool.query(ensure_seller_query,[ensure_seller_query_values]);
//    // const user1=user.rows;
//     //console.log(user1[0].username);
//     //const user1=user.rows;
//     if(user.rows[0].is_seller){
//         return next();
//     }

//     res.status(403).json({message:"Unauthorized User"});

//     }

//     catch(error)
//     {
//         console.log(error);
//     }
// }



// const ensurebuyer=async (req,res,next)=>{
//     try{
//         const ensure_seller_query=`Select * from users where user_id=$1`;
//     const ensure_seller_query_values=req.user_id;
    
    
//     const user=await pool.query(ensure_seller_query,[ensure_seller_query_values]);
//    // const user1=user.rows;
//     //console.log(user1[0].username);
//     //const user1=user.rows;
//     if(!user.rows[0].is_seller){
//         return next();
//     }

//     res.status(403).json({message:"Unauthorized User"});

//     }

//     catch(error)
//     {
//         console.log(error);
//     }
// }



const ensureseller=(req,res,next)=>{

    if(req.is_seller)
    {
        
        next();
    }
    else{
        res.status(403).json({message:"Only sellers allowed"});
    }
}

const ensurebuyer=(req,res,next)=>{
    if(!req.is_seller){
        next();
    }
    else{
        res.status(403).json({message:"Only buyers allowed"});
    }
}

module.exports={ensureseller,ensurebuyer};