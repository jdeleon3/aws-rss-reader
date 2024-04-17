import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';

export async function main(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log('event 👉', event);

  return {
    body: JSON.stringify({message: 'Successful lambda invocation: ', event: JSON.stringify(event)}),
    statusCode: 200,
  };
}