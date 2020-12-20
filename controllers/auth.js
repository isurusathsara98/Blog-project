const mysql = require("mysql");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const fileupload=require("express-fileupload");

const db= mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user: 'sql12382814',
    password: 'Sa17rqBTlH',
    database:'sql12382814'
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
                res.status(200).redirect('../home');
            }
        })
    }catch(error){
        console.log(error);
    }
    
}
exports.edit=async (req, res) =>{
    const { fname, mname, lname, email, mobile, intro , currentpassword} = req.body;
    id=res.locals.user.id;
    db.query('SELECT * FROM user WHERE id = ?',[id], async (error, results)=>{
    if(!(await bcrypt.compare(currentpassword, results[0].password))){
        res.status(401).render('edit',{
            message: 'Current password entered is incorrect',
        })
    }
    else{
    if(fname){
        db.query('UPDATE user SET firstname=? WHERE id=?',[fname, id],async (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
          
            }
        });
    }
    if(lname){
        console.log("req.body");
        db.query('UPDATE user SET lastname=? WHERE id=?',[lname, id],async (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
           
            }
        });
    }
    if(mname){
        console.log("req.body");
        db.query('UPDATE user SET middlename=? WHERE id=?',[mname, id],async (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
            
            }
        });
    }
    if(email || !(email==res.locals.user.email)){
        console.log("req.body");
        db.query('UPDATE user SET email=? WHERE id=?',[email, id],async (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
            }
        });
    }
    if(mobile){
        console.log("req.body");
        db.query('UPDATE user SET mobile=? WHERE id=?',[mobile, id],async (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
           
            }
        });
    }
    if(intro){
        console.log("req.body");
        db.query('UPDATE user SET intro=? WHERE id=?',[intro, id],async (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
           
            }
        });
    }
    return res.render('profile',{
        message:false,
    })
}
    });
}
exports.upload = (req, res) =>{
    
     const { title, content, summary } = req.body;
     if(req.files){
        var file = req.files.uploaded_image;
        var img_name=file.name;
        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
            file.mv('public/images/posts/'+file.name,async function(err){
                if (err)
                console.log(err);
            });
        }
        db.query('INSERT INTO post SET ?',{Title: title,Sumary: summary, content: content, image:img_name, userID: res.locals.user.id},(error,results)=>{
            if(error){
                console.log(error);
            }
            else{
             return res.render('profile',{
                 message:"Post sucessfully added",
             })
            }
        }); 
     }else{
        db.query('INSERT INTO post SET ?',{Title: title,Sumary: summary, content: content, userID: res.locals.user.id},(error,results)=>{
            if(error){
                console.log(error);
            }
            else{
             return res.render('profile',{
                 message:"Post sucessfully added",
             })
            }
        }); 
     }
    

}
exports.register = (req, res)=>{
    const { fname, mname, lname, email, password, passwordconfirm, mobile, image} = req.body;
    db.query('SELECT email FROM user WHERE email=?',[email],async (error,results)=>{
        if(error){
            console.log(error);
        }
        var file = req.files.uploaded_image;
        var img_name=file.name;
        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
            file.mv('public/images/uploaded_images/'+file.name,async function(err) {
                             
                if (err)
                  console.log(err);

                        if(results.length>0){
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
                
                       db.query('INSERT INTO user SET ?',{firstname: fname, middlename:mname, lastname: lname, email:email, mobile:mobile, password:hashedPassword, profileImage:img_name},(error,results)=>{
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
        } else {
         return res.render('register',{
            message : "This format is not allowed , please upload file with '.png','.gif','.jpg'",
        })
        }
        
    });

}

exports.editpost=(req,res)=>{
  id=req.query.post;
  

  const { title, summary, content} = req.body;
  console.log(req.body);
  if(title){
    db.query('UPDATE post SET Title=? WHERE id=?',[title, id],async (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            
      
        }
    });
  }
  if(content && content!=" "){
    db.query('UPDATE post SET content=? WHERE id=?',[content, id],async (error,results)=>{
        if(error){
            console.log(error);
        }
    });
  }
  if(summary && summary!=" "){
    db.query('UPDATE post SET Sumary=? WHERE id=?',[summary, id],async (error,results)=>{
        if(error){
            console.log(error);
        }
    });
  }
  if(req.files){
    var file = req.files.uploaded_image;
    var img_name=file.name;
    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
        file.mv('public/images/posts/'+file.name,async function(err){
            if (err)
            console.log(err);
        });
    }
    db.query('UPDATE post SET image=? WHERE id=?',[img_name, id],async (error,results)=>{
        if(error){
            console.log(error);
        }
    });
}
let date_ob = new Date();
db.query('UPDATE post SET updatedAt=? WHERE id=?',[date_ob, id],async (error,results)=>{
  if(error){
      console.log(error);
  }
});
    return res.render('profile',{
        message:"post edited sucessfully",
    })
  

}
exports.delete = (req,res)=>{
    id = req.query.post;
    db.query('DELETE from post WHERE id=?',[id],async (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            return res.render('profile',{
                message:"post deleted sucessfully",
            })
        }
      });
}
module.exports.logout = (req, res)=>{
    
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');;
}