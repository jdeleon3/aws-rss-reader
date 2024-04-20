import {APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import { Subcategory } from '../data/Subcategory';
import {getCategory, createCategory} from '../data/Category';
export const main: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    if(!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'No body'})
        }
    }    
    const request:any = JSON.parse(event.body);
    try{
        let parent =  await getCategory(request.parentCategoryId);
        if(!parent) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Parent category not found'})
            }
        }
        let subcat = new Subcategory(request.title, request.description, request.parentCategoryId);
        const response = await createCategory(subcat);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
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