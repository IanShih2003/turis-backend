const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    const token = req.header('token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.body = verified;
        res.send('Valid Token, proceed');
        next();
    }catch(err){
        res.send('Invalid Token');
    }   
}