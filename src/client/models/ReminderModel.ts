import {Model} from "./Model";
import {Normalize} from "../core/Normalize";

export class TaskModel extends Model {
    id?: string
    userId?: string
    groupId?: string
    name?: string
    description?: string
    tag?: string
    priority?: number
    address?: string
    createAt?: string
    updateAt?: string
    startedAt?: string
    expiredAt?: string
    updatedAt?: string
    miniTask?: MiniTask[]

    constructor(data: Record<string, any>) {
        super(data)
        this.id = Normalize.initJsonString(data, 'id')
        this.userId = Normalize.initJsonString(data, 'user_id')
        this.groupId = Normalize.initJsonString(data, 'group_id')
        this.name = Normalize.initJsonString(data, 'name')
        this.description = Normalize.initJsonString(data, 'description')
        this.tag = Normalize.initJsonString(data, 'tag')
        this.priority = Normalize.initJsonNumber(data, 'priority')
        this.createAt = Normalize.initJsonString(data, 'created_at')
        this.startedAt = Normalize.initJsonString(data, 'started_at')
        this.expiredAt = Normalize.initJsonString(data, 'expired_at')
        this.updatedAt = Normalize.initJsonString(data, 'updated_at')
        this.miniTask = Normalize.initJsonArray(data, 'mini_tasks') || [];
    }
    copyFrom = (data: Record<string, any>):TaskModel => {
        if (this.raw) {
            return new TaskModel({...this.raw, ...data})
        } else {
            return new TaskModel(data)
        }
    }
}

export class MiniTask extends Model {
    id?: string
    taskId?: string
    name?: string
    status?: number
    createAt?: string
    updateAt?: string
    expiredAt?: string
    constructor(data: Record<string, any>) {
        super(data)
        this.expiredAt = Normalize.initJsonString(data, 'expired_at')
        this.status = Normalize.initJsonNumber(data, 'status')
        this.id = Normalize.initJsonString(data, 'id')
        this.name = Normalize.initJsonString(data, 'name')
        this.createAt = Normalize.initJsonString(data, 'created_at')
        this.taskId = Normalize.initJsonString(data, 'task_id')
    }
}
export class StatisticalModel extends Model{
    completeTask? :number[]
    labels?:string[]
    inCompleteTask?:number[]
    constructor(data: Record<string, any>) {
        super(data)
        this.completeTask = Normalize.initJsonArray(data, 'completeTask')
        this.inCompleteTask = Normalize.initJsonArray(data, 'incompleteTask')
        this.labels = Normalize.initJsonArray(data, 'labels')
    }
}