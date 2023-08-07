"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.findTaskById = exports.createTask = void 0;
const user_model_1 = require("../models/user.model");
function createTask(input) {
    return user_model_1.TaskModel.create(input);
}
exports.createTask = createTask;
function findTaskById(taskId) {
    return user_model_1.TaskModel.findById(taskId);
}
exports.findTaskById = findTaskById;
function deleteTask(taskId) {
    return user_model_1.TaskModel.findByIdAndDelete(taskId);
}
exports.deleteTask = deleteTask;
