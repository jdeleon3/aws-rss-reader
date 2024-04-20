
import {BaseItem} from './BaseItem'
import {getItem, transactWrite, TransactWriteInfo,TransactType,AvailableConditionExpressions} from './Client';
import {getValue} from './Utils';
import { ulid } from 'ulid';
import {Category} from './Category';


export class Subcategory extends Category{
    ParentCategoryId: string
    constructor(title: string, description: string, parentCategoryId: string, id:string = ulid()){
        super(title, description)
        this.ParentCategoryId = parentCategoryId
    }   
    override get PK(): string {
        return Subcategory.formatIdToPK(this.ParentCategoryId);
    }
    override get SK(): string {        
        return Subcategory.formatIdToSK(this.id);
    }
    public override TitleKeys(){
        return {
            PK: `SUBCATEGORYTITLE#${this.title}`,
            SK: `SUBCATEGORYTITLE#${this.title}`
        }
    }

    static formatIdToPK(parentId:string){
        return `SC#${parentId}`;
    }
    static formatIdToSK(id:string){
        return `SUBCATEGORY#${id}`;
    }
    

    toItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            title: this.title,
            description: this.description,
            id: this.id,
            parentCategoryId: this.ParentCategoryId
        }
    }
}

export const getSubcategory = async(id: string, parentId: string): Promise<Subcategory> =>{
    try{
        console.log(`Getting category with id: ${id}`);
        let response = await getItem(process.env.TABLE_NAME!, Subcategory.formatIdToPK(parentId), Subcategory.formatIdToSK(id));
        console.log(`Response: ${JSON.stringify(response)}`);
        return Subcategory.FromItem(response.Item) as Subcategory;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}