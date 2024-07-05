const cloudinary=require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});




const upload_file=async (filepath)=>{

  
  try{
        
    const result=await cloudinary.uploader.upload(filepath);
    console.log(result);
    return result;
  }
  catch(error)
  {
    console.log(error.message);
  }

}

module.exports={cloudinary,upload_file};