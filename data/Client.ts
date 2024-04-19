import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand, GetCommandOutput, DeleteCommand } from "@aws-sdk/lib-dynamodb";

let client: DynamoDBClient// = null

export async function putItem(tableName:string, item:Record<string,unknown>|undefined): Promise<any> {
    getClient();
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    });
    const docClient = DynamoDBDocumentClient.from(client)

    const response = await docClient.send(command);
    console.log(response);
    return response;
    }

    //Update by replacing entire object
    export async function updateItem(tableName:string, item:Record<string,unknown>|undefined): Promise<any> {
        getClient();
        const command = new PutCommand({
            TableName: tableName,
            Item: item,
            ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)'
        });
        const docClient = DynamoDBDocumentClient.from(client)
    
        const response = await docClient.send(command);
        console.log(response);
        return response;
        }

        export async function deleteItem(tableName:string, pk: string, sk: string): Promise<any> {
            getClient();
            const command = new DeleteCommand({
                TableName: tableName,
                Key: {
                    PK: pk,
                    SK: sk
                },
                ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)'
            });
            const docClient = DynamoDBDocumentClient.from(client)
        
            const response = await docClient.send(command);
            console.log(response);
            return response;
            }

export async function getItem(tableName: string, pk: string, sk: string): Promise<GetCommandOutput> {
    getClient();
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            PK: pk,
            SK: sk
        }
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