const jwt=require('jsonwebtoken');


const sendResponse=(status,response,data)=>{
    return({status,response,data});
}



const checkAuth=async (req,res,next)=>{

    const authToken=req.cookies.authToken;

    if(!authToken)
        {
            return res.status(401).json(sendResponse(false,'Authentication Failed. Please Login To Continue' ));
        }
    
        try{

            const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            req.user_id = decoded.user_id;
           // res.status(200).json(sendResponse(true, 'Authentication Success'));
            next();

        }
        catch(error)
        {
            console.log(error);
        }

}


module.exports=checkAuth;