import axios from 'axios'
import * as cheerio from 'cheerio'
import { FeedItem } from './FeedItem';


export class siteReader{
    
    public static async getRssLink(url:string){
        console.log(`Getting rss link from ${url}`);
        if(this.getSiteType(url) == 'reddit'){
            return `${url}.rss`;
        }        
        const {data} = await axios.get(url)
        let c = cheerio.load(data)
        let rssLink = c('link[type="application/rss+xml"]').attr('href');
        console.log(`Rss Link: ${rssLink}`);
        if(!rssLink){
            rssLink = c('link[type="application/atom+xml"]').attr('href');
            console.log(`Atom Link: ${rssLink}`);
            if(!rssLink){
                throw new Error('rss link not found');
            }
        } 
        return rssLink;
    }
    
    static getSiteType(siteUrl:string){
        let uri = new URL(siteUrl)
        if (uri.hostname.includes('youtube.com')){
            return 'youtube'
        }
        else if (uri.hostname.includes('reddit.com')){
            return 'reddit'
        }
        else if (uri.hostname.includes('quora.com')){
            return 'quora'
        }
        else{
            return 'site'
        }
    }
    static processSiteFeed = async(rssUrl: string | undefined, feedId:string):Promise<FeedItem[]> => {
        if(!rssUrl){
            return []
        }
        const {data} = await axios.get(rssUrl);
        let c = cheerio.load(data)
        let items = c('entry');
        if(!items){
            items = c('item');        
        }
        console.log(items);
        if(!items || items.length === 0){
            return []
        }
        let feedItems:FeedItem[] = [];
        items.each((i, item) => {
            let title = c(item).find('title').text();
            let link = c(item).find('link').text();
            let description = c(item).find('description').text();
            let content = c(item).find('content').text();
            let author = c(item).find('author').text();
            let published = c(item).find('published').text();
            if(!published){
                published = c(item).find('pubDate').text();
            }
            feedItems.push(new FeedItem(feedId,title, link,description, content,author,published));
        })
        console.log(feedItems);
        return feedItems;


    }
}