"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStaffMemberByUserId = exports.deleteStaffMemberById = exports.findStaffMemberId = exports.createStaffMember = void 0;
const user_model_1 = require("../models/user.model");
function createStaffMember(userId) {
    return user_model_1.StaffModel.create({ userId });
}
exports.createStaffMember = createStaffMember;
function findStaffMemberId(userId) {
    return user_model_1.StaffModel.findById(userId);
}
exports.findStaffMemberId = findStaffMemberId;
function deleteStaffMemberById(userId) {
    return user_model_1.StaffModel.findByIdAndDelete(userId);
}
exports.deleteStaffMemberById = deleteStaffMemberById;
function findStaffMemberByUserId(userId) {
    return user_model_1.StaffModel.findOne({ userId });
}
exports.findStaffMemberByUserId = findStaffMemberByUserId;
