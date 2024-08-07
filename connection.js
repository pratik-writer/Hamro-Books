const {Pool}=require('pg');
require('dotenv').config();



const{DB_USER,DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,pgssl}=process.env;


// const pool=new Pool({
//     user: 'postgres',
//   host: 'localhost',
//   database: 'hamrobooks',
//   password: '1234',
//   port: 5432,
// });

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT, 
  connectionTimeoutMillis: 5000,
   ssl: {
  rejectUnauthorized: true
   },
  
  

});

pool.on('connect',()=>{
  
  console.log("Connected successfully");
});
pool.on("error",(err)=>{
  console.log("Error",err);
})

// const pool=new Pool({
//   user: 'postgres',
// host: 'localhost',
// database: 'hamrobooks',
// password: '1234',
// port: 5432,
// });


module.exports=pool;