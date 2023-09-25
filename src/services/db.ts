import { DocumentClient } from "aws-sdk/clients/dynamodb"

export const db = new DocumentClient({
  region: process.env.AWS_REGION
})
