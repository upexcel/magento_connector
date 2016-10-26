export class productDataType {
    data: {
        data: {
            "entity_id": string,
            "rating": boolean,
            "qty": string,
            "name": string,
            "type": string,
            "sku": string,
            "weight": string,
            "price": number,
            "display_price": number,
            "special_from_date": string,
            "special_to_date": string,
            "group_price": number,
            "special_price": number,
            "display_special_price": number,
            "tier_price": Array<number>,
            "short_description": string,
            "long_description": string,
            "media_images": Array<string>,
            "additional_information"?: {},
            "in_stock": string,
        };

        "associated_products"?: {
            "attributes"?: any,
            "template"?: any,
            "basePrice"?: number,
            "oldPrice"?: number,
            "productId"?: number,
            "chooseText"?: string,
            "taxConfig"?: {
                "includeTax"?: boolean,
                "showIncludeTax"?: boolean,
                "showBothPrices"?: boolean,
                "defaultTax"?: number,
                "currentTax"?: number,
                "inclTaxTitle"?: string,
            }
        },
        "bundle_items":any,
        "samples"?: string,
        "links"?: Array<any>
    }
    status: number;
    message: string;
}
