const Post = require('../models/post');
const User = require('../models/user');
const postByUser = async(req, res) => {
    console.log(req)

    try {

        const posts = await Post.find({ user: req.params.userId }).populate('user','name _id image').sort('-createdAt').limit(10);

        return res.status(200).json({

            success: true,
            posts
        })
        
    } catch (error) {
        
    }
}

module.exports = {
    postByUser
}