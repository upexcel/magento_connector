export class CategoryProductDataType {
    data: [
        {
            data: {
                "name": string,
                "type": string,
                "sku": string,
                "weight": string,
                "price": string,
                "special_price": string,
                "tier_price": Array<string>,
                "short_description": string,
                "long_description": string,
                "media_images": string,
                "in_stock": string
            }
        }
    ];
    status: string;
    message: string;
}
