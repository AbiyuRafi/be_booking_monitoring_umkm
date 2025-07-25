require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateToken(user) {
    const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_KEY, { expiresIn: '2h' });
    return token;
}
function checkToken(token) {
    if (!token || !token.startsWith('Bearer ')) {
        return { error: 'Invalid token format' };
    }

    const formattedToken = token.split(' ')[1];

    if (!formattedToken) {
        return { error: "A token is required for authentication" };
    }

    try {
        const decoded = jwt.verify(formattedToken, process.env.TOKEN_KEY);
        return decoded;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { error: 'Token has expired' };
        } else {
            return { error: "Invalid token" };
        }
    }
}


module.exports = {
    generateToken,
    checkToken 
};
