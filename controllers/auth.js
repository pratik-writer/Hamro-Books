const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const pool=require('../connection');





const sendResponse = (status, message, data) => {
    return ({ status, message, data })
}



///login

const loginuser=async (req,res)=>{

const {username,password}=req.body


const fetchquery='SELECT * from users where username=$1';
const checkvalues=[username];


try{
    const isexists=await pool.query(fetchquery,checkvalues);
    //console.log(isexists.user_id);

    if(isexists.rows.length>0)
        {
            const user=isexists.rows[0];
            
             
            const ispasswordmatch= await bcrypt.compare(password,user.password);

            if(!ispasswordmatch)
                {
                    return (res.status(200).json(sendResponse(false, 'Email and password are not matching')));
                }
                else{
                    const authToken=jwt.sign({userid:user.user_id,is_seller:user.is_seller},process.env.JWT_SECRET_KEY,{expiresIn:'200m'})
                    res.cookie('authToken',authToken,{httpOnly: true,sameSite: 'None', secure: true})


                    //res.status(200).json({message:"Login Successful"});

                    if(user.is_seller)
                    {
                        res.redirect('/seller_home_page');
                    }
                    else{
                        res.redirect('/buyer_homepage');
                    }
                }
        }
        else{
            res.status(200).json(sendResponse(false, 'No user found Check your Credential Properly'));
        }
}
catch(error)
{
  console.log(error);
}

};


const registeruser=async(req,res)=>{

    const {username,email,password}=req.body;
    const {firstname,lastname,phonenumber,address,isseller}=req.body;
    console.log(username);
    console.log(email);
    console.log(password);

    const checkquery='Select * from users where username=$1 or email=$2';
    const checkvalues=[username,email];

   try{
          
    const isexists=await pool.query(checkquery,checkvalues);


    if(isexists.rows.length>0){
        return res.status(400).json({error:"Username or password already exists"});
     }

     const hashedpassword=await bcrypt.hash(password,10);


     const insertquery=`Insert into users(username,email,password,first_name,last_name,phone_number,address,is_seller) 
     values($1,$2,$3,$4,$5,$6,$7,$8)`;
     const insertvalues=[username,email,hashedpassword,firstname,lastname,phonenumber,address,isseller];
     await pool.query(insertquery,insertvalues);

     res.status(201).json({message:"User registered successfully"});

   }

   catch(error)
   {
       console.log(error);
   }


};


const logout=(req,res)=>{

    res.clearcookie('authToken');
    res.redirect('/login');



}

module.exports={loginuser,registeruser,logout};