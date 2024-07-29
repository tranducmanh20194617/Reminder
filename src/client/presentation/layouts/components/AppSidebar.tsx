import React, {useState} from 'react'
import {CImage, CSidebar, CSidebarBrand, CSidebarNav} from '@coreui/react'
import {AppSidebarNav} from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import navigation from './_nav'
import {ThemeAction} from "../../../recoil/theme/ThemeAction";
import {Button} from "antd";
import { PlusCircleOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {RouteConfig} from "../../../config/RouteConfig";

const AppSidebar = () => {
    const navigate = useNavigate()
    const {
        vm,
        dispatchSetState
    } = ThemeAction()
    const onAddPageClick=()=>{
        navigate(RouteConfig.REMINDER_ADD_TASK_PAGE)
    }
    return (
        <CSidebar
            position="fixed"
            unfoldable={vm.sidebarUnfoldable}
            visible={vm.sidebarShow}
            onVisibleChange={(visible) => {
                dispatchSetState({
                    sidebarShow: visible
                })
            }}
        >
            <CSidebarBrand className="d-none d-md-flex"  style={{backgroundColor: "#DDDFE7"}}>
                <div style={{fontSize: '20px',color:'#E65F2B',fontWeight:'bold '}}
                >
                    <CImage rounded src="/logoIcon.png" width={32} height={32} />
                    Reminder
                </div>
            </CSidebarBrand>
            <CSidebarNav style={{backgroundColor: "#DDDFE7" }}>
                <SimpleBar style={{marginTop:"10px"}}>
                    <Button
                        onClick={onAddPageClick}
                        icon={<PlusCircleOutlined style={{ fontSize: '25px', backgroundColor:'white',borderRadius: '20px'}} />}
                        style={{
                            borderRadius:'24px',
                            marginLeft: '15px',
                            width: '211.14px', // fix typo
                            height: '63px',  // fix typo
                            backgroundColor: '#E65F2B',
                            marginRight: '10px',
                            display: 'flex', // add display: 'flex' to align items in the same row
                            alignItems: 'center', // vertically center the content
                        }}
                    >
                        Tạo nhiệm vụ mới
                    </Button>
                    <AppSidebarNav items={navigation} />
                </SimpleBar>
            </CSidebarNav>
        </CSidebar>

    )
}

export default React.memo(AppSidebar)
