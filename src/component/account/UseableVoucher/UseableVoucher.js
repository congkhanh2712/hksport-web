import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CardVoucher from "./CardVoucher"
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";
const styles = theme => ({
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    root: {
        flexGrow: 1,
    },
    sizeAva: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    rootava: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
});

class UseableVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbVoucher: [],
            userPoint: 0,
            roleList: [],
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
    getData = async () => {
        await instance.get('/auth')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        userPoint: res.data.Point
                    })
                }
            })
        await instance.get('/role')
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        roleList: res.data
                    })
                }
            })
        await instance.get('/voucher')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbVoucher: this.filter(res.data.list),
                    })
                }
            })
    }
    isExpired = (day) => {
        var d = this.tranDay(day) + 86400000;
        var today = (new Date().getTime());
        return d - today;
    }
    filter = (items) => {
        items = items.filter(item => this.isAvailable(item.Role) != -1)
        return items
    }
    isAvailable = (role) => {
        var pos = -1;
        const { roleList } = this.state;
        for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].key == role && this.state.userPoint >= roleList[i].MinPoint) {
                pos = i;
            }
        }
        return pos
    }
    tranDay = (ngay) => {
        var d = '';
        var m = '';
        var y = '';
        for (let i = 0; i < 3; i++) {
            if (ngay[i] === '/') {
                d = ngay.slice(0, i);
                for (let j = i + 1; j < ngay.length; j++) {
                    if (ngay[j] === '/') {
                        m = ngay.slice(i + 1, j);
                        y = ngay.slice(j + 1, ngay.length);
                    }
                }
            }
        }
        return (new Date(y, m - 1, d)).getTime();
    }
    render() {
        const { classes } = this.props;
        var { fbVoucher } = this.state;
        return (
            <div className={classes.root} style={{ minHeight: 500, backgroundColor: "#f0f0f0" }}>
                <Grid container spacing={0}>
                    {fbVoucher.map(x => {
                        if (this.isExpired(x.DateEnd) >= 0)
                            return <CardVoucher data={x} time={this.isExpired(x.DateEnd)} />
                    })}
                </Grid>
            </div>
        )
    }
}

UseableVoucher.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UseableVoucher);