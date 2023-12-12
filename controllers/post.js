const Post = require('../models/post');
const User = require('../models/user');

const postLikes = async(req, res) => {

    try {
        const post = await Post.findById(req.params.id);
    } catch (error) {
        
    }
}
const postByUser = async(req, res) => {
    console.log(req)

    try {

        const posts = await Post.find({ user: req.auth.id }).populate('user','name _id image').sort('-createdAt').limit(10);
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
    postLikes
}