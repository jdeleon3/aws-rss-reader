import {APIGatewayProxyEventV2,APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {createCategory, Category} from '../data/Category'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2):Promise<APIGatewayProxyResultV2> =>{
    console.log(event);
    if(!event.body){
        return {
            body:'No body',
            statusCode:400
        }
    }
    const request:any = JSON.parse(event.body);
    try{
        const response = await createCategory(new Category(request.title,request.description));        
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