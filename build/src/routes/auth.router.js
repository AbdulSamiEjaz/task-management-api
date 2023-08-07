"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const zod_express_middleware_1 = require("zod-express-middleware");
const auth_schema_1 = require("../schema/auth.schema");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/auth/login", (0, zod_express_middleware_1.processRequestBody)(auth_schema_1.loginUserSchema.body), auth_controller_1.loginUserHandler);
