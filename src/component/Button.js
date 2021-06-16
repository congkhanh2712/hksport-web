import React, { Component } from 'react';
import './Button.css'
import { Link, Redirect } from 'react-router-dom';
import fbApp from '../Firebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogout: false,
            isGoToSignIn: true,
            open: false,
            vertical: 'top',
            horizontal: 'right',
        }
    }

    logOut = async () => {
        fbApp.auth().signOut().then(() => {
            this.setState({
                open: true,
            })
        })
        if (this.props.isLogin === true) {
            await localStorage.removeItem("user");
            await this.props.isLogout();
        } else {
        }
    }

    handleClose = () => {
        // setTimeout(() => {
        //     this.setState({
        //         open: false,
        //     })
        // }, 1000);
        this.setState({
            open: false,
        })
    }

    render() {
        var { isLogin } = this.props;
        var { open, vertical, horizontal } = this.state
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
                        <button className="btnh" onClick={this.logOut}>
                            Đăng xuất
                    </button>
                    </Link> : ""
                }

                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={this.handleClose}
                    key={vertical + horizontal}
                    autoHideDuration={3000}
                    style={{ color: "white" }}
                >
                    <Alert severity="success">
                        Đã đăng xuất
                    </Alert>
                </Snackbar>

            </div>

        )
    }
}
