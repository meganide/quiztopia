import "aws-lambda"

declare module "aws-lambda" {
  export interface APIGatewayProxyEventV2WithRequestContext<TRequestContext> {
    username: string
  }
}
