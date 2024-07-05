const multer=require('multer');
const path=require('path')




const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,`${__dirname}/../uploads`)
    },
    filename:function(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`)
    }
});

const uploads=multer({storage:storage})


module.exports=uploads;


