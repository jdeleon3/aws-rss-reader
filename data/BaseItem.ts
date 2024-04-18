import {DynamoDB} from 'aws-sdk'

export abstract class BaseItem {
    abstract get PK(): string
    abstract get SK(): string

    public Keys(){
        return {
            PK: {S: this.PK},
            SK: {S: this.SK}
        }
    }

    abstract ToItem(): Record<string,unknown>;
}
