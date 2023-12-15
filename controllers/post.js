const Post = require('../models/post');
const User = require('../models/user');

const postLikes = async(req, res) => {

    try {
        const post = await Post.findById(req.params.id);
    } catch (error) {
        
    }
}

const userPost = async(req, res) => {
   console.log(req) 
   try {

    const post = await Post.findById(req.params.id);

    return res.status(200).json({
        post,
    })
    
   } catch (error) {
    console.log(error);
   }
};

const postByUser = async(req, res) => {
    

    try {

        // const posts = await Post.find({ user: req.auth.id }).populate('user','name _id image').sort('-createdAt').limit(10);
        const posts = await Post.find().populate('user','name _id image').sort('-createdAt').limit(10);
        console.log(posts)
        return res.status(200).json({

            success: true,
            posts
        })
        
    } catch (error) {
        
    }
}

module.exports = {
    postByUser,
    postLikes,
    userPost
}