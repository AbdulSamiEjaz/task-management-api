"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("./user.route");
const auth_router_1 = require("./auth.router");
const task_router_1 = require("./task.router");
exports.router = (0, express_1.Router)();
exports.router.use(user_route_1.userRouter);
exports.router.use(auth_router_1.authRouter);
exports.router.use(task_router_1.taskRouter);
// export default router
