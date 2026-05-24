const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log('Authorization header:', req.headers.authorization);

        const token = req.headers.authorization;

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                error: 'No token'
            });
        }

        console.log('Token received, verifying...');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Token verified, user:', decoded.id);

        req.user = decoded;
        next();

    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({
            error: 'Invalid token'
        });
    }
};