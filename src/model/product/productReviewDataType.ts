
export class ProductReviewDataType {
    data: {
        reviews: [{
                review_id: string
                created_at: string
                entity_id: string
                entity_pk_value: string
                status_id: string
                detail_id: string
                title: string
                detail: string
                nickname: string
                customer_id: string
        }]
        rating_by_attribute: {
            Quality: number
            Price: number
            Value: number
        }
        rating: any
    }
    status: number;
    message: string;
}