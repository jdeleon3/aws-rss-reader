import axios from 'axios'
import * as cheerio from 'cheerio'

export class siteReader{
    public static async getRssLink(url:string){
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
}