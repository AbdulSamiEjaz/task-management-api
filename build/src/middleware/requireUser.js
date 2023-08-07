"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function requireUser(req, res, next) {
    const user = res.locals.user;
    if (!user) {
        return res.sendStatus(503);
    }
    return next();
}
exports.default = requireUser;
