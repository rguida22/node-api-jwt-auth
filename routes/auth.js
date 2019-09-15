const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation/validation');

// REGISTER USER
router.post('/register', async (req, res) => {    
    // VALIDATE USER DATA  
    const {error} = registerValidation(req.body);  
    if(error) return res.status(400).send(error.details[0].message);    

    // CHECK IF USER EXISTS
    const emailExists = await User.findOne({ email: req.body.email });
    if(emailExists) return res.status(400).send('Email already Exists');

    // HASH THE PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });    
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    }catch(err){
        res.status(400).send(err);
    }
});

// LOGIN USER
router.post('/login', async (req, res) => {    
    // VALIDATE USER DATA  
    const {error} = loginValidation(req.body);  
    if(error) return res.status(400).send(error.details[0].message);    

    // CHECK IF USER EMAIL EXISTS
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email');

    // CHECK PASSWORD
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // CREATE AND ASSIGN JWT TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;

