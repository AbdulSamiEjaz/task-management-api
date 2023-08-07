"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_utils_1 = require("../utils/auth.utils");
function deserializeUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = (req.headers.authorization ||
            req.cookies.accessToken ||
            "").replace(/^Bearer\s/, "");
        if (!accessToken) {
            return next();
        }
        const decoded = yield (0, auth_utils_1.verifyJwt)(accessToken);
        if (decoded) {
            res.locals.user = decoded;
        }
        return next();
    });
}
exports.default = deserializeUser;