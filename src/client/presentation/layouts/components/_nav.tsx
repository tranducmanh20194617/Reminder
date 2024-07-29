import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilApplications, cilCalendar, cilBarChart} from '@coreui/icons'
import {CNavItem,  } from '@coreui/react'
import {RouteConfig} from "../../../config/RouteConfig";

type _T_NavChild = {
    component: any
    name: any
    to?: string
    badge?: {
        color: string
        text: string
    }
    href?: string
    items?: _T_NavChild[]
}

export type T_Nav = _T_NavChild & {
    icon?: any
}

const _nav: T_Nav[] = [
    {
        component: CNavItem,
        name:<span style={{color:'black'}}>Tổng quan</span>,
        to: RouteConfig.REMINDER_DASHBOARD,
        icon: <CIcon icon={cilApplications} customClassName="nav-icon"
        style={{color:'#E6612F'}}
        />,

    },
    {
        component: CNavItem,
        name: <span style={{color:'black'}}>Thống kê</span>,
        icon: <CIcon icon={cilBarChart} customClassName="nav-icon"
                     style={{color:'#E6612F'}}
        />,
        to: RouteConfig.REMINDER_STATISTICAL_PAGE
    },
    {
        component: CNavItem,
        name: <span style={{color:'black'}}>Công việc</span>,
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon"
                     style={{color:'#E6612F'}}
        />,
        to: RouteConfig.WORK_PAGE
    },

]

export default _nav
