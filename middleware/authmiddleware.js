const jwt=require("jsonwebtoken");

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
                next();
            }
        })

    }
    else{
        res.render('login',{
            message:"Please login",
        })
    }
}
module.exports={requireAuth};