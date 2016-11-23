export class CategoryListDataType {
    data: {
        id: string,
        name: string,
        thumbnail: string,
        is_anchor: string,
        display_mode: string,
        children: Array<any>
    }
    status: number;
    message: string;
}