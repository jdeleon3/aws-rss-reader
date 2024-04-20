import {APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {deleteCategory} from '../data/Category'

export const main: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
    if(!event.pathParameters || !event.pathParameters.id){
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Missing id'})
        }
    }
    try{
        const response = await deleteCategory(event.pathParameters.id);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    }catch(err){
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
}