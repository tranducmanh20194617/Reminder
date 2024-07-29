import {initialFormState, T_FormState, TaskListState, TaskStatisticalState} from "./TaskListState";
import {ApiService} from "../../../repositories/ApiService";
import {useInjection} from "inversify-react";
import {useRecoilState, useRecoilValue} from "recoil";
import {E_SendingStatus} from "../../../const/Events";
import {TaskModel} from "../../../models/ReminderModel";
import {setErrorHandled} from "../../CmAction";
import {useState} from "react";

export const TaskListAction = () => {
    const apiService = useInjection(ApiService)
    const [state, setState] = useRecoilState(TaskListState)
    const [stateStatistical, setStateStatistical] = useRecoilState(TaskStatisticalState)
    const vmStatistical = useRecoilValue(TaskStatisticalState)
    const vm = useRecoilValue(TaskListState)
    const [formState, setFormState] = useState<T_FormState>(initialFormState)
    const [formStateDetail, setFormStateDetail] = useState<T_FormState>(initialFormState)

    const dispatchLoadTask = () => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        apiService.getListTask().then(
            r => {
                if (r.success) {
                    console.log(r)
                    setState({
                        ...state,
                        items: r.items.map((item: Record<string, any>) => new TaskModel(item)),
                        isLoading:E_SendingStatus.success
                    })
                } else {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            }
        ).catch(err => setErrorHandled(state, setState, 'error', err))
    }
    const dispatchCreateTask = (data: any) => {
        setFormState({
            ...formState,
            isLoading: E_SendingStatus.loading
        })
        apiService.postAddTask(data).then(
            r => {
                if (r.success) {
                    console.log(r)
                    setFormState({
                        ...formState,
                        isLoading: E_SendingStatus.success
                    })
                } else {
                    setFormState({
                        ...formState,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            })
            .catch(e => {
                    console.log(e)
                }
            )
    }
    const dispatchEditTask = (id: string | undefined, data: any) => {
        setFormState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        apiService.postEditTask(id, data).then(
            r => {
                if (r.success) {
                    console.log(r)
                    dispatchLoadTask()
                    setFormStateDetail({
                        ...formState,
                        isLoading: E_SendingStatus.success
                    })
                } else {
                    setFormStateDetail({
                        ...formState,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            })
            .catch(e => {
                    console.log(e)
                }
            )
    }
    const dispatchAddMiniTask = (data: any) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        });
        apiService.AddMiniTask(data)
            .then((r) => {
                if (r.success) {
                    console.log(r.data);
                    setState({
                        ...state,
                        items: state.items.map((item: TaskModel) => {
                            if (item.id === data.task_id) {
                                // Ensure miniTask is initialized as an array if it's undefined
                                const updatedMiniTask = item.miniTask ? [...item.miniTask, r.data] : [r.data];
                                console.log(updatedMiniTask)
                                // Update miniTask property without modifying the original item
                                return {
                                    ...item,
                                    miniTask: updatedMiniTask,
                                };
                            }
                            return item;
                        }),
                    });
                    dispatchLoadTask()

                } else {
                    setFormState({
                        ...formState,
                        isLoading: E_SendingStatus.error,
                        error: r.error,
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const dispatchLoadStatistical = () => {
        setStateStatistical(
            {
                ...stateStatistical,
                isLoading: E_SendingStatus.loading
            }
        )
        apiService.getStatistical().then(
            r => {
                if (r.success) {
                    console.log(r)
                    setStateStatistical({
                        ...stateStatistical,
                        isLoading: E_SendingStatus.success,
                        inComplateTask:r.inCompleteTask,
                        completeTask:r.completeTask,
                        labels:r.labels
                    })
                } else {
                    setStateStatistical({
                        ...stateStatistical,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            }
        )
    }
    return {
        vm,
        vmStatistical,
        vmForm: formState,
        vmFormDetail: formStateDetail,
        dispatchLoadTask,
        dispatchEditTask,
        dispatchAddMiniTask,
        dispatchCreateTask,
        dispatchLoadStatistical,
    }
}