import jwt from 'jsonwebtoken';

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token
}

const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: true,
        signed: true,
        sameSite: 'none'
    });

    res.setHeader('Access-Control-Allow-Origin', process.env.CORSORIGIN);
}

export { createJWT, isTokenValid, attachCookiesToResponse }