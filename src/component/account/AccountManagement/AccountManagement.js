import React, { Component } from 'react';
import fbApp from '../../../Firebase'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import toast, { Toaster } from 'react-hot-toast';

import Benefit from './Benefit'
import Info from './Info'
import AccountMenu from './AccountMenu'
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    sizeAva: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    button: {
        margin: theme.spacing(1),
    },
    roott: {
        width: "90%",
    },
    rootMenu: {
        width: '100%',
        maxWidth: "97%",
        backgroundColor: theme.palette.background.paper,
    },
});

class AccountManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            keyUser: "",
            fbCustomer: {},
            name: "",
            phone: "",
            change: true,
            role: "",
            //phần ưu đã cho thành viên
            value: "thuong",
            benefit: [],
            avatar: 'https://miro.medium.com/fit/c/1360/1360/1*_zlPUg2jeSp7qFfEhiV9hw@2x.jpeg',
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
                    var temp = {
                        name: res.data.Name,
                        phone: res.data.Phone_Number,
                        point: res.data.Point,
                        role: res.data.Role,
                        pointAvailable: res.data.PointAvailable,
                        createDate: res.data.CreateDate,
                        roleName: res.data.RoleName,
                    }
                    this.setState({
                        fbCustomer: temp,
                        name: temp.name,
                        phone: temp.phone,
                        role: temp.roleName,
                        email: res.data.Email,
                    })
                    if (res.data.Avatar != '') {
                        this.setState({
                            avatar: res.data.Avatar
                        })
                    }
                }
            })
        instance.get('/role')
            .then(res => {
                if (res.status == 200) {
                    var benefit = []
                    res.data.forEach(e => {
                        benefit.push({
                            key: e.key,
                            freeship: e.Benefit.Freeship,
                            refund: e.Benefit.Refund,
                            shipDistance: e.Benefit.ShipDistance
                        })
                    })
                    this.setState({
                        benefit: benefit
                    })
                }
            })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (name == 'avatar') {
            this.setState({
                change: false
            })
        } else {
            this.setState({
                [name]: value
            }, () => {
                if (this.state.name !== this.state.fbCustomer.name || this.state.phone !== this.state.fbCustomer.phone) {
                    this.setState({
                        change: false
                    })
                } else {
                    this.setState({
                        change: true
                    })
                }
            });
        }
    }
    ktraSDT(sdt) {
        for (var x of sdt) {
            if (x.charCodeAt(0) > 57 || x.charCodeAt(0) < 48) {
                return false;
            }
        }
        return true;
    }
    updateInfo = (newurl) => {
        const { name, phone } = this.state;
        var url = this.state.avatar;
        if (newurl != '') {
            url = newurl;
        }
        if (name.trim() != '' && phone.trim() != '') {
            if (phone.length == 10 && this.ktraSDT(phone) == true) {
                instance.put('/auth/info/update', {
                    Name: name,
                    Phone_Number: phone,
                    Avatar: url
                }).then((res) => {
                    toast.success(res.data.message)
                    this.setState({
                        change: true
                    })
                })
            } else {
                this.getData();
                toast.error('Vui lòng nhập đúng định dạng số điện thoại')
            }
        } else {
            this.getData();
            toast.error('Vui lòng nhập đầy đủ thông tin')
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
    }

    render() {
        var { email, fbCustomer, name, phone, role, benefit, value } = this.state;
        //hiển thị lợi ích thành viên
        var phanTramTichLuy = 0;
        var kc = 0;
        var color = "";
        var freeship = false;
        var keyrole = "";
        if (value === "thuong") {
            keyrole = "-MOgFiH4LPenx6Kqq0Nu"
            color = "#2ED5F3"
        }
        if (value === "bac") {
            keyrole = "-MOgFiH4LPenx6Kqq0Nx"
            color = "#C0C0C0"
        }
        if (value === "vang") {
            keyrole = "-MOgFiH4LPenx6Kqq0Ny"
            color = "gold"
        }
        benefit.forEach(x => {
            if (x.key === keyrole) {
                phanTramTichLuy = x.refund * 100;
                kc = x.shipDistance;
                freeship = x.freeship;
            }
        })

        //hiển thị điểm còn thiếu để lên bậc
        var nextLv = {};
        if (fbCustomer.point < 10000) {
            var pn = 10000 - fbCustomer.point;
            nextLv = {
                pointNeed: pn,
                next: "Thành Viên Bạc"
            }
        } else if (fbCustomer.point < 25000 && fbCustomer.point > 10000) {
            var pn = 25000 - fbCustomer.point;
            nextLv = {
                pointNeed: pn,
                next: "Thành Viên Vàng"
            }
        }

        const { classes } = this.props;
        return (
            <div className={classes.root} style={{ backgroundColor: "#f0f0f0" }}>
                <Grid container spacing={0}>
                    {/* thông tin cá nhân */}
                    <Info
                        createDate={fbCustomer.createDate}
                        email={email}
                        name={name}
                        onChange={this.onChange}
                        phone={phone}
                        disabled={this.state.change}
                        role={role}
                        point={fbCustomer.point}
                        pointAvailable={fbCustomer.pointAvailable}
                        pointNeed={nextLv.pointNeed}
                        nextLv={nextLv.next}
                        updateInfo={this.updateInfo}
                        avatar={this.state.avatar}
                    />
                    {/* các quyền lợi của tài khoản */}
                    <Benefit
                        value={this.state.value}
                        onChange={this.handleChange}
                        phanTramTichLuy={phanTramTichLuy}
                        kc={kc}
                        freeship={freeship}
                        color={color}
                    />
                </Grid>

                <AccountMenu />

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
            </div>
        )
    }
}

AccountManagement.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AccountManagement);