import React, { Component } from 'react';
import './Button.css'
import { Link, Redirect } from 'react-router-dom';
import LogoutDialog from './account/Cart/Dialog/LogoutDialog';


export default class Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogout: false,
            isGoToSignIn: true,
            logoutDialog: false,
        }
    }


    render() {
        var { isLogin } = this.props;
        const { logoutDialog } = this.state;
        return (
            <div>
                {!isLogin ?
                    <Link to="/sign-in">
                        <button className="btnh">
                            Đăng nhập
                        </button>
                    </Link> : ""
                }
                {isLogin ?
                    <Link to="/">
                        <button className="btnh" onClick={() => {
                            this.setState({
                                logoutDialog: true
                            })
                        }}>
                            Đăng xuất
                        </button>
                    </Link> : ""
                }
                {logoutDialog
                    ? <LogoutDialog
                        close={() => {
                            this.setState({
                                logoutDialog: false
                            })
                        }}
                        logOut={() => {
                            this.props.isLogout(1);
                        }} />
                    : null
                }
            </div>

        )
    }
}
