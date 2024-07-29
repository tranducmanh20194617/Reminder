import React, {lazy} from "react";

type _T_Rcc = {
    path: string
    name?: string
    component?: React.FC<any>
    protect?: boolean
    replace?: boolean
    children?: _T_Rcc[]
}

export type T_Rco = _T_Rcc & {
    routes?: _T_Rcc[]
}
const ReminderStatisticalPage = lazy(() => import("../presentation/screens/Reminder/ReminderStatisticalPage"))
const WorkPage = lazy(() => import("../presentation/screens/Reminder/ReminderWorkPage"))
const ReminderDashboard = lazy(() => import("../presentation/screens/Reminder/ReminderDashBoard"))
const AddTaskPage = lazy(() => import("../presentation/screens/Reminder/ReminderAddTaskPage"))
const TaskDetail = lazy(() => import("../presentation/screens/Reminder/ReminderTaskDetail"))
const DashboardScreen = lazy(() => import("../presentation/screens/dashboard/DashboardScreen"))
export class RouteConfig {
    static readonly NOT_FOUND: string = "*"
    static readonly LOGIN: string = "/login"
    static readonly DASHBOARD: string = "/dashboard"
    static readonly WORK_PAGE:string ="/workPage"
    static readonly REMINDER_DASHBOARD :string ="/reminderDashboard"
    static readonly REMINDER_ADD_TASK_PAGE :string = "/addTask"
    static readonly REMINDER_TASK_DETAIL_PAGE:string = "/taskDetail/:id"
    static readonly REMINDER_STATISTICAL_PAGE:string= "/statistical"
    static masterRoutes: T_Rco[] = [
        {
            name: 'dashboard',
            path: RouteConfig.DASHBOARD,
            component: DashboardScreen,
            protect: true
        },
        {
            name: 'workPage',
            path: RouteConfig.WORK_PAGE,
            component: WorkPage,
            protect: true
        },
        {
            name: 'reminderDashboard',
            path: RouteConfig.REMINDER_DASHBOARD,
            component: ReminderDashboard,
            protect: true
        },
        {
            name: 'reminderAddTaskPage',
            path: RouteConfig.REMINDER_ADD_TASK_PAGE,
            component: AddTaskPage,
            protect: true
        },
        {
            name: 'reminderTaskDetailPage',
            path: RouteConfig.REMINDER_TASK_DETAIL_PAGE,
            component: TaskDetail,
            protect: true
        }, {
            name: 'Statistical',
            path: RouteConfig.REMINDER_STATISTICAL_PAGE,
            component: ReminderStatisticalPage,
            protect: true
        },
]
}
