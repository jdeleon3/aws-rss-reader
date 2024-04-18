import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let client: DynamoDBClient// = null

export async function putItem(tableName:string, item:Record<string,unknown>|undefined): Promise<any> {
    getClient();
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(FK)'
    });
    const docClient = DynamoDBDocumentClient.from(client)

    const response = await docClient.send(command);
    console.log(response);
    return response;
    }

const getClient = () =>{
    if(!client){
        client = new DynamoDBClient({
            region: process.env.REGION
        });
    }
}