import crypto from 'crypto';

//Dos horas
export const tokenExpirationSeconds = 120 * 60;

const base64UrlEncode = (data) =>{ 
    return Buffer
        .from(JSON.stringify(data))
        .toString('base64url');
}

const base64UrlDecode = (str) => {
    return JSON.parse(Buffer.from(str, 'base64url').toString());
};
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

export const verifyToken = (token) => {
    try {
        const parts = token.split('.');
        
        if (parts.length !== 3) {
            throw new Error('Formato de token inválido');
        }
        
        const [headerB64, payloadB64, signature] = parts;
        const header = base64UrlDecode(headerB64);
        
        if (header.alg !== 'HS256') {
            throw new Error(`Algoritmo no permitido: ${header.alg}`);
        }
        
        if (header.alg === 'none') {
            throw new Error('Algoritmo "none" no permitido');
        }
        
        const unsignedToken = `${headerB64}.${payloadB64}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.JWT_SECRET)
            .update(unsignedToken)
            .digest('base64url');
        
        if (signature !== expectedSignature) {
            throw new Error('Firma inválida');
        }
        
        const payload = base64UrlDecode(payloadB64);
        
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('Token expirado');
        }
        
        return payload;
        
    } catch (error) {
        throw new Error('Token inválido: ' + error.message);
    }
};