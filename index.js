const express=require('express');
const app=express();
const dust=require('dustjs-express');
const path=require('path');
const userroutes=require('./router/routes');
const bodyParser=require('body-parser');
require('dotenv').config();
const cookieParser=require('cookie-parser');
//const router=express.Router();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('dust', dust.engine(useHelpers=true));
app.set('view engine', 'dust');
app.set('views', path.join(__dirname,'/views'));


//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());




app.use('/',userroutes);


app.listen(3000,()=>{
    console.log("Server is running");
});