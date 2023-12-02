const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

register = async (req, res) => {

    //  console.log('Register =>', req.body);

    const {name, email, password, repeatPassword,  selectedQuestion, secretAnswer} = req.body;

    // console.log(secretAnswer, selectedQuestion, email, name, password, repeatPassword);

    // validations
    if(!name) return res.status(400).json({ message: 'Name is required' });
    if (!email) return res
    .status(400)
    .json({ message: 'Email is required' });
    if (!selectedQuestion) return res
    .status(400)
    .json({ message: 'Question is required' });
    if (!secretAnswer) return res
    .status(400)
    .json({ message: 'Secret is required' });
    if (!password || password.length < 6) return res
    .status(400)
    .json({ message: 'Password is required and should be min 6 characters long' });
    if (password !== repeatPassword) return res
    .status(400)
    .json({ message: 'Passwords do not match' });
    if (!secretAnswer) return res
    .status(400)
    .json({ message: 'Secret is required' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res
    .status(400)
    .json({ message: 'User already exists' });

    // hash password
    const hashedPassword = await hashPassword(password);

    // create new user
    const user = await new User({
        name,
        email,
        selectedQuestion,
        secretAnswer,
        password: hashedPassword
    }).save();

    try {
        await user.save();
        console.log("register success =>", user);
        return res.status(200).json(
            { 
            success: true, 
            message: 'Registration successful' 
            });
    } catch (error) {
        console.log("register failed =>", error);
        return res.status(400).json(
            { 
            message: 'Registration failed' 
            });
    }

}

const login = async (req, res) => {

    try {

       const { email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res
   .status(400)
   .json({ message: 'User does not exist' });

    // check if password is correct
    const isPasswordCorrect = await comparePassword(password, existingUser.password);
    if (!isPasswordCorrect) return res
    .status(400)
    .json({ message: 'Invalid credentials' });

    // generate token
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // save user token
    existingUser.token = token;
    
    // await existingUser.save();

    // return user
    existingUser.password = undefined;
    existingUser.secretAnswer = undefined;

    return res.status(200).json({
        existingUser,
        token
        }) 
    } catch (error) {

        console.log("login failed =>", error);

        return res.status(400).json(
            { 
            message: 'Login failed' 
            });
    }

    
};

const currentUser = async (req, res) => {
    console.log("current user =>", req.auth);

    try {

        const user = await User.findOne({ email: req.auth.email }).select('-password -secretAnswer');

        return res.status(200).json({
            success : true
            })


    } catch (error) {

        console.log("current user failed =>", error);
        return res.status(400).json(
            { 
            message: 'Current user failed' 
            });
    }
};

const forgotPassword = async (req, res) => {

    console.log("forgot password =>", req.body);
}



module.exports = {
    register,
    login,
    currentUser
}