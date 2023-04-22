import { UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import { isTokenValid } from "../utils/index.js";

const userObj = (user) => {
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        photoUrl: user.photoUrl,
    }
}

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    try {
        const { userId } = isTokenValid({token});
        const user = await User.findOne({ _id: userId })
        const obj = userObj(user)

        if(user) {
            obj.userId = userId;
            req.user = obj;
        } else {
            throw new UnAuthenticatedError('Authentication Invalid');
        }
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export { authenticateUser, userObj }