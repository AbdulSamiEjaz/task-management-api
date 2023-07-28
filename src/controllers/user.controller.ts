import { Request, Response } from "express"
import { v2 as cloudinary } from "cloudinary"
import {
  CreateUserInput,
  SearchForUsersQuery,
  UpdateUserInputBody,
} from "../schema/user.schema"

import {
  createUser,
  findUserById,
  getAllUsers,
  searchForUsers,
} from "../service/user.service"
import {
  createStaffMember,
  findStaffMemberByUserId,
} from "../service/staff.service"
import { Types } from "mongoose"

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body)
    user.username = `${user.firstName} ${user.lastName}`
    await user.save()
    return res.status(201).json(user)
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists!" })
    }

    return res.status(500).json({ messgae: error })
  }
}

export async function updateUserHandler(
  req: Request<{}, {}, UpdateUserInputBody>,
  res: Response
) {
  try {
    const { _id } = res.locals.user

    const user = await findUserById(_id)
    const { firstName, lastName } = req.body

    if (!user) {
      return res.status(404).json({ message: "User does not exists!" })
    }

    const filePath = req.file?.buffer
    if (filePath) {
      const filePathToBase64String = filePath?.toString("base64")

      const cloudinaryUrlObj = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${filePathToBase64String}`
      )
      const cloudinaryPathUrl = cloudinaryUrlObj.secure_url

      user.firstName = firstName
      user.lastName = lastName
      user.avatarUrl = cloudinaryPathUrl

      const updatedUser = await user.save()

      return res.status(200).json({ updatedUser })
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function getUserDetailsHandler(req: Request, res: Response) {
  try {
    const { _id } = res.locals.user
    const currentUser = await findUserById(_id)

    return res.status(200).json(currentUser)
  } catch (error) {
    return res.status(400).json({
      message: "Forbidden!",
    })
  }
}

export async function searchForUsersHandler(
  req: Request<{}, {}, {}, SearchForUsersQuery>,
  res: Response
) {
  try {
    const currentUser = res.locals.user
    const { email } = req.query

    const searchUsers = await searchForUsers(currentUser._id, {
      email: email || "",
    })

    if (!searchUsers) {
      return res.status(400).json({
        message: "Searched user does not exists!",
      })
    }

    return res.status(200).json(searchUsers)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers()
    if (!users) {
      return res.status(404).json({ message: "No user exists!" })
    }

    return res.status(200).json(users)
  } catch (error) {
    return res.status(404).json(error)
  }
}

export async function addStaffMemberHandler(
  req: Request<{ staffUserId: string }>,
  res: Response
) {
  try {
    const currentUser = res.locals.user
    const { staffUserId } = req.params

    const isValidId = Types.ObjectId.isValid(staffUserId)
    if (!isValidId) {
      return res.status(500).json({
        message: "Not a valid mongoose Id",
      })
    }

    if (staffUserId === currentUser._id) {
      return res.status(400).json({
        message: "Cannot add yourself as a staff member!",
      })
    }

    const user = await findUserById(currentUser._id)
    if (!user) {
      return res.status(404).json({ message: "Manager user not found" })
    }

    const isUserInUsers = await findUserById(staffUserId)
    if (!isUserInUsers) {
      return res.status(404).json({ message: "User does not exists!" })
    }

    const staffMemberExists = await findStaffMemberByUserId(staffUserId)
    if (!staffMemberExists) {
      const staffMember = await createStaffMember(staffUserId)

      user?.staffMembers.push(staffMember)
      await user?.save()

      return res.status(201).json({ user })
    }

    if (staffMemberExists) {
      const doesStaffMemberAlreadyExists = user?.staffMembers.includes(
        staffMemberExists._id
      )

      if (!doesStaffMemberAlreadyExists) {
        user?.staffMembers.push(staffMemberExists)
        await user?.save()

        return res.status(200).json({
          user,
        })
      }

      return res.status(200).json({ message: "Staff memeber already exists!" })
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function removeStaffMemberHandler(
  req: Request<{ staffUserId: string }>,
  res: Response
) {
  const currentUser = res.locals.user
  const user = await findUserById(currentUser._id)

  const { staffUserId } = req.params
  const staffUser = await findStaffMemberByUserId(staffUserId)

  if (!user) {
    return res.status(404).json({ message: "Manager user not found" })
  }

  const updatedUser = user.staffMembers.filter((staff) => {
    // Always use strings for comparing in filter or other methods!
    return staff.toString() !== staffUser?._id.toString()
  })
  user.staffMembers = updatedUser

  await user.save()

  return res.status(200).json(user)
}

export async function getStaffMembersDataHandler(req: Request, res: Response) {
  try {
    const currentUser = res.locals.user

    const user = await findUserById(currentUser._id)

    if (!user) {
      return res.status(404).json({ messgae: "User does not exists!" })
    }

    const staffMembersData = await user.populate({
      path: "staffMembers",
      populate: {
        path: "userId",
      },
    })

    return res.status(200).json({
      staff: staffMembersData,
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}
