const jwt=require("jsonwebtoken");
const mysql = require("mysql");
const db= mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user: 'sql12382814',
    password: 'Sa17rqBTlH',
    database:'sql12382814'
})
const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('login',{
                    message: 'Please login',
                })
            }else{
                console.log(decodedToken);
                /**********/
                try{
                    db.query('SELECT * FROM user WHERE id = ?',[decodedToken.id], async (error, results)=>{
                        if(!results){
                            res.status(401).render('login',{
                                message: 'User not found',
                            })
                        }
                        else{                         
                           res.locals.user =results[0];
                           db.query('SELECT * FROM post WHERE userID = ?',[decodedToken.id], async (error, results1)=>{
                            if(!results1){
                                   console.log(error);
                            }else{
                                res.locals.posts=results1;
                                
                                next();
                            }
                        })
                          
                        }
                    });
                }catch(error){
                    console.log(error);
                }
              
            }
        })

    }
    else{
        res.render('login',{
            message:"Please login",
        })
    }
}
const requireAuth1 = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('login',{
                    message: 'Please login',
                })
            }else{
                console.log(decodedToken);
                /**********/
                try{
                    db.query('SELECT * FROM user WHERE id= ?',[decodedToken.id], async (error, results)=>{
                        if(!results){
                            res.status(401).render('login',{
                                message: 'User not found',
                            })
                        }
                        else{                         
                           res.locals.user =results[0];
                           db.query('SELECT * FROM post WHERE userID != ?',[decodedToken.id], async (error, results1)=>{
                            if(!results1){
                                   console.log(error);
                            }else{
                                res.locals.posts=results1;
                                next();
                            }
                        })
                          
                        }
                    });
                }catch(error){
                    console.log(error);
                }
              
            }
        })

    }
    else{
        res.render('login',{
            message:"Please login",
        })
    }
}
module.exports={requireAuth , requireAuth1};