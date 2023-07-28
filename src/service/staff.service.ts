import { Types } from "mongoose"
import { Staff, StaffModel } from "../models/user.model"

export function createStaffMember(userId: string) {
  return StaffModel.create({ userId })
}
export function findStaffMemberId(userId: string) {
  return StaffModel.findById(userId)
}

export function deleteStaffMemberById(userId: string) {
  return StaffModel.findByIdAndDelete(userId)
}

export function findStaffMemberByUserId(userId: string) {
  return StaffModel.findOne({ userId })
}
