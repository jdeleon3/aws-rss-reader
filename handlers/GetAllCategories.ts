import {APIGatewayProxyResultV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda'
import {getAllCategories, Category} from '../data/Category'

export const main: APIGatewayProxyHandlerV2 = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> =>{

    try{
        const categories: Category[] = await getAllCategories()
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