import { db } from "@/services"
import { User } from "@/types"
import { AWSError } from "aws-sdk/lib/error"
import createHttpError from "http-errors"

export async function createUser(userCredentials: User) {
  const { username, password } = userCredentials

  const params = {
    TableName: "Quiztopia",
    Item: {
      PK: `u#${username}`,
      SK: `p#${password}`,
      EntityType: "User"
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  try {
    await db.put(params).promise()
  } catch (error) {
    let err = error as AWSError
    if (err.code === "ConditionalCheckFailedException") {
      throw new createHttpError.Forbidden("Username already exists")
    }
  }
}
