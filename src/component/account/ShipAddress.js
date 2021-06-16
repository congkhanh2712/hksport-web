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
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Redirect, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import vn from './vn.json';
import instance from '../../AxiosConfig';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
        marginTop: theme.spacing(5),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },

    formControl: {
        margin: theme.spacing(0),
        minWidth: "100%",
        marginTop: theme.spacing(2),
    },
});

class ShipAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            district: "",
            ward: "",
            address: "",
            location: "",
        }
    }

    componentDidMount = async () => {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        this.getData();
    }
    getData = () => {
        instance.get('/auth/')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        city: res.data.Address.City,
                        district: res.data.Address.District,
                        ward: res.data.Address.Ward,
                        address: res.data.Address.Detail,
                    })
                }
            })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        })
        if (name === "city") {
            this.setState({
                district: "",
                ward: "",
            })
        }
        if (name === "district") {
            this.setState({
                ward: "",
            })
        }
        //console.log(this.state)
    }

    onSubmit = (lc) => (event) => {
        event.preventDefault();
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        const { ward, district, city, address } = this.state;
        if (address.trim() != '' && ward != "") {
            instance.put('/auth/info/update-address', {
                address,
                ward,
                city,
                district,
                location: lc
            }).then(res => {
                if (res.data.succeed == true) {
                    toast.success("Cập nhật thành công");
                }
            })
        } else {
            this.getData();
            toast.error("Vui lòng nhập đầy đủ thông tin");
        }
    }

    render() {
        var { city, district, ward, address, location } = this.state
        const { classes } = this.props;

        var ct = vn.filter(x => {
            return x.name === city;
        });
        //Truyền các huyện vô mảng huyen[]
        var huyen = []
        ct.map((x, index) => {
            x.huyen.forEach(function (item) {
                huyen.push(item)
            });
        });
        //Truyền các huyện vô mảng xa[]
        var xa = [];
        var lc = [];
        vn.forEach((tinh) => {
            if (tinh.name === city) {
                tinh.huyen.forEach((huyen) => {
                    if (huyen.name === district) {
                        huyen.xa.forEach((x) => {
                            xa.push(x.name);
                            lc.push(x.location);
                        })
                    }
                })
            }
        });
        //Tìm location của xã:
        if (ward !== "") {
            xa.forEach((x, index) => {
                if (x === ward) {
                    location = lc[index];
                }
            })
            //console.log(location)
        }


        return (
            <Container component="main" maxWidth="xs" style={{ height: 490 }}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Đổi địa chỉ nhận hàng
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit(location)}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="address"
                            label="Địa chỉ"
                            value={address}
                            onChange={this.onChange}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel >Phường/Xã</InputLabel>
                            <NativeSelect
                                value={ward}
                                defaultValue={ward}
                                inputProps={{
                                    name: 'ward',
                                }}
                                onChange={this.onChange}
                            >
                                <option aria-label="None" value="" />
                                {xa.map((x, index) => {
                                    return <option key={index} value={x} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>{x}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel >Quận/Huyện</InputLabel>
                            <NativeSelect
                                value={district}
                                defaultValue={district}
                                inputProps={{
                                    name: 'district',
                                }}
                                onChange={this.onChange}
                            >
                                <option aria-label="None" value="" />
                                {huyen.map((item, index) => {
                                    return <option key={index} value={item.name} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>{item.name}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel >Tỉnh/Thành phố</InputLabel>
                            <NativeSelect
                                value={city}
                                defaultValue={city}
                                inputProps={{
                                    name: 'city',
                                }}
                                onChange={this.onChange}
                            >
                                <option aria-label="None" value="" />
                                {vn.map((x, index) => {
                                    return <option key={index} value={x.name} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>{x.name}</option>
                                })}
                            </NativeSelect>
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Xác nhận
                        </Button>
                    </form>
                </div>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        //Define default options
                        className: '',
                        style: {
                            margin: '40px',
                            background: '#00e676',
                            color: 'white',
                            zIndex: 1,
                        },
                        duration: 5000,
                        // Default options for specific types
                        success: {
                            duration: 3000,
                            // theme: {
                            //     primary: 'yellow',
                            //     secondary: 'yellow',
                            // },
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

ShipAddress.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ShipAddress);