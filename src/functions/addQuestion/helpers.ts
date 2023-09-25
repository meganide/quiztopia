import { db } from "@/services"
import createHttpError from "http-errors"

// export async function saveQuestion(questionBody: Question) {
//   const id = nanoid()

//   await db
//     .put({
//       TableName: "Quiztopia",
//       Item: {
//         PK: `q#${id}`,
//         SK: `u#${username}`,
//         EntityType: "Quiz",
//         QuizName: quizName
//       }
//     })
//     .promise()

//   return id
// }

export async function verifyOwner(username: string, quizId: string) {
  const { Items } = await db
    .query({
      TableName: "Quiztopia",
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `q#${quizId}`
      }
    })
    .promise()

  console.log("Item: ", Items)

  if (!Items || Items?.length === 0) {
    throw new createHttpError.NotFound("Quiz not found.")
  }

  if (Items[0].SK !== `u#${username}`) {
    throw new createHttpError.Forbidden("You are not the owner of this quiz.")
  }
}
