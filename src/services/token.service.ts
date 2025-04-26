import jwt, { JwtPayload } from 'jsonwebtoken';


export const getTokenPayload = (token: string) =>{

    const payload = jwt.verify(token, process.env.SECRET_KEY || '123', {
        ignoreExpiration: true,
      }) as JwtPayload;
    
    return payload

}