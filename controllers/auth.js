register = async (req, res) => {

    console.log('Register =>', req.body);
    res.status(200).json({ message: 'Registration successful' });

}

module.exports = {
    register
}