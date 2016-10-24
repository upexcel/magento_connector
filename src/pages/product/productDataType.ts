export class productDataType {
    data: {
        data:
        {
            "entity_id": string;
            "qty": string;
            "name": string;
            "type": "string";
            "sku": "abc";
            "weight": string;
            "price": string;
            "display_price": string;
            "group_price": string;
            "special_price": string;
            "display_special_price": string;
            "tier_price": Array<any>;
            "short_description": string;
            "long_description": string;
            "media_images": Array<string>;
            "additional_information": {
                color:boolean;
                gender:string;
                size:boolean;
            };
            "in_stock": string;
            associated_products: {}
        }
    }
    status: number;
    message: string;
}

