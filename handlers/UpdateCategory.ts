import {APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {Category,updateCategory} from '../data/Category'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
    if(!event.body){
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'No body'})
        }
    }
    const request:any = JSON.parse(event.body);
    try{
        const response = await updateCategory(new Category(request.title,request.description, request.id));
        return {
            body:JSON.stringify(response),
            statusCode:200
        };
    }catch(err){
        console.log(err)        
        return {
        body: JSON.stringify(err),
        statusCode:500
    }
    }

}