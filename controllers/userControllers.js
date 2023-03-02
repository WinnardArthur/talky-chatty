const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { fullName, email, password, pic} = req.body;
    try {
   
       if(!fullName || !email || !password) {
           return res.status(400).json({message: 'Please enter all the fields'})
       }   
   
       const userExist = await User.findOne({ email })
   
       if(userExist) {
           return res.status(400).json({message: 'User already exists'})
       }
   
       const user = await User.create({
           name: fullName,
           email,
           password, 
           pic
       });
   
       const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
   
       if(user) {
           const {password, ...responseUser} = user._doc;
           res.status(201).json({responseUser, token})
       } else {
           res.status(400).json({message: 'Failed to create user'})
       }
    } catch (error) {
        console.log('An Error Occured: ', error)
    }
}

exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if(user) {
            const comparePassword = await user.matchPassword(password);
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
            
            if(comparePassword) {
                const { password, ...responseUser} = user._doc;
                res.json({responseUser, token})
            } else {
                res.status(401).json({message: 'Invalid email or password'})
            }
        }
    } catch (error) {
        console.log('An Error Occured: ', error)
    }
}

exports.allUsers = async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" }},
                { email: { $regex: req.query.search, $options: "i"}}
            ]
        } : {};
    
        const users = await User.find(keyword).find({_id: { $ne: req.user._id }})
    
        res.send(users); 
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}