import {APIGatewayProxyResultV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {getAllSubcategories, Subcategory} from '../data/Subcategory'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{

    try{
        if(!event.pathParameters || !event.pathParameters.parentCategoryId){
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Missing parentCategoryId'})
            }
        }
        
        const categories: Subcategory[] = await getAllSubcategories(event.pathParameters.parentCategoryId)
        return {
            statusCode: 200,
            body: JSON.stringify(categories)
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