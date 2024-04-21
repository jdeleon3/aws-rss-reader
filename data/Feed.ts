import {BaseItem} from './BaseItem'
import {getItem, queryItems, TransactWriteInfo, TransactType,AvailableConditionExpressions, transactWrite} from './Client';
import { ulid } from 'ulid';
import {siteReader} from './siteReader';

export class Feed extends BaseItem {
    id: string
    feedType: string;
    siteUrl: string;
    rssUrl?: string;
    lastScanned?: Date;
    subcategoryId: string;
    categoryId: string;

    constructor(siteUrl: string, subcategoryId: string, categoryId: string, rssUrl?: string, lastScanned?: Date, id: string = ulid()){
        super()
        this.id = id
        this.feedType = Feed.getSiteType(siteUrl)
        this.siteUrl = siteUrl
        this.rssUrl = rssUrl
        this.lastScanned = lastScanned
        this.subcategoryId = subcategoryId
        this.categoryId = categoryId
    }
    
    public getGSI1Keys(){
        return {
            GSI1PK: this.feedType,
            GSI1SK: this.siteUrl
        }
    }

    public getGSI2Keys(){
        return {
            GSI2PK: this.siteUrl,
            GSI2SK: this.PK
        }
    }
    public static getSiteType(siteUrl:string){
        let uri = new URL(siteUrl)
        if (uri.hostname.includes('youtube.com')){
            return 'youtube'
        }
        else if (uri.hostname.includes('reddit.com')){
            return 'twitter'
        }
        else if (uri.hostname.includes('quora.com')){
            return 'quora'
        }
        else{
            return 'site'
        }
    }
    public getUrlKeys(){
        return {
            PK: `FEEDURL#${this.siteUrl}`,
            SK: `FEEDURL#${this.siteUrl}`
        }
    }

    get PK(): string {
        return `SCF#${this.subcategoryId}`;
    }
    get SK(): string {
        return  `FEED#${this.id}`
    }
    toItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            ...this.getGSI1Keys(),
            ...this.getGSI2Keys(),
            id: this.id,
            feedType: this.feedType,
            siteUrl: this.siteUrl,
            rssUrl: this.rssUrl,
            lastScanned: this.lastScanned,
            subCategoryId: this.subcategoryId,
            categoryId: this.categoryId,
            type: Feed.getSiteType(this.siteUrl)
        }

    }
    static FromItem(item?:Record<string,any>): Feed {
        if(!item) throw new Error('Item is null');
        console.log(JSON.stringify(item));
        return new Feed(item.siteUrl, item.subCategoryId, item.categoryId, item.rssUrl, item.lastScanned, item.id)
    }
       
}

export const createFeed = async (feed: Feed): Promise<Feed> => {
    if(!feed.rssUrl){
        feed.rssUrl = await siteReader.getRssLink(feed.siteUrl)
    }
    let infos = []
    infos.push(new TransactWriteInfo(feed.getUrlKeys(), TransactType.PUT,AvailableConditionExpressions.itemDoesNotExistCondition));
    infos.push(new TransactWriteInfo(feed.toItem(), TransactType.PUT,AvailableConditionExpressions.itemDoesNotExistCondition));
    await transactWrite(process.env.TABLE_NAME!, infos);
    return feed
}

export const getFeed = async (id: string, subcategoryId: string): Promise<Feed> => {
    try{
        console.log(`Getting Feed with id: ${id} for subcategory id ${subcategoryId}`);
        let response = await getItem(process.env.TABLE_NAME!, `SCF#${subcategoryId}`,`FEED#${id}`);
        console.log(`Response: ${JSON.stringify(response)}`);
        return Feed.FromItem(response.Item);
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const deleteFeed = async (feed:Feed): Promise<Feed> => {
    try{
        //TODO: Check for FeedItems before delete
        let infos = []
        infos.push(new TransactWriteInfo(feed.getUrlKeys(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
        infos.push(new TransactWriteInfo(feed.Keys(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
        let response = await transactWrite(process.env.TABLE_NAME!, infos);
        console.log(`Response: ${JSON.stringify(response)}`);
        return response.$metadata.httpStatusCode?.toString();
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const getAllFeeds = async (subcategoryId: string): Promise<Feed[]> => {
    try{
        console.log(`Getting all subcategories with parent id: ${subcategoryId}`);
        let response = await queryItems(process.env.TABLE_NAME!,undefined,"PK = :val",{':val': `SCF#${subcategoryId}`})
        console.log(`Response: ${JSON.stringify(response)}`);
        return response.Items?.map(Feed.FromItem) || [];
    }
    catch(err){
        console.log(err)
        throw err;
    }
}