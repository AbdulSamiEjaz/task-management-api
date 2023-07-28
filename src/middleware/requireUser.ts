import { NextFunction, Request, Response } from "express"

function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user

  if (!user) {
    return res.sendStatus(503)
  }

  return next()
}

export default requireUser
