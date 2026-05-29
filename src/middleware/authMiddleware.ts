import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: any;
}

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as DecodedToken;
            req.user = await User.findById(decoded.id).select('-passwordHash');
            next();
        } catch (error) {
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
        return;
    }
};

export const adminOnly = (req: any, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Access denied: Admins only' });
    }
};