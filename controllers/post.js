const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary');

const likePost = async(req, res) => {
    
    try {
        const postId = req.params._id;
        const {likes} = await Post.findByIdAndUpdate(postId, { $addToSet: { likes: req.auth.id } }, { new: true });
        console.log(likes)
        return res.status(200).json({
            likes
        })
    } catch (error) {
        
    }
}

const dislikePost = async(req, res) => {
    
    try {
        const postId = req.params._id;
        const {likes} = await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
        console.log(likes)
        return res.status(200).json({
            likes
        })
    } catch (error) {
        console.log(error)
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

    // console.log("hehe", req)

    try {
        const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
            new: true,
        });
        res.status(200).json(
            {
                post,
            }
        )
    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            success: false,
            message: 'Post not found'
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params._id);

        if(post.image && post.image.public_id){
            const image = await cloudinary.uploader.destroy(post.image.public_id);
        }
        return res.status(200).json({
            post,
            message: "post successfully deleted",
            ok: true
        })
    } catch (error) {
        console.log(error)
    }
};

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

const newsFeed = async(req, res) => {
    try {
        const user = await User.findById(req.auth.id);
        const following = user.following;
        following.push(user.id);
        const posts = await Post.find({ user: { $in: following } }).populate('user','name _id image').sort('-createdAt').limit(10);
        return res.status(200).json({
            success: true,
            posts
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: 'Posts not found'
        })
    };
};


module.exports = {
    postByUser,
    likePost,
    userPost,
    userPostUpdate,
    deletePost,
    dislikePost,
    newsFeed
}