"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchForUsersSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = {
    body: (0, zod_1.object)({
        firstName: (0, zod_1.string)({ required_error: "Firstname is required!" }),
        lastName: (0, zod_1.string)({ required_error: "Lastname is required!" }),
        password: (0, zod_1.string)({ required_error: "Password is required!" })
            .min(6, "Password must be atleast 6 characters!")
            .max(64, "Password must be less than 64 characters!"),
        confirmPassword: (0, zod_1.string)({
            required_error: "Confirm Password is required!",
        })
            .min(6, "Password must be atleast 6 characters!")
            .max(64, "Password must be less than 64 characters!"),
        email: (0, zod_1.string)({ required_error: "Email is required!" }).email("Must be a valid email!"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match!",
        path: ["confirmPassword"],
    }),
};
exports.updateUserSchema = {
    body: (0, zod_1.object)({
        firstName: (0, zod_1.string)(),
        lastName: (0, zod_1.string)(),
    }),
};
exports.searchForUsersSchema = {
    query: (0, zod_1.object)({
        email: (0, zod_1.string)().optional(),
    }),
};
