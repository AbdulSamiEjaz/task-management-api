import { Task, TaskModel } from "../models/user.model"

export function createTask(input: Partial<Task>) {
  return TaskModel.create(input)
}

export function findTaskById(taskId: string) {
  return TaskModel.findById(taskId)
}

export function deleteTask(taskId: string) {
  return TaskModel.findByIdAndDelete(taskId)
}