import {DynamoDB} from 'aws-sdk';
import {BaseItem} from './BaseItem'
import {putItem, getItem} from './Client';
import {getValue} from './Utils';
import { ulid } from 'ulid';

export class Category extends BaseItem{
    
    id: string
    title: string
    description: string

    constructor(title: string, description: string,id: string = ulid()){
        super()
        this.id = id
        this.title = title
        this.description = description
    }

    static FromItem(item?:DynamoDB.AttributeMap): Category {
        if(!item) throw new Error('Item is null');
        return new Category(getValue(item.title.S), getValue(item.description.S),getValue(item.id.S));
    }

    static getValue(itemValue: string|undefined): string{
        if(!itemValue) return "";
        return itemValue;
    }

    get PK(): string {
        return `CATEGORY#${this.id}`;
    }
    get SK(): string {
        return `CATEGORY#${this.id}`;
    }
    toItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            title: this.title,
            description: this.description,
            id: this.id
        }
    }
}

export class Subcategory extends Category{
    ParentCategoryId: string
    constructor(title: string, description: string, parentCategoryId: string){
        super(title, description)
        this.ParentCategoryId = parentCategoryId
    }   
    override get PK(): string {
        return `SC#${this.ParentCategoryId}`
    }
    override get SK(): string {        
        return `SUBCATEGORY#${this.id}`
    }
}

export const createCategory = async (category: Category): Promise<Category> => {
    try{
        await putItem(process.env.TABLE_NAME!, category.toItem());
        return category;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const getCategory = async(id: string): Promise<Category> =>{
    try{
        let response = await getItem(process.env.TABLE_NAME!, `CATEGORY#${id}`, `CATEGORY#${id}`);
        return Category.FromItem(response);
    }
    catch(err){
        console.log(err)
        throw err;
    }
}
