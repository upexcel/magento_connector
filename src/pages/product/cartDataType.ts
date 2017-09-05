export class cartDataType {
    body: {
        Tota_Price?: string,
        Total_Discount?: string,
        Tax?: string,
        shipping_method?: {
            flatrate?: string,
            freeshipping?: string,
            fedex?: string,
            ups?: string,
            dhlint?: string
        }
    }
    status: number;
    message: string;
}