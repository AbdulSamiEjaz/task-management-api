"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = void 0;
const zod_1 = require("zod");
exports.loginUserSchema = {
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({ required_error: "Email is required!" }).email("Must be a valid email!"),
        password: (0, zod_1.string)({ required_error: "Password is required!" })
            .min(6, "Password must be atleast 6 characters!")
            .max(64, "Password must be less than 64 characters!"),
    }),
};
