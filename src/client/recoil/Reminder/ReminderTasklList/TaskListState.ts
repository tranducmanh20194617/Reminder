import {PaginateMetaModel} from "../../../models/ApiResModel";
import {E_SendingStatus} from "../../../const/Events";
import {atom} from "recoil";
import {KeyStatistical, KeyTaskList} from "../../KeyRecoil";
import {StatisticalModel, TaskModel} from "../../../models/ReminderModel";
import {UserModel} from "../../../models/UserModel";
import ReminderStatisticalPage from "../../../presentation/screens/Reminder/ReminderStatisticalPage";
export type T_FormState = {
    isLoading: E_SendingStatus,
    error?: Record<string, any>
}
export type T_TaskListState = {
    isLoading: E_SendingStatus,
    items: TaskModel[],
    error?: Record<string, any>,
}
export type T_StatisticalState = {
    inComplateTask?:any
    completeTask?:any
    labels?:any
    isLoading: E_SendingStatus,
    error?: Record<string, any>
}
export const initialState:T_TaskListState = {
    isLoading: E_SendingStatus.idle,
    items: [],

}
export const initialStatisticalState:T_StatisticalState= {
    isLoading: E_SendingStatus.idle,

}
export const TaskListState  = atom<T_TaskListState>({
    key:KeyTaskList,
    default:initialState
})
export const TaskStatisticalState  = atom<T_StatisticalState>({
    key:KeyStatistical,
    default:initialStatisticalState
})
export const initialFormState: T_FormState = {
    isLoading: E_SendingStatus.idle
}