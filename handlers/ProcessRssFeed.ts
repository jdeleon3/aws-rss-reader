import { fileURLToPath } from "url";
import { SqsManager } from "../data/SqsManager";
const SQS_QUEUE_URL:string|undefined = process.env.FEED_PROCESSING_QUEUE


export const main = async(queueUrl:string|undefined=SQS_QUEUE_URL) =>{
    
    SqsManager.processRequests(queueUrl);
}

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
  }