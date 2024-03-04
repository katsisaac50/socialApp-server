const  {expressjwt}  = require('express-jwt');
const Post = require("../models/post")
const User = require("../models/user")

const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

const canEditDeletePost = async(req, res, next) =>{
    try {
        const post = await Post.findById(req.params._id)
        const userIdString = post.user.toString();
      
        if(req.auth.id !== userIdString){
            return res.status(400).send("Unauthorized");
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const isAdmin = async (req, res, next) => {
    try {
        console.log("user keyadmin=>",req)
        const user = await User.findById(req.auth.id);
        
        if (user.role !== "Admin") {
            return res.status(403).send("Unauthorized");
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    requireSignin,
    canEditDeletePost,
    isAdmin
}
