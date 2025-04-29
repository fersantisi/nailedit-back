import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


export function blockAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const authToken = req.cookies?.authToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!authToken || !refreshToken) {
        return next();
    }

    try {
        
        const payload = jwt.verify(authToken, process.env.SECRET_KEY || "123") as JwtPayload;

        res.status(403).json({ message: "Logged in. Acces Denied." });
    } catch (error) {
        
        next();
    }
}