const User = require("../models/user");
const Post = require("../models/post");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const { nanoid } = require("nanoid");

const modelId = nanoid(6);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

register = async (req, res) => {
  const {
    name,
    email,
    password,
    repeatPassword,
    selectedQuestion,
    secretAnswer,
  } = req.body;

  // validations
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!selectedQuestion)
    return res.status(400).json({ message: "Question is required" });
  if (!secretAnswer)
    return res.status(400).json({ message: "Secret is required" });
  if (!password || password.length < 6)
    return res
      .status(400)
      .json({
        message: "Password is required and should be min 6 characters long",
      });
  if (password !== repeatPassword)
    return res.status(400).json({ message: "Passwords do not match" });
  if (!secretAnswer)
    return res.status(400).json({ message: "Secret is required" });
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // hash password
  const hashedPassword = await hashPassword(password);

  // create new user
  const user = await new User({
    name,
    email,
    selectedQuestion,
    secretAnswer,
    password: hashedPassword,
    userName: modelId,
  }).save();

  try {
    await user.save();
    // console.log("register success =>", user);
    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log("register failed =>", error);
    return res.status(400).json({
      message: "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ message: "User does not exist" });

    // check if password is correct
    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // save user token
    existingUser.token = token;

    // await existingUser.save();

    // return user
    existingUser.password = undefined;
    existingUser.secretAnswer = undefined;

    return res.status(200).json({
      existingUser,
      token,
    });
  } catch (error) {
    console.log("login failed =>", error);

    return res.status(400).json({
      message: "Login failed",
    });
  }
};

const currentUser = async (req, res) => {
  console.log("current user =>", req.auth);

  try {
    const user = await User.findOne({ email: req.auth.email }).select(
      "-password -secretAnswer"
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("current user failed =>", error);
    return res.status(400).json({
      message: "Current user failed",
    });
  }
};

const createPost = async (req, res) => {
  const { content, image } = req.body;
  console.log("create post =>", content);

  try {
    const user = await User.findOne({ email: req.auth.email }).select(
      "-password -secretAnswer"
    );

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const newPost = new Post({
      content,
      image,
      user: user._id,
    });

    await newPost.save();

    return res.status(200).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    console.log("create post failed =>", error);

    return res.status(400).json({
      message: "Create post failed",
    });
  }
};

const imageUpload = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.auth.email }).select(
      "-password -secretAnswer"
    );

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const result = await cloudinary.uploader.upload(req.files.image.path, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });

    // // Create a new Post document
    // const newPost = new Post({
    //   content: 'Image post content', // Provide a default content or adjust as needed
    //   user: user._id,
    //   image: {
    //     url: result.secure_url,
    //     public_id: result.public_id,
    //   },
    // });

    // // Save the new post to the database
    // const savedPost = await newPost.save();

    console.log("result =>", result);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result,
    });
  } catch (error) {
    console.log("image upload failed =>", error);

    return res.status(400).json({
      message: "Image upload failed",
    });
  }
};

const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth.id);
    console.log("user =>", user);

    let following = user.following;
    following.push(req.auth.id);

    const people = await User.find({ _id: { $nin: following } }).select("-password -secretAnswer").limit(10);
    console.log("people =>", people);

    res.status(200).json({ people });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const forgotPassword = async (req, res) => {
  const { email, newPassword, repeatPassword, selectedQuestion, secretAnswer } =
    req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (existingUser.selectedQuestion !== selectedQuestion) {
    return res
      .status(400)
      .json({ message: "Selected Question does not match" });
  }

  if (existingUser.secretAnswer !== secretAnswer) {
    return res.status(400).json({ message: "Secret Answer does not match" });
  }

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({
        message: "Password is required and should be min 6 characters long",
      });
  }

  if (newPassword !== repeatPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await hashPassword(newPassword);

    existingUser.password = hashedPassword;

    await existingUser.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("forgot password failed =>", error);

    return res.status(400).json({
      message: "Forgot password failed",
    });
  }
};

const profileUpdate = async (req, res) => {
  console.log(req.params);

  try {
    const userId = req.auth.id;

    const {
      name,
      email,
      selectedQuestion,
      secretAnswer,
      password,
      repeatPassword,
      about,
      username,
      image,
    } = req.body;

    // Retrieve the user from the database
    const user = await User.findById(userId);
    console.log("user =>", image);

    // Update user properties
    user.name = name;
    user.email = email;
    user.selectedQuestion = selectedQuestion;
    user.secretAnswer = secretAnswer;
    user.about = about;
    user.userName = username;
    user.photo = {
      data: image.url,
      contentType: image.public_id,
    };

    // Manual validations
    const errors = [];

    if (!name) {
      errors.push({ field: "name", message: "Name is required" });
    }

    if (!email || !email.includes("@")) {
      errors.push({ field: "email", message: "Invalid email format" });
    }

    if (password && (password.length < 6 || password !== repeatPassword)) {
      errors.push({
        field: "password",
        message: "Invalid password or passwords do not match",
      });
    }

    if (!username) {
      errors.push({ field: "username", message: "Username is required" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Check if password and repeatPassword are provided and match

    if (password && repeatPassword && password === repeatPassword) {
      user.password = password;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const followUser = async (req, res) => {

  console.log(req);
  try {
    const user = await User.findById(req.auth.id);
    // console.log("user =>", user);
    const following = user.following;
    following.push(req.body._id);
    user.following = following;

    // find the user to follow
    const followedUser = await User.findById(req.body._id);

    await user.save();
    res.status(200).json({
      message: `following ${followedUser.name} successfully`,
      user,
      success: true,
    });
  }catch (error){
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
}
} ;

module.exports = {
  register,
  login,
  currentUser,
  forgotPassword,
  createPost,
  imageUpload,
  profileUpdate,
  findPeople,
  followUser
};
