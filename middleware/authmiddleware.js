const jwt = require("jsonwebtoken");
const user = require("../models/user");

const Verify = async function(req, res, next){
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Not authorized, no token"});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await user.findById(decoded.id).select("-password, -pin");
        if (!req.user){
            return res.status(401).json({message:"user not found"});
        }
        next();
    }
    catch(err){
        res.status(401).json({message:"Not authorized, token failed"});
    }
};

module.exports = Verify;