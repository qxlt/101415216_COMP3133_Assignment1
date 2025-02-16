const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

const authenticate = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("Authorization header required");
    }

    const token = authHeader.split(" ")[1]; 
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded; 
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

module.exports = authenticate;
