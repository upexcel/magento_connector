
export class ProductReviewDataType {
    body: {
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
            rating_percentage_by_attribute: any
        }]
        rating_by_star: any;
        total_attribute_rating: any;
        rating: string;
        total_review: number;
    }
    status: number;
    message: string;
}