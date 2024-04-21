import {APIGatewayProxyEventV2,APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {createFeed, Feed} from '../data/Feed'
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
        const response = await createFeed(new Feed(request.siteUrl,request.subcategoryId, request.categoryId));
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