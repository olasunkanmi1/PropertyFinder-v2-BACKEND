import { UnAuthenticatedError } from "../errors/index.js";
import { isTokenValid } from "../utils/index.js";

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    try {
        const { firstName, lastName, email, userId, isVerified, verificationToken } = isTokenValid({token});
        req.user = { firstName, lastName, email, userId, isVerified, verificationToken };
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export default authenticateUser