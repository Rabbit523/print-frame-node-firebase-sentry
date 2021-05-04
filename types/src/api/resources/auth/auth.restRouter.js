"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../../server");
exports.restAuth = {
    authenticated: () => { },
    authorized: () => { },
};
exports.restAuth.authenticated = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (!token)
            res.status(401).end({ message: 'Access denied' });
        const user = await server_1.FireBaseAdmin.auth().verifyIdToken(token);
        req.user = await user;
        next();
    }
    catch (e) {
        res.status(401).send({ message: e.code === 'auth/id-token-expired' ? 'auth/id-token-expired' : 'Access denied' });
    }
};
exports.restAuth.authorized = (role) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            const userRole = user.role;
            if (!userRole || userRole < role) {
                res.status(401).end({ message: ' Your are not authorized to access this area' });
            }
            else {
                next();
            }
        }
        catch (e) {
            res.status(401).send({ message: ' Your are not authorized to access this area' });
        }
    };
};
//# sourceMappingURL=auth.restRouter.js.map