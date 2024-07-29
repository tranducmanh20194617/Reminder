import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CBadge } from '@coreui/react';
import { T_Nav } from './_nav';
import {RouteConfig} from "../../../config/RouteConfig";

type _T_Props = {
    items: T_Nav[];

};export const AppSidebarNav = ({ items }: _T_Props) => {
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState<string | null>(location.pathname);
    const getBackgroundColor = (to?: string): string => {
      if(location.pathname.includes('/taskDetail')||location.pathname===RouteConfig.REMINDER_TASK_DETAIL_PAGE||location.pathname===RouteConfig.REMINDER_ADD_TASK_PAGE) {
          return '#DDDFE7'
      }
        else {
            if(selectedItem === to)
                return 'white'
          else
              return '#DDDFE7'
      }
    };
    const navLink = (name?: string, icon?: string, badge?: T_Nav['badge']) => {
        return (
            <>
                {!!icon && icon}
                {!!name && name}
                {!!badge && (
                    <CBadge color={'black'} className="ms-auto">
                        {badge.text}
                    </CBadge>
                )}
            </>
        );
    };

    const navItem = (item: T_Nav, index: number) => {
        const { component, name, badge, icon, to, ...rest } = item;
        const Component = component;
        const backgroundColor = getBackgroundColor(to);

        return (
            <Component
                {...(to &&
                    !rest.items && {
                        component: NavLink,
                        onClick: () => setSelectedItem(to),
                        to,
                    })}
                key={index}
                {...rest}
                style={{
                    backgroundColor,
                    margin: '10px 0',
                }}
            >
                {navLink(name, icon, badge)}
            </Component>
        );
    };
    const navGroup = (item: T_Nav, index: number) => {
        const { component, name, icon, to, ...rest } = item;
        const Component = component;

        return (
            <Component
                idx={String(index)}
                key={index}
                toggler={navLink(name, icon)}
                visible={location.pathname.startsWith(to!)}
                {...rest}
                style={{
                    backgroundColor: selectedItem === name ? 'white' : 'transparent',
                    margin: '10px 0', // Adjust the margin as needed
                }}
                className={`nav-group ${selectedItem === name ? 'selected' : ''}`}
            >
                {item.items?.map((item, index) =>
                    item.items ? (
                        navGroup(item, index)
                    ) : (
                        <div
                            key={index}
                            style={{
                                backgroundColor: selectedItem === item.name ? 'white' : 'transparent',
                                margin: '15px 0', // Adjust the margin as needed
                            }}
                            className={`nav-item ${selectedItem === item.name ? 'selected' : ''}`}
                        >
                            {navItem(item, index)}
                        </div>
                    )
                )}
            </Component>
        );
    };

    return (
        <>
            {items &&
                items.map((item, index) =>
                    item.items ? (
                        navGroup(item, index)
                    ) : (
                        <div
                            key={index}
                            style={{
                                backgroundColor: selectedItem === item.name ? 'white' : 'transparent',
                                margin: '15px 0', // Adjust the margin as needed
                            }}
                            className={`nav-item ${selectedItem === item.name ? 'selected' : ''}`}
                        >
                            {navItem(item, index)}
                        </div>
                    )
                )}
        </>
    );
};

AppSidebarNav.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
};