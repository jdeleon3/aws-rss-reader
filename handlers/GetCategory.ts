import {APIGatewayProxyResultV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {getCategory, Category} from '../data/Category'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
    if(!event.pathParameters || !event.pathParameters!.id){
        return {
            statusCode: 400,
            body: 'Missing id parameter'
        }
    }
    try{
        const category: Category = await getCategory(event.pathParameters.id)
        return {
            statusCode: 200,
            body: JSON.stringify(category)
        }
    }
    catch(err){
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
    
}