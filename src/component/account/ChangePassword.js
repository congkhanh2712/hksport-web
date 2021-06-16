import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Redirect, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import instance from '../../AxiosConfig';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
});

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //localStorage
            currentPassword: "", //input mật khẩu hiện tại
            newPassword: "", //input mật khẩu muốn đổi
            renewPassword: "", //input xác nhận mật khẩu muốn đổi
            accountPage: false
        }
    }

    componentDidMount = async () => {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
    }

    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        var { currentPassword, newPassword, renewPassword } = this.state;
        if (currentPassword === "" || newPassword === "" || renewPassword === "") {
            toast.error("Chưa nhập đủ dữ liệu")
        } else if (newPassword != renewPassword) {
            toast.error("Mật khẩu nhập lại không trùng với mất khẩu mới")
        } else if (newPassword.length < 6) {
            toast.error("Mật khẩu muốn đổi chưa đủ 6 kí tự")
        } else {
            instance.put('/auth/info/change-password', {
                currentPass: currentPassword,
                newPass: newPassword,
            }).then(res => {
                if (res.data.succeed == true) {
                    toast.success(res.data.message)
                } else {
                    this.setState({
                        currentPassword: "",
                        newPassword: "",
                        renewPassword: "",
                    })
                    toast.error(res.data.message)
                }
            })
        }
    }

    render() {
        const { classes } = this.props;
        var { accountPage } = this.state;
        if (accountPage === true) {
            return <Redirect to="/account" />
        }
        return (
            <Container component="main" maxWidth="xs" style={{ height: 450 }} >
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Đổi mật khẩu
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        <TextField
                            id="1"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="currentPassword"
                            value={this.state.currentPassword}
                            label="Mật khẩu hiện tại"
                            type="password"
                            onChange={this.onChange}
                        />
                        <TextField
                            id="2"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="Mật khẩu mới"
                            type="password"
                            value={this.state.newPassword}
                            onChange={this.onChange}
                        />
                        <TextField
                            id="3"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="renewPassword"
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={this.state.renewPassword}
                            onChange={this.onChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            <Typography component="h1" variant="button">
                                Xác nhận
                            </Typography>
                        </Button>
                    </form>
                </div>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        className: '',
                        style: {
                            margin: '40px',
                            background: '#00e676',
                            color: 'white',
                            zIndex: 1,
                        },
                        duration: 5000,
                        success: {
                            duration: 3000,
                            style: {
                                margin: '100px',
                                background: '#00e676',
                                color: 'white',
                                zIndex: 1,
                            },
                        },
                        error: {
                            duration: 3000,
                            style: {
                                margin: '100px',
                                background: 'red',
                                color: 'white',
                                zIndex: 1,
                            },
                        },
                    }} />
            </Container>
        )
    }
}

ChangePassword.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ChangePassword);