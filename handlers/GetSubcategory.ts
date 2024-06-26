import {APIGatewayProxyResultV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {getCategory} from '../data/Category'
import {Subcategory, getSubcategory} from '../data/Subcategory'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{
    if(!event.pathParameters || !event.pathParameters!.id || !event.pathParameters.parentCategoryId){
        return {
            statusCode: 400,
            body: 'Missing id parameter'
        }
    }
    try{
        const category: Subcategory = await getSubcategory(event.pathParameters.parentCategoryId,event.pathParameters.id) as Subcategory
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