import {DynamoDB} from 'aws-sdk';
import {BaseItem} from './BaseItem'
import {putItem} from './Client';
import {getValue} from './Utils'
export class Category extends BaseItem{
    
    title: string
    description: string

    constructor(title: string, description: string){
        super()
        this.title = title
        this.description = description
    }

    static FromItem(item:DynamoDB.AttributeMap): Category {
        if(!item) throw new Error('Item is null');
        return new Category(getValue(item.title.S), getValue(item.description.S));
    }

    static getValue(itemValue: string|undefined): string{
        if(!itemValue) return "";
        return itemValue;
    }

    get PK(): string {
        return 'CATEGORY#' + this.title;
    }
    get SK(): string {
        return 'CATEGORY#' + this.title;
    }
    ToItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            title: {S: this.title},
            description: {S: this.description}
        }
    }
}

export class Subcategory extends Category{
    ParentCategory: string
    constructor(title: string, description: string, parentCategory: string){
        super(title, description)
        this.ParentCategory = parentCategory
    }   
    override get PK(): string {
        return `SC#${this.ParentCategory}`
    }
    override get SK(): string {        
        return `SUBCATEGORY#${this.title}`
    }
}

export const createCategory = async (category: Category): Promise<Category> => {
    try{
        await putItem(process.env.TABLE_NAME!, category.ToItem());
        return category;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}
