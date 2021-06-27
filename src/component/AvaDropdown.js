import { Component } from "react";
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import './Dropdown.css';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LogoutDialog from "./account/Cart/Dialog/LogoutDialog";



export default class AvaDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            anchorEl: null,
            logoutDialog: false,
            logoutType: 0,
        }
    }
    handleClick = () => {
        this.setState({
            click: !this.state.click
        })
    }
    onMenuItemClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            click: false
        })
    };

    onMenuItemClose = () => {
        this.setState({
            anchorEl: null
        })
    };
    render() {
        const { anchorEl, logoutDialog, logoutType } = this.state;
        return (
            <ul
                onClick={this.handleClick}
                className={"dropdown-menuh"}
            >
                <li key={'manage-order'}>
                    <Link
                        to={'/account/manage-order/0'}
                        style={{ textDecoration: 'none' }}
                        onclick={() => {
                            this.setState({
                                click: false
                            })
                        }}>
                        <Button fullWidth>
                            <div style={{
                                fontFamily: `Arial, Helvetica, sans-serif`,
                                color: 'black',
                            }}>
                                Quản lý đơn hàng
                            </div>
                        </Button>
                    </Link>
                </li>
                <Divider />
                <li key={'change-password'}>
                    <Link
                        to={'/account/change-password'}
                        style={{ textDecoration: 'none' }}
                        onclick={() => {
                            this.setState({
                                click: false
                            })
                        }}>
                        <Button fullWidth>
                            <div style={{
                                fontFamily: `Arial, Helvetica, sans-serif`,
                                color: 'black',
                            }}>
                                Đổi mật khẩu
                            </div>
                        </Button>
                    </Link>
                </li>
                <Divider />
                <li key={'log-out'}>
                    <Button fullWidth
                        onClick={this.onMenuItemClick}>
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: 'black'
                        }}>
                            Đăng xuất
                        </div>
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        onClose={this.onMenuItemClose}
                        open={Boolean(anchorEl)}
                    >
                        <MenuItem
                            onClick={() => {
                                this.setState({
                                    logoutDialog: true,
                                    type: 0,
                                })
                            }}>
                            Đăng xuất khỏi trình duyệt
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.setState({
                                    logoutDialog: true,
                                    type: 1,
                                })
                            }}>
                            Đăng xuất trên mọi thiết bị
                        </MenuItem>
                    </Menu>
                </li>
                {logoutDialog
                    ? <LogoutDialog
                        close={() => {
                            this.setState({
                                logoutDialog: false
                            })
                        }}
                        logOut={() => {
                            this.props.isLogout(logoutType);
                        }} />
                    : null
                }
            </ul>
        )
    }
}