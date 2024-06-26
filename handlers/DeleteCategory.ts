import {APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {deleteCategory, Category} from '../data/Category'

export const main: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({message: 'No body'})
    }
    const request:any = JSON.parse(event.body);
    try{
        const response = await deleteCategory(new Category(request.title,request.description, request.id));
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