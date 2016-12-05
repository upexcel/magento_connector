export class CategoryProductDataType {
    body: [{
        data: {
            "entity_id": string,
            "rating": boolean,
            "qty": string,
            "name": string,
            "type": string,
            "sku": string,
            "weight": string,
            "price": string,
            "display_price": string,
            "special_from_date": string,
            "special_to_date": string,
            "group_price": string,
            "special_price": string,
            "display_special_price": string,
            "tier_price": Array<string>,
            "short_description": string,
            "long_description": string,
            "media_images": Array<string>,
            "additional_information" ?: {
                "color": string,
                "occasion": string,
                "apparel_type": string,
                "sleeve_length": string,
                "fit": boolean,
                "size": string,
                "length": boolean,
                "gender": string
            },
            "in_stock": string
        }
    }]
    status: number;
    message: string;
}
