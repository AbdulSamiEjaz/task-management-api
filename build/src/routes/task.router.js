"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const requireUser_1 = __importDefault(require("../middleware/requireUser"));
const zod_express_middleware_1 = require("zod-express-middleware");
const task_schema_1 = require("../schema/task.schema");
exports.taskRouter = (0, express_1.Router)();
exports.taskRouter
    .route("/api/tasks")
    .post(requireUser_1.default, (0, zod_express_middleware_1.processRequestBody)(task_schema_1.createTaskSchema.body), task_controller_1.createTaskHandler);
exports.taskRouter
    .route("/api/tasks/:taskId")
    .patch(requireUser_1.default, (0, zod_express_middleware_1.processRequestBody)(task_schema_1.updateTaskSchema.body), task_controller_1.updateTaskHandler)
    .get(requireUser_1.default, task_controller_1.findTaskHandler)
    .delete(requireUser_1.default, task_controller_1.deleteTaskHandler);
exports.taskRouter
    .route("/api/tasks/:taskId/:staffMemberId")
    .patch(requireUser_1.default, task_controller_1.removeStaffMemberFromTasksHandler);
