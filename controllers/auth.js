const User = require('../models/user');

register = async (req, res) => {

    //  console.log('Register =>', req.body);

    const {name, email, password, repeatPassword,  selectedQuestion, secretAnswer} = req.body;

    console.log(secretAnswer, selectedQuestion, email, name, password, repeatPassword);

    if(!name) return res.status(400).json({ message: 'Name is required' });
    if (!email) return res
    .status(400)
    .json({ message: 'Email is required' });
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

    res.status(200).json({ message: 'Registration successful' });

}

module.exports = {
    register
}