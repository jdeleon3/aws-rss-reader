import {SQSEvent,SQSBatchItemFailure,SQSHandler, Context, SQSBatchResponse} from 'aws-lambda';
import { processFeedRequest } from "../data/FeedItem";


export const main:SQSHandler = async(event:SQSEvent, context:Context):Promise<SQSBatchResponse> =>{
    console.log(event);
    const failures:SQSBatchItemFailure[] = [];
    for(let record of event.Records){
        try{
            let feed = JSON.parse(record.body);
            const sqsResponse = await processFeedRequest(feed);
            console.log(sqsResponse);
        }catch(err){
            failures.push({itemIdentifier:record.messageId});
        }
    }
    return {
        batchItemFailures:failures
    };
}
    
    

// Invoke main function if this file was run directly.
//@ts-ignore
//if (process.argv[1] === fileURLToPath(import.meta.url)) {
  //  main();
  //}