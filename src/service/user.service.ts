import { User, UserModel } from "../models/user.model"

export function createUser(input: Partial<User>) {
  return UserModel.create(input)
}

export function findUserById(id: string) {
  return UserModel.findById(id)
}

export function findUserByEmail(email: User["email"]) {
  return UserModel.findOne({ email })
}

export function getAllUsers() {
  return UserModel.find({})
}

export function searchForUsers(userId: string, query: { email?: string }) {
  return UserModel.find({
    _id: { $ne: userId },
    $or: [{ email: { $regex: query.email, $options: "i" } }],
  })
}
