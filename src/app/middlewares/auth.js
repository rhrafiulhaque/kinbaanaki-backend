
const jwt = require("jwt-decode")

const auth =
    (...requiredRoles) =>
        async (req, res, next) => {
            try {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: 'Unauthorized: Access token not found',
                    });
                }

                let verifiedUser = null;

                try {
                    verifiedUser = jwt(
                        token
                    );

                } catch (error) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: 'Invalid Access token',
                    });
                }

                if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: 'Forbidden',
                    });
                }
                next();
            } catch (error) {
                next(error);
            }
        };

module.exports = {
    auth
}
