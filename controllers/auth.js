const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');

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

    console.log("login =>", req.body);

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

    return res.status(200).json({
        _id: existingUser._id,  })
};



module.exports = {
    register,
    login
}