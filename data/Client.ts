import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient,QueryCommand, GetCommand, GetCommandOutput, DeleteCommand,TransactWriteCommand, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";

let client: DynamoDBClient// = null

export async function putItem(tableName:string, item:Record<string,unknown>|undefined): Promise<any> {
    getClient();

    
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
        ConditionExpression: AvailableConditionExpressions.itemDoesNotExistCondition
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
            ConditionExpression: AvailableConditionExpressions.itemExistsCondition
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
                ConditionExpression: AvailableConditionExpressions.itemExistsCondition
            });
            const docClient = DynamoDBDocumentClient.from(client)
        
            const response = await docClient.send(command);
            console.log(response);
            return response;
            }

export async function transactWrite(tableName: string, items: TransactWriteInfo[]|undefined): Promise<any> {
    getClient();
    
    let input:TransactWriteCommandInput = {
        TransactItems: []    
    }
        items?.forEach(cmd => {
            if(cmd.transType == TransactType.PUT){
                let ci = {Put: {
                    TableName: tableName,
                    Item: cmd.item,
                    ...(cmd.conditionExpression?{ConditionExpression: cmd.conditionExpression}:{})
                }}
                input.TransactItems?.push(ci);
            }
            else if(cmd.transType == TransactType.DELETE){
                input.TransactItems?.push({Delete: {
                    TableName: tableName,
                    Key: cmd.item,
                    ConditionExpression: AvailableConditionExpressions.itemExistsCondition
                }});
            }
            
        });
    console.log(input);
    const command = new TransactWriteCommand(input);    
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


export async function queryItems(tableName: string, indexName:string|undefined, keyConditionExpression: string, expressionValues:Record<string,any>){
    getClient();
    console.log(expressionValues);
    const docClient = DynamoDBDocumentClient.from(client)
    const command = new QueryCommand({
        TableName: tableName,
        
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionValues,
        ...(indexName?{IndexName: indexName}:{})
      });
      console.log(command);    
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
export class TransactWriteInfo{
    item: Record<string, unknown>
    transType: TransactType
    conditionExpression: AvailableConditionExpressions|undefined

    constructor(item: Record<string, unknown>, transType: TransactType, conditionExpression?: AvailableConditionExpressions){
        this.item = item;
        this.transType = transType;
        this.conditionExpression = conditionExpression;
    }
}

export class QueryExpressionAttributes{
    key: string
    value: string
    operator: string
}



export enum TransactType{
    PUT="Put",
    DELETE="Delete"
}

export enum AvailableConditionExpressions{
    itemDoesNotExistCondition="attribute_not_exists(PK) AND attribute_not_exists(SK)",
    itemExistsCondition="attribute_exists(PK) AND attribute_exists(SK)"
}