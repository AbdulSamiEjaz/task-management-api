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
exports.removeStaffMemberFromTasksHandler = exports.deleteTaskHandler = exports.findTaskHandler = exports.updateTaskHandler = exports.createTaskHandler = void 0;
const task_service_1 = require("../service/task.service");
const mongoose_1 = require("mongoose");
const user_service_1 = require("../service/user.service");
const staff_service_1 = require("../service/staff.service");
const user_model_1 = require("../models/user.model");
function createTaskHandler(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const currentUser = res.locals.user;
        const { title, description, difficulty, assignedStaff } = req.body;
        const user = yield (0, user_service_1.findUserById)(currentUser._id);
        const existingStaffMembers = (_a = user === null || user === void 0 ? void 0 : user.staffMembers.map(String)) !== null && _a !== void 0 ? _a : [];
        const inputAssignedstaff = (_b = assignedStaff === null || assignedStaff === void 0 ? void 0 : assignedStaff.map(String)) !== null && _b !== void 0 ? _b : [];
        const filteredUsers = existingStaffMembers.filter((memeber) => inputAssignedstaff.includes(memeber));
        if (filteredUsers.length === 0) {
            return res.status(400).json({
                message: "Staff members are required to create a task!",
            });
        }
        const task = yield (0, task_service_1.createTask)({
            ownerId: currentUser._id,
            title,
            description,
            difficulty,
            assignedStaff: filteredUsers.map((member) => new mongoose_1.Types.ObjectId(member)),
        });
        // Save the reference to task as its ID to the staff members tasks assigned to you!
        for (const staffId of task.assignedStaff) {
            const staffMember = yield (0, staff_service_1.findStaffMemberId)(String(staffId));
            const user = yield (0, user_service_1.findUserById)(String(staffMember === null || staffMember === void 0 ? void 0 : staffMember.userId));
            user === null || user === void 0 ? void 0 : user.tasksAssignedToYou.push(task._id);
            yield (user === null || user === void 0 ? void 0 : user.save());
        }
        // Save the reference to task as its ID to the current User
        user === null || user === void 0 ? void 0 : user.tasks.push(task._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        return res.status(201).json({
            message: "Task created!",
            task,
        });
    });
}
exports.createTaskHandler = createTaskHandler;
function updateTaskHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUser = res.locals.user;
        const { taskId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Enter a correct task ID!",
            });
        }
        const { title, description, difficulty, completed, assignedStaff } = req.body;
        const user = yield (0, user_service_1.findUserById)(currentUser._id);
        if (!user) {
            return res.status(404).json({
                message: "User does not exists!",
            });
        }
        try {
            const task = yield (0, task_service_1.findTaskById)(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found!" });
            }
            task.title = title !== null && title !== void 0 ? title : task.title;
            task.description = description !== null && description !== void 0 ? description : task.description;
            task.difficulty = difficulty !== null && difficulty !== void 0 ? difficulty : task.difficulty;
            task.completed = completed !== null && completed !== void 0 ? completed : task.completed;
            // Update assigned users
            if (assignedStaff) {
                // Users which already are added in task
                const existingStaffInTask = task.assignedStaff.map(String);
                // Users which only are the part of current user staff
                const existingStaffInUser = user.staffMembers.map(String);
                // Users which come from req.body
                const inputStaff = assignedStaff.map(String);
                // Filtered users so that user can only add the staff which he/she owns
                const filteredUsers = existingStaffInUser.filter((member) => inputStaff.includes(member));
                // Creating a unique array where only unique staff member exists and no duplicates!
                let allStaffRef = [
                    ...new Set([...existingStaffInTask, ...filteredUsers]),
                ].map((member) => new mongoose_1.Types.ObjectId(member));
                for (const staffMember of allStaffRef) {
                    const staffUser = yield (0, staff_service_1.findStaffMemberId)(String(staffMember));
                    const user = yield (0, user_service_1.findUserById)(String(staffUser === null || staffUser === void 0 ? void 0 : staffUser.userId));
                    if (!(user === null || user === void 0 ? void 0 : user.tasksAssignedToYou.includes(task._id))) {
                        user === null || user === void 0 ? void 0 : user.tasksAssignedToYou.push(task._id);
                        yield (user === null || user === void 0 ? void 0 : user.save());
                    }
                }
                task.assignedStaff = allStaffRef;
            }
            yield task.save();
            return res.status(200).json({
                message: "Task Updated!",
            });
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.updateTaskHandler = updateTaskHandler;
function findTaskHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { taskId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Enter a correct task ID!",
            });
        }
        try {
            const task = yield (0, task_service_1.findTaskById)(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found!" });
            }
            return res.status(200).json({
                task,
            });
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.findTaskHandler = findTaskHandler;
function deleteTaskHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { taskId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Enter a correct task ID!",
            });
        }
        try {
            yield (0, task_service_1.deleteTask)(taskId);
            // Delete all the references of task
            yield user_model_1.UserModel.updateMany({ tasksAssignedToYou: taskId }, { $pull: { tasksAssignedToYou: taskId } });
            return res.status(200).json({
                message: "Task deleted successfully!",
            });
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.deleteTaskHandler = deleteTaskHandler;
function removeStaffMemberFromTasksHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { taskId, staffMemberId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Enter a correct task ID!",
            });
        }
        const task = yield (0, task_service_1.findTaskById)(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found!",
            });
        }
        const staffMembersAfterDeletion = task.assignedStaff.filter((member) => {
            return member.toString() !== staffMemberId;
        });
        const staffMember = yield (0, staff_service_1.findStaffMemberId)(staffMemberId);
        task.assignedStaff = staffMembersAfterDeletion;
        yield user_model_1.UserModel.updateOne({
            _id: staffMember === null || staffMember === void 0 ? void 0 : staffMember.userId,
        }, { $pull: { tasksAssignedToYou: task._id } });
        yield task.save();
        return res.status(200).json({
            message: "User removed successfully!",
        });
    });
}
exports.removeStaffMemberFromTasksHandler = removeStaffMemberFromTasksHandler;
