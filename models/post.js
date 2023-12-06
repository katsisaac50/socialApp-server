const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        url: String,
        public_id: String
    },
    likes: {
        type: Number,
        default: 0,
        ref: 'User'
    },
    comments: [{
        text: String,
        created : {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
},{timestamps: true});

module.exports = mongoose.model('Post', postSchema);