const Post = require('../models/post');
const User = require('../models/user');

const postLikes = async(req, res) => {

    try {
        const post = await Post.findById(req.params.id);
    } catch (error) {
        
    }
}

const userPost = async(req, res) => {
   console.log(req.params) 
   try {

    const post = await Post.findById(req.params._id);

    return res.status(200).json({
        post,
    })
    
   } catch (error) {
    console.log(error);
   }
};

const userPostUpdate = async(req, res) => {

    console.log("hehe", req)

    try {
        const post = await Post.findById(req.params._id);
    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            success: false,
            message: 'Post not found'
        })
    }
}

const postByUser = async(req, res) => {
    
    try {

        // const posts = await Post.find({ user: req.auth.id }).populate('user','name _id image').sort('-createdAt').limit(10);
        const posts = await Post.find().populate('user','name _id image').sort('-createdAt').limit(10);
       
        return res.status(200).json({

            success: true,
            posts
        })
        
    } catch (error) {

        return res.status(400).json({
            success: false,
            message: 'Posts not found'
        })
        
    }
}

module.exports = {
    postByUser,
    postLikes,
    userPost,
    userPostUpdate
}