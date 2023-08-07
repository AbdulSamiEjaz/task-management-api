"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchForUsers = exports.getAllUsers = exports.findUserByEmail = exports.findUserById = exports.createUser = void 0;
const user_model_1 = require("../models/user.model");
function createUser(input) {
    return user_model_1.UserModel.create(input);
}
exports.createUser = createUser;
function findUserById(id) {
    return user_model_1.UserModel.findById(id);
}
exports.findUserById = findUserById;
function findUserByEmail(email) {
    return user_model_1.UserModel.findOne({ email });
}
exports.findUserByEmail = findUserByEmail;
function getAllUsers() {
    return user_model_1.UserModel.find({});
}
exports.getAllUsers = getAllUsers;
function searchForUsers(userId, query) {
    return user_model_1.UserModel.find({
        _id: { $ne: userId },
        $or: [{ email: { $regex: query.email, $options: "i" } }],
    });
}
exports.searchForUsers = searchForUsers;
