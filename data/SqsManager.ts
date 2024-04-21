import {SQSClient, ReceiveMessageCommand, DeleteMessageCommand, DeleteMessageBatchCommand, SendMessageCommand} from '@aws-sdk/client-sqs'
import { Feed } from './Feed';
import { processFeedRequest } from './FeedItem';

const sqsClient:SQSClient = new SQSClient({})
//@ts-ignore
const SQS_QUEUE_URL:string = process.env.FEED_PROCESSING_QUEUE

const receiveMessage = (queueUrl: string|undefined) => {
    return sqsClient.send(new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20,
        MessageAttributeNames: ['All'],
        AttributeNames: ['All']
    }));
}



export class SqsManager{
    static processRequests = async(queueUrl:string=SQS_QUEUE_URL):Promise<void> => {
    if(!queueUrl){
        console.log("No queue url");
        return;
    }       
    console.log(`Processing queue: ${JSON.stringify(queueUrl)}`);
    const result = await receiveMessage(queueUrl);
    if(!result || !result.Messages || result.Messages.length === 0){
        console.log("No messages");
        return;
    }
    console.log(JSON.stringify(result));
    result.Messages.forEach((msg) =>{
        try{
            if(!msg.Body){
                console.log("No body in message");
            }
            else{
                console.log(msg.Body);
                let feed:Feed = JSON.parse(msg.Body);
                processFeedRequest(feed);
            }            
        }
        catch(err){
            console.log(err);
        }
    });
    if(result.Messages.length === 1){
        sqsClient.send(new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: result.Messages[0].ReceiptHandle
        }));
    }
    else{
        sqsClient.send(new DeleteMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: result.Messages.map((msg, index) => {
                return {
                    Id: index.toString(),
                    ReceiptHandle: msg.ReceiptHandle
                }
            })
        }));

    }
    }
    
    static sendFeedRequest = async(feed:Feed):Promise<void> => {
        if(!SQS_QUEUE_URL){
            return;
        }
        await sqsClient.send(new SendMessageCommand({
            QueueUrl: SQS_QUEUE_URL,
            MessageBody: JSON.stringify(feed)
        }));
    }
    

}