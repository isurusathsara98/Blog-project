const mysql = require("mysql");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const db= mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '17/Eng/099',
    database:'blog'
})

exports.login= async (req, res)=>{
    try{
        const {email, password} = req.body;
        db.query('SELECT * FROM user WHERE email = ?',[email], async (error, results)=>{
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{
                    message: 'Email or password is incorrect',
                })
            }
            else{
                const id =results[0].id;
                const token = jwt.sign({id: id}, process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                });
                console.log("token:"+token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 
                    ),
                    httpOnly: true
                }
                res.cookie('jwt',token, cookieOptions);
                res.status(200).redirect("/");
            }
        })
    }catch(error){
        console.log(error);
    }
}

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

       db.query('INSERT INTO user SET ?',{firstname: fname, middlename:mname, lastname: lname, email:email, mobile:mobile, password:hashedPassword},(error,results)=>{
           if(error){
               console.log(error);
           }
           else{
            return res.render('register',{
                message:"Registered sucessfully. Please login",
            })
           }
       })
    });

}