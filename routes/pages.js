const express=require('express');
const {requireAuth, requireAuth1} = require('../middleware/authmiddleware');
const router=express.Router();

const mysql = require("mysql");

const db= mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user: 'sql12382814',
    password: 'Sa17rqBTlH',
    database:'sql12382814'
})


router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/register',(req,res)=>{
    res.render('register',{message:false});
});

router.get('/login',(req,res)=>{
    res.render('login',{message:false});
});
router.get('/home', requireAuth1, (req,res)=>{
    db.query('SELECT * FROM folowers WHERE UserID=?',[res.locals.user.id],async (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
        res.render('home',{like:results,message:false});
        }
    });
   
});
router.get('/profile', requireAuth, (req,res)=>{
    res.render('profile',{message:false});
});
router.get('/logout', requireAuth ,(req,res)=>{
    res.render('login',{message:false});
});
router.post('/edit', requireAuth ,(req,res)=>{
    res.render('edit',{message:"Leave any detail as it is if changes are not required"});
});
router.post('/edit_post', requireAuth ,(req,res)=>{
    console.log(req.query.post);
    db.query('SELECT * FROM post WHERE id=?',[req.query.post],async (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            
            res.render('post_edit',{qs: results[0]});
        }
    });
  

});
router.post('/postview', requireAuth ,(req,res)=>{
    db.query('SELECT * FROM post WHERE id=?',[req.query.post],async (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
           
            db.query('SELECT * FROM user WHERE id=?',[results[0].userID],async (error,results1)=>{
                if(error){
                    console.log(error);
                }
                else{
                    db.query('SELECT * FROM post_comment WHERE postID=?',[req.query.post],async (error,results2)=>{
                        if(error){
                            console.log(error);
                        }
                        else{
                            
                            res.render('postview',{qs: results[0], author: results1[0],comment:results2, message:false});
                        }
                    });
                }
            });
           
        }
    });
});
module.exports= router;