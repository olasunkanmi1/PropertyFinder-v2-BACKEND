import { UnAuthenticatedError } from "../errors";
import { isTokenValid } from "../utils";

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    try {
        const { name, userId } = isTokenValid({token});
        req.user = { name, userId };
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export default authenticateUser