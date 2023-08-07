"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const zod_express_middleware_1 = require("zod-express-middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_schema_1 = require("../schema/user.schema");
const multer_1 = require("../middleware/multer");
const requireUser_1 = __importDefault(require("../middleware/requireUser"));
exports.userRouter = (0, express_1.Router)();
exports.userRouter
    .route("/api/users")
    .post((0, zod_express_middleware_1.processRequestBody)(user_schema_1.createUserSchema.body), user_controller_1.createUserHandler)
    .get(requireUser_1.default, user_controller_1.getAllUsersHandler);
exports.userRouter.patch("/api/users/:userId", multer_1.upload.single("avatar"), user_controller_1.updateUserHandler);
exports.userRouter.get("/api/users/me", requireUser_1.default, user_controller_1.getUserDetailsHandler);
exports.userRouter.get("/api/searchUsers", requireUser_1.default, (0, zod_express_middleware_1.processRequestQuery)(user_schema_1.searchForUsersSchema.query), user_controller_1.searchForUsersHandler);
exports.userRouter
    .route("/api/users/staff/:staffUserId")
    .patch(requireUser_1.default, user_controller_1.addStaffMemberHandler)
    .put(requireUser_1.default, user_controller_1.removeStaffMemberHandler);
exports.userRouter.get("/api/users/staff", requireUser_1.default, user_controller_1.getStaffMembersDataHandler);
