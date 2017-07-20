export class OrderIdDetailDataType {
    "data": {
        "secret": string,
        "order_id": number,
        "purchased_on": string,
        "base_grand_total": number,
        "discount_amount": number,
        "shipping_amount": number,
        "tax_amount": number,
        "grand_total": number,
        "status": string,
        "state": string,
        "order_currency_code": string,
        "total_qty_ordered": number,
        "shipping_method": string,
        "shipping_description": string,
        "payment_method": string,
        "customer_email": string,
        "customer_name": string,
        "billing_address": {
            "name": string,
            "lastname": string,
            "street": Array<string>,
            "city": string,
            "county": string,
            "region": string,
            "postcode": number,
            "telephone": number
        },
        "shipping_address": {
            "name": string,
            "lastname": string,
            "street": Array<string>,
            "city": string,
            "county": string,
            "region": string,
            "postcode": string,
            "telephone": number
        },
        "email_sent": boolean,
        "items": {
            "item_name": string,
            "item_sku": string,
            "qty_ordered": number,
            "price": number,
            "image": string
        }
    };
    "status": number;
    "message": string;
}
