import { prop, pre, getModelForClass, Ref } from "@typegoose/typegoose"
import argon2 from "argon2"
import { Types } from "mongoose"

@pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return
  }

  const hash = await argon2.hash(this.password)
  this.password = hash

  return next()
})
export class User {
  @prop({ required: true })
  public firstName: string

  @prop({ required: true })
  public lastName: string

  @prop()
  public username: string

  @prop({ required: true, unique: true })
  public email: string

  @prop({ required: true })
  public password: string

  @prop()
  public avatarUrl: string

  @prop({ ref: () => Staff })
  public staffMembers: Ref<Staff>[]

  @prop({ ref: () => Task })
  public tasks: Ref<Task>[]

  @prop({ ref: () => Task })
  public tasksAssignedToYou: Ref<Task>[]

  public async comparePassword(candiatePassword: string): Promise<boolean> {
    return await argon2.verify(this.password, candiatePassword)
  }
}

export class Staff {
  @prop({ required: true, ref: () => User })
  public userId: Ref<User>
}

export class Task {
  @prop({ ref: () => User, required: true })
  public ownerId: Ref<User>

  @prop({ required: true })
  public title: string

  @prop()
  public description: string

  @prop({ enum: ["Easy", "Medium", "Hard"], required: true })
  public difficulty: string

  @prop({ default: false })
  public completed: boolean

  @prop({ ref: () => Staff, type: () => Types.ObjectId })
  public assignedStaff: Ref<Staff>[]
}

export const TaskModel = getModelForClass(Task, {
  schemaOptions: {
    timestamps: true,
  },
})

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
})

export const StaffModel = getModelForClass(Staff, {
  schemaOptions: {
    timestamps: true,
  },
})
