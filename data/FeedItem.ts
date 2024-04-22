import {BaseItem} from './BaseItem'
import {getItem, queryItems, TransactWriteInfo, TransactType,AvailableConditionExpressions, putItem, batchWriteItems} from './Client';
import { ulid } from 'ulid';
import {Message} from '@aws-sdk/client-sqs'
import {Feed} from './Feed'
import { siteReader } from './siteReader';
export class FeedItem extends BaseItem{
id: string
title: string
link: string
description:string
author: string	
published: string	
aiSummary: string | undefined
feedId: string
content: string

constructor(feedId: string, title: string, link: string, description:string, content:string, author: string, published: string, aiSummary?: string, id:string = ulid()){
    super()
    this.id = id
    this.title = title
    this.link = link
    this.description = description
    this.author = author
    this.published = published
    this.aiSummary = aiSummary
    this.feedId = feedId
    this.content = content
}


    get PK(): string {
        return `FI#${this.feedId}`
    }
    get SK(): string {
        return `FEEDITEM#${this.id}`
    }
    toItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            title: this.title,
            link: this.link,
            description: this.description,
            author: this.author,
            published: this.published,
            aiSummary: this.aiSummary,
            content: this.content
        }
    }

    
}

export const processFeedRequest = async(feed:Feed):Promise<void> =>{
    if(!feed){
        console.log('No feed');
        return
    }
    
    let feedItems = await siteReader.processSiteFeed(feed.rssUrl, feed.id);
    console.log(`Feed Items found: ${JSON.stringify(feedItems)}`);
    if(!feedItems || feedItems.length === 0){
        console.log('No feedItems');
        return
    }    
    let writeItems:Record<string,unknown>[] = []
    feedItems.forEach( (f:FeedItem) => {
        writeItems.push(f.toItem());
    });
    let response = await batchWriteItems(process.env.TABLE_NAME!, writeItems);
    console.log(response);
    return response;
    /*feedItems.forEach( async (f:FeedItem) => {
        try{
            console.log(`Putting item: ${f.id}`);
            let response = await putItem(process.env.TABLE_NAME!, f.toItem());        
            console.log(response);
        }
        catch(e){
            console.log(e);
        }        
    });*/
        
}