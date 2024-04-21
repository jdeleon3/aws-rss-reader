import axios from 'axios'
import * as cheerio from 'cheerio'


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
    
    public static getSiteType(siteUrl:string){
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
}