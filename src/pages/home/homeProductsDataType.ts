export class HomeProductsDataType {
    data: [{
        data: {
            entity_id: string,
            rating: boolean,
            qty: string,
            name: string,
            type: string,
            sku: string,
            weight ?: string,
            price: string,
            display_price: string,
            special_from_date ?: any,
            special_to_date ?: any,
            group_price ?: number,
            special_price ?: string,
            display_special_price ?: string,
            tier_price ?: Array<string>,
            media_images ?: Array<string>,
            additional_information ?: Array<string>,
            in_stock: string,
            show_on_home_page ?: string
        }
        bundle_items?: {
            options: Array<any>
        }
    }]
    status: number;
    message: string;
}