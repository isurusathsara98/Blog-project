const mysql = require("mysql");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const db= mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '17/Eng/099',
    database:'blog'
})

exports.register = (req, res)=>{
    console.log(req.body);
    const { fname, mname, lname, email, password, passwordconfirm, mobile } = req.body;

    db.query('SELECT email FROM user WHERE email=?',[email],async (error,results)=>{
        if(error){
            console.log(error);
        }
        if(results>0){
            return res.render('register',{
                message:"That email already exists",
            })
        }
        else if(password !== passwordconfirm){
            return res.render('register',{
                message:"passwords doesn't match",
            })
        }

       let hashedPassword = await bcrypt.hash(password, 8);
       console.log(hashedPassword);
    });

}