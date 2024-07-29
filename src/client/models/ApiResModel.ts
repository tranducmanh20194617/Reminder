import {Normalize} from "../core/Normalize";
import {Model} from "./Model";

export class ApiResModel extends Model{
    success: boolean;
    completeTask? :number[]
    labels?:string[]
    inCompleteTask?:number[]
    data?: any;
    error?: any;
    items?: any;
    item?:any;
    tasks?:any;
    meta?: PaginateMetaModel
    code: number;
    constructor(data: Record<string, any>) {
        super(data)
        this.success = data['success'];
        this.completeTask = Normalize.initJsonArray(data, 'completeTask')
        this.inCompleteTask = Normalize.initJsonArray(data, 'incompleteTask')
        this.labels = Normalize.initJsonArray(data, 'labels')
        this.data = Normalize.initJsonObject(data, 'data')
        this.tasks = Normalize.initJsonObject(data, 'tasks')
        this.error = Normalize.initJsonObject(data, 'error')
        this.items = Normalize.initJsonArray(data, 'items')
        this.item = Normalize.initJsonObject(data, 'item') // chưa biết sao lỗi
        this.meta = Normalize.initJsonObject(data, '_meta', (item: Record<string, any>) => new PaginateMetaModel(item))
        this.code = Normalize.initJsonNumber(data, 'code') ?? 1
    }
}

export class PaginateMetaModel {
    totalCount: number
    pageCount: number
    currentPage: number
    nextPage?: number
    perPage: number

    constructor(data: Record<string, any>) {
        this.totalCount = Normalize.initJsonNumber(data, 'total_count') ?? 0
        this.pageCount = Normalize.initJsonNumber(data, 'page_count') ?? 0
        this.currentPage = Normalize.initJsonNumber(data, 'current_page') ?? 0
        this.nextPage = Normalize.initJsonNumber(data, 'next_page')
        this.perPage = Normalize.initJsonNumber(data, 'per_page') ?? 0
    }

    fromObject = (object: any) => {
        Object.assign(this, object)
    }
}
