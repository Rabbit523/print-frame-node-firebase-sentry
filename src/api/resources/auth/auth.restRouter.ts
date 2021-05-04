import { Request, Response, NextFunction } from 'express';
import { userRoles } from '../../generalInterfaces';
import { FireBaseAdmin } from '../../../server';
export interface IGetUserAuthInfoRequest extends Request {
  user: any;
}
interface RestuAuth {
  authenticated: any;
  authorized: any;
}
export const restAuth: RestuAuth = {
  authenticated: () => {},
  authorized: () => {},
};

restAuth.authenticated = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('authorization');
    if (!token) res.status(401).end({ message: 'Access denied' });
    const user = await FireBaseAdmin.auth().verifyIdToken(token as string);
    req.user = await user;
    next();
  } catch (e) {
    res.status(401).send({ message: e.code === 'auth/id-token-expired' ? 'auth/id-token-expired' : 'Access denied' });
  }
};
restAuth.authorized = (role: userRoles) => {
  return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const userRole = user.role;
      if (!userRole || userRole < role) {
        res.status(401).end({ message: ' Your are not authorized to access this area' });
      } else {
        next();
      }
    } catch (e) {
      res.status(401).send({ message: ' Your are not authorized to access this area' });
    }
  };
};
