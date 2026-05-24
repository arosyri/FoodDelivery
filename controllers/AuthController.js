const AuthService = require('../services/AuthService');

class AuthController {

    async register(req, res) {

        try {

            const user = await AuthService.register(req.body);

            res.status(201).json({
                message: 'User registered',
                user
            });

        } catch (error) {

            res.status(400).json({
                error: error.message
            });
        }
    }

    async login(req, res) {

        try {

            const { email, password } = req.body;

            const data = await AuthService.login(
                email,
                password
            );

            res.json(data);

        } catch (error) {

            res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();