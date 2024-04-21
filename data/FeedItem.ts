import {BaseItem} from './BaseItem'
import {getItem, queryItems, TransactWriteInfo, TransactType,AvailableConditionExpressions, transactWrite} from './Client';
import { ulid } from 'ulid';

export class FeedItem extends BaseItem{
id: string
title: string
link: string
description:string
image: string	
author: string	
date: string	
aiSummary: string
feedId: string

constructor(title: string, link: string, description:string, image: string, author: string, date: string, aiSummary: string, feedId: string, id:string = ulid()){
    super()
    this.id = id
    this.title = title
    this.link = link
    this.description = description
    this.image = image
    this.author = author
    this.date = date
    this.aiSummary = aiSummary
    this.feedId = feedId
}


    get PK(): string {
        throw new Error('Method not implemented.');
    }
    get SK(): string {
        throw new Error('Method not implemented.');
    }
    toItem(): Record<string, unknown> {
        throw new Error('Method not implemented.');
    }

    
}