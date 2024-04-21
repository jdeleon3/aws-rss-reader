import {APIGatewayProxyResultV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {getAllFeeds, Feed} from '../data/Feed'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{

    try{
        if(!event.pathParameters || !event.pathParameters.subcategoryId){
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Missing subcategoryId'})
            }
        }
        
        const feeds: Feed[] = await getAllFeeds(event.pathParameters.subcategoryId)
        return {
            statusCode: 200,
            body: JSON.stringify(feeds)
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