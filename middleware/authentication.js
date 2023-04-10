import { UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import { isTokenValid } from "../utils/index.js";

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    try {
        const { userId } = isTokenValid({token});
        const user = await User.findOne({ _id: userId })
        const obj = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userId: userId,
            isVerified: user.isVerified,
            verificationToken: user.verificationToken,
            photoUrl: user.photoUrl,
        }

        if(user) {
            req.user = obj;
        } else {
            throw new UnAuthenticatedError('Authentication Invalid');
        }
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export default authenticateUser