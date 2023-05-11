const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    encryptPassword: (password) =>{
        const salt = bcrypt.genSaltSync(11);
        return bcrypt.hashSync(password, salt);
    },
    createToken: (payload, expired = "24h") =>{
        return token = jwt.sign(payload, "!@renthaven33@!", {expiresIn: expired})
    },
    tokenVerify: (req, res,next) =>{
        jwt.verify(req.token, "!@renthaven33@!", (err, decrypt) =>{
            if(err){
                console.log("Error")
                return res.status(401).send({
                    success: false,
                    message: "Authenticate token failed!"
                })
            }
            req.decrypt = decrypt[0];
            next();
        })
    }

}