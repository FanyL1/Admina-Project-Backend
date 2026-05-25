import crypto from 'crypto';

export const tokenExpirationSeconds = 30 * 60;

const base64UrlEncode = (data) => Buffer
    .from(JSON.stringify(data))
    .toString('base64url');

export const createToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no esta definida en .env');
    }

    const now = Math.floor(Date.now() / 1000);
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + tokenExpirationSeconds,
    };

    const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(tokenPayload)}`;
    const signature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(unsignedToken)
        .digest('base64url');

    return `${unsignedToken}.${signature}`;
};
