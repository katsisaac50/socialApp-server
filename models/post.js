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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

postSchema.index({
    'user.name': 'text', // Assuming 'name' is the field in the 'user' subdocument
    'user.username': 'text', // Assuming 'username' is a field in the 'user' subdocument
    // Add other fields related to username or additional fields you want to search
});

module.exports = mongoose.model('Post', postSchema);