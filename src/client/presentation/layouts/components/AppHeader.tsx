import React, {ReactNode, useEffect} from 'react'
import {CContainer, CHeader, CHeaderBrand, CHeaderDivider, CHeaderNav, CHeaderToggler, CNavItem, CNavLink} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilBell, cilEnvelopeOpen, cilMenu} from '@coreui/icons'
import {logoHeader} from '../../../assets/brand/brand'
import {ThemeAction} from "../../../recoil/theme/ThemeAction";
import AppBreadcrumb from "./AppBreadcrumb";
import AppHeaderDropdown from "./AppHeaderDropdown";
import {ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {TaskListAction} from "../../../recoil/Reminder/ReminderTasklList/TaskListAction";

type _T_Props = {
    tool?: ReactNode
    onReload?: Function
}

const AppHeader = (props: _T_Props) => {
    const navigate = useNavigate()

    const {
        vm,
        dispatchSetState
    } = ThemeAction()
    const {
        dispatchLoadTask,

    } = TaskListAction()
    useEffect(() => {
        dispatchLoadTask()
    }, []);
    return (
        <CHeader position="sticky"  style={{backgroundColor:'#DDDFE7',maxHeight:'40px', height:'40px'}}>
            <CContainer fluid >
                <CHeaderToggler
                    className="ps-1"
                    onClick={() => dispatchSetState({sidebarShow: !vm.sidebarShow})}
                >
                    <CIcon icon={cilMenu} size="lg"/>
                </CHeaderToggler>
                {/*@ts-ignore*/}
                <CHeaderBrand className="mx-auto d-md-none" to="/">
                    <CIcon icon={logoHeader} height={28}/>
                </CHeaderBrand>
                <CHeaderNav className="d-none d-md-flex me-auto">
                    <CNavItem>

                    </CNavItem>
                    <CNavItem>

                    </CNavItem>
                    <CNavItem>

                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav>
                    <CNavItem>
                            {/*<CIcon icon={cilBell} size="lg"/>*/}
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav className="ml-3">
                    <AppHeaderDropdown/>
                </CHeaderNav>
            </CContainer>
            <CHeaderDivider/>
        </CHeader>
    )
}

export default AppHeader
