import {CSpinner} from "@coreui/react";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {notification} from "antd";

export const SuspenseLoadingWidget= () => {
    return (
        <div className={'w-screen h-screen flex justify-center items-center'}>
            <CSpinner color="primary"/>
        </div>
    )
}