export class HomeProductsDataType {
    data: [
        {
            data: {
                entity_id: string,
                rating: number,
                total_review: number,
                qty: number,
                name: string,
                type: string,
                sku: string,
                weight: number,
                price: number,
                display_price: number,
                special_from_date: string,
                special_to_date: string,
                group_price: string,
                special_price: number,
                display_special_price: number,
                tier_price: Array<number>,
                short_description: string,
                long_description: string,
                media_images: Array<string>,
                additional_information: Array<string>,
                in_stock: string,
                show_on_home_page: string
            };
            bundle_items: {
                options: Array<string>
            }
        }
    ];
    status: number;
    message: string;
}
