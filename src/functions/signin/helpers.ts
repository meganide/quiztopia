import { db } from "@/services"
import { User } from "@/types"
import createHttpError from "http-errors"
import jwt from "jsonwebtoken"

export async function loginUser(userCredentials: User) {
  const { username, password } = userCredentials

  const params = {
    TableName: "Quiztopia",
    Key: {
      PK: `u#${username}`,
      SK: `p#${password}`
    },
    AttributesToGet: ["PK"]
  }

  const { Item } = await db.get(params).promise()

  if (!Item) {
    throw new createHttpError.Unauthorized("Invalid credentials.")
  }

  return username
}

export function createToken(username: string) {
  try {
    const token = jwt.sign({ username }, "mysupersecretkey")
    return token
  } catch (error) {
    console.log(error)
    throw new createHttpError.InternalServerError("Failed to create token.")
  }
}
