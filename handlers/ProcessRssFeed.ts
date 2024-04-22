import {SQSEvent,SQSBatchItemFailure,SQSHandler, Context, SQSBatchResponse} from 'aws-lambda';
import { processFeedRequest } from "../data/FeedItem";
import { Feed } from '../data/Feed';


export const main:SQSHandler = async(event:SQSEvent, context:Context):Promise<SQSBatchResponse> =>{
    console.log(event);
    const failures:SQSBatchItemFailure[] = [];
    for(let record of event.Records){
        try{
            console.log(`Processing record: ${JSON.stringify(record)}`);
            let feed:Feed = JSON.parse(record.body);
            console.log(`Processing feed: ${JSON.stringify(feed)}`);
            const response = await processFeedRequest(feed);
            console.log(`Processing response: ${response}`);
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