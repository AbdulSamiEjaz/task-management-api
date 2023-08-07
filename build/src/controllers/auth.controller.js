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
exports.loginUserHandler = void 0;
const user_service_1 = require("../service/user.service");
const auth_utils_1 = require("../utils/auth.utils");
function loginUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield (0, user_service_1.findUserByEmail)(email);
            if (!user || !(yield user.comparePassword(password))) {
                return res.status(501).json({ message: "Invalid Creadentials!" });
            }
            const paylaod = user.toJSON();
            const jwt = yield (0, auth_utils_1.signJwt)(paylaod);
            res.cookie("accessToken", jwt, {
                maxAge: 3.154e10,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                path: "/",
            });
            return res.status(200).json(jwt);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.loginUserHandler = loginUserHandler;
