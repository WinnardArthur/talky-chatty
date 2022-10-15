const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        if(!token) {
            return res.status(401).json({message: 'Not authorized, no token'})
        }

        console.log('length', token.length)

        const jwtAuth = token.length < 500;

        if(token && jwtAuth) {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decodedData.id).select("-pasword")
        }

        next()
    } catch (error) {
        res.status(401).json({message: 'Not authorized, token failed'})
    }
}