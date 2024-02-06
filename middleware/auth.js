const jwt = require("jsonwebtoken");
const customer=require("../middleware/auth.controll")

const auth = async(req,res,next)=>{
try{
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
    console.log(verifyUser);
    const user = await customer.findOne({_id:verifyUser._id});
    console.log(user);

    req.token=token;
    req.user=user;
    next();
}
catch(error){
    res.status(401).send(error);

}
}
module.exports=auth;