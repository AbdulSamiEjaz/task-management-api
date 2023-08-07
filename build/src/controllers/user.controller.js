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
exports.getStaffMembersDataHandler = exports.removeStaffMemberHandler = exports.addStaffMemberHandler = exports.getAllUsersHandler = exports.searchForUsersHandler = exports.getUserDetailsHandler = exports.updateUserHandler = exports.createUserHandler = void 0;
const cloudinary_1 = require("cloudinary");
const user_service_1 = require("../service/user.service");
const staff_service_1 = require("../service/staff.service");
const mongoose_1 = require("mongoose");
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_service_1.createUser)(req.body);
            user.username = `${user.firstName} ${user.lastName}`;
            yield user.save();
            return res.status(201).json(user);
        }
        catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "User already exists!" });
            }
            return res.status(500).json({ messgae: error });
        }
    });
}
exports.createUserHandler = createUserHandler;
function updateUserHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = res.locals.user;
            const user = yield (0, user_service_1.findUserById)(_id);
            const { firstName, lastName } = req.body;
            if (!user) {
                return res.status(404).json({ message: "User does not exists!" });
            }
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
            if (filePath) {
                const filePathToBase64String = filePath === null || filePath === void 0 ? void 0 : filePath.toString("base64");
                const cloudinaryUrlObj = yield cloudinary_1.v2.uploader.upload(`data:image/jpeg;base64,${filePathToBase64String}`);
                const cloudinaryPathUrl = cloudinaryUrlObj.secure_url;
                user.firstName = firstName;
                user.lastName = lastName;
                user.avatarUrl = cloudinaryPathUrl;
                const updatedUser = yield user.save();
                return res.status(200).json({ updatedUser });
            }
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.updateUserHandler = updateUserHandler;
function getUserDetailsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = res.locals.user;
            const currentUser = yield (0, user_service_1.findUserById)(_id);
            return res.status(200).json(currentUser);
        }
        catch (error) {
            return res.status(400).json({
                message: "Forbidden!",
            });
        }
    });
}
exports.getUserDetailsHandler = getUserDetailsHandler;
function searchForUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = res.locals.user;
            const { email } = req.query;
            const searchUsers = yield (0, user_service_1.searchForUsers)(currentUser._id, {
                email: email || "",
            });
            if (!searchUsers) {
                return res.status(400).json({
                    message: "Searched user does not exists!",
                });
            }
            return res.status(200).json(searchUsers);
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.searchForUsersHandler = searchForUsersHandler;
function getAllUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, user_service_1.getAllUsers)();
            if (!users) {
                return res.status(404).json({ message: "No user exists!" });
            }
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(404).json(error);
        }
    });
}
exports.getAllUsersHandler = getAllUsersHandler;
function addStaffMemberHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = res.locals.user;
            const { staffUserId } = req.params;
            const isValidId = mongoose_1.Types.ObjectId.isValid(staffUserId);
            if (!isValidId) {
                return res.status(500).json({
                    message: "Not a valid mongoose Id",
                });
            }
            if (staffUserId === currentUser._id) {
                return res.status(400).json({
                    message: "Cannot add yourself as a staff member!",
                });
            }
            const user = yield (0, user_service_1.findUserById)(currentUser._id);
            if (!user) {
                return res.status(404).json({ message: "Manager user not found" });
            }
            const isUserInUsers = yield (0, user_service_1.findUserById)(staffUserId);
            if (!isUserInUsers) {
                return res.status(404).json({ message: "User does not exists!" });
            }
            const staffMemberExists = yield (0, staff_service_1.findStaffMemberByUserId)(staffUserId);
            if (!staffMemberExists) {
                const staffMember = yield (0, staff_service_1.createStaffMember)(staffUserId);
                user === null || user === void 0 ? void 0 : user.staffMembers.push(staffMember);
                yield (user === null || user === void 0 ? void 0 : user.save());
                return res.status(201).json({ user });
            }
            if (staffMemberExists) {
                const doesStaffMemberAlreadyExists = user === null || user === void 0 ? void 0 : user.staffMembers.includes(staffMemberExists._id);
                if (!doesStaffMemberAlreadyExists) {
                    user === null || user === void 0 ? void 0 : user.staffMembers.push(staffMemberExists);
                    yield (user === null || user === void 0 ? void 0 : user.save());
                    return res.status(200).json({
                        user,
                    });
                }
                return res.status(200).json({ message: "Staff memeber already exists!" });
            }
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.addStaffMemberHandler = addStaffMemberHandler;
function removeStaffMemberHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUser = res.locals.user;
        const user = yield (0, user_service_1.findUserById)(currentUser._id);
        const { staffUserId } = req.params;
        const staffUser = yield (0, staff_service_1.findStaffMemberByUserId)(staffUserId);
        if (!user) {
            return res.status(404).json({ message: "Manager user not found" });
        }
        const updatedUser = user.staffMembers.filter((staff) => {
            // Always use strings for comparing in filter or other methods!
            return staff.toString() !== (staffUser === null || staffUser === void 0 ? void 0 : staffUser._id.toString());
        });
        user.staffMembers = updatedUser;
        yield user.save();
        return res.status(200).json(user);
    });
}
exports.removeStaffMemberHandler = removeStaffMemberHandler;
function getStaffMembersDataHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = res.locals.user;
            const user = yield (0, user_service_1.findUserById)(currentUser._id);
            if (!user) {
                return res.status(404).json({ messgae: "User does not exists!" });
            }
            const staffMembersData = yield user.populate({
                path: "staffMembers",
                populate: {
                    path: "userId",
                },
            });
            return res.status(200).json({
                staff: staffMembersData,
            });
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.getStaffMembersDataHandler = getStaffMembersDataHandler;
