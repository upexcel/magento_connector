
export class ProductReviewDataType {
    data: {
        data: [{
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
        total_attribute_rating: any;
        rating: string;
    }
    status: number;
    message: string;
}