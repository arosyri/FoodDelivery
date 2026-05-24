const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const UserFactory = require('../patterns/factory/UserFactory');

class AuthService {

    async register(userData) {

        const existingUser = await User.findOne({
            email: userData.email
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(
            userData.password,
            10
        );

        const user = UserFactory.createUser({
            ...userData,
            password: hashedPassword
        });

        await user.save();

        return user;
    }

    async login(email, password) {

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            throw new Error('Wrong password');
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return {
            token,
            user
        };
    }
}

module.exports = new AuthService();