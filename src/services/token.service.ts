import jwt, { JwtPayload } from 'jsonwebtoken';

export const getTokenPayload = (token: string) => {

  console.log('Token: ', token);
  
  const payload = jwt.verify(token, process.env.SECRET_KEY || '123', {
    ignoreExpiration: true,
  }) as JwtPayload;

  const { exp, iat, ...cleanPayload } = payload;

  console.log(cleanPayload);

  return cleanPayload;
};
