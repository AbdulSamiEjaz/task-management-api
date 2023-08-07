"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const DIFFICULTY_LEVEL = {
    Easy: "Easy",
    Hard: "Hard",
    Medium: "Medium",
};
const assignedUserSchema = (0, zod_1.string)({
    required_error: "One Staff Member must be assigned to a task!",
});
exports.createTaskSchema = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({ required_error: "Title is required!" }),
        description: (0, zod_1.string)().optional(),
        difficulty: (0, zod_1.string)().refine((value) => {
            return Object.values(DIFFICULTY_LEVEL).includes(value);
        }, { message: "Invalid difficulty level!" }),
        assignedStaff: (0, zod_1.array)(assignedUserSchema).optional(),
    }),
};
exports.updateTaskSchema = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({ required_error: "Title is required!" }).optional(),
        description: (0, zod_1.string)().optional(),
        difficulty: (0, zod_1.string)()
            .refine((value) => {
            return Object.values(DIFFICULTY_LEVEL).includes(value);
        }, { message: "Invalid difficulty level!" })
            .optional(),
        completed: (0, zod_1.boolean)().optional(),
        assignedStaff: (0, zod_1.array)(assignedUserSchema).optional(),
    }),
    params: (0, zod_1.object)({
        taskId: (0, zod_1.string)(),
    }),
};
