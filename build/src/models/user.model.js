"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModel = exports.UserModel = exports.TaskModel = exports.Task = exports.Staff = exports.User = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const argon2_1 = __importDefault(require("argon2"));
const mongoose_1 = require("mongoose");
let User = exports.User = class User {
    comparePassword(candiatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield argon2_1.default.verify(this.password, candiatePassword);
        });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Staff }),
    __metadata("design:type", Array)
], User.prototype, "staffMembers", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Task }),
    __metadata("design:type", Array)
], User.prototype, "tasks", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Task }),
    __metadata("design:type", Array)
], User.prototype, "tasksAssignedToYou", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.pre)("save", function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isModified("password")) {
                return;
            }
            const hash = yield argon2_1.default.hash(this.password);
            this.password = hash;
            return next();
        });
    })
], User);
class Staff {
}
exports.Staff = Staff;
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => User }),
    __metadata("design:type", Object)
], Staff.prototype, "userId", void 0);
class Task {
}
exports.Task = Task;
__decorate([
    (0, typegoose_1.prop)({ ref: () => User, required: true }),
    __metadata("design:type", Object)
], Task.prototype, "ownerId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: ["Easy", "Medium", "Hard"], required: true }),
    __metadata("design:type", String)
], Task.prototype, "difficulty", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "completed", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Staff, type: () => mongoose_1.Types.ObjectId }),
    __metadata("design:type", Array)
], Task.prototype, "assignedStaff", void 0);
exports.TaskModel = (0, typegoose_1.getModelForClass)(Task, {
    schemaOptions: {
        timestamps: true,
    },
});
exports.UserModel = (0, typegoose_1.getModelForClass)(User, {
    schemaOptions: {
        timestamps: true,
    },
});
exports.StaffModel = (0, typegoose_1.getModelForClass)(Staff, {
    schemaOptions: {
        timestamps: true,
    },
});
