import {APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import { Subcategory, updateSubcategory } from '../data/Subcategory';

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
    if(!event.body){
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'No body'})
        }
    }
    const request:any = JSON.parse(event.body);
    try{
        const response = await updateSubcategory(new Subcategory(request.title,request.description, request.id, request.parentCategoryId));
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