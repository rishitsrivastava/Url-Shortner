const {JWT_Secret} = require("./config")
const jwt = require("jsonwebtoken")

const checkList = ["/shorten", "/urls", "/:id"]

const authMiddleware = (req, res, next) => {
    if(checkList.indexOf(req.url.split("?")[0])>-1) {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ error: 'unauthorized: missing or invalid token'});
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_Secret);
            req.user = { userId: decoded.userId};
            next();
        } catch(err) {
            return res.status(403).json({ error: 'Unauthorized: Invalid token'});
        }
    }
    else {
        console.log("ignoring jwt verification")
        next();
    }
    
};

module.exports = {
    authMiddleware
}