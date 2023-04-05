import { UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import { isTokenValid } from "../utils/index.js";

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    try {
        const { firstName, lastName, email, userId, isVerified, verificationToken, photoUrl } = isTokenValid({token});
        const user = await User.findOne({ _id: userId })

        if(user) {
            req.user = { firstName, lastName, email, userId, isVerified, verificationToken, photoUrl };
        } else {
            throw new UnAuthenticatedError('Authentication Invalid');
        }
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export default authenticateUser