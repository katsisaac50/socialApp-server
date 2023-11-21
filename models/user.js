const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Use minlength instead of min
    maxlength: 64, // Use maxlength instead of max
  },
  secret: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    trim: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resetPasswordLink: {
    data: String,
    default: String,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
