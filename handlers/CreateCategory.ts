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
    const category:Category = JSON.parse(event.body) as Category;
    try{
        const response = await createCategory(category);
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