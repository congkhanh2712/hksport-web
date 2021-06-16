import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import toast, { Toaster } from 'react-hot-toast';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
});

class CardOrderAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            message: ""
        }
    }
    btnGiaoHang = () => {
        instance.put('/order/detail/' + this.props.Key, {
            Status: "Đang giao",
            Message: this.state.message,
        })
        instance.post('/order/detail/' + this.props.Key, {
            status: "Shipping"
        }).then(res => {
            if (res.data.succeed == true) {
                toast.success(res.data.message)
                this.setState({
                    message: ""
                })
                this.props.refresh()
            }
        })
    }

    btnShipped = () => {
        instance.put('/order/detail/' + this.props.Key, {
            Status: "Đã giao",
            Message: this.state.message,
            PayStatus: true
        })
        instance.post('/order/detail/' + this.props.Key, {
            status: "Shipped"
        }).then(res => {
            if (res.data.succeed == true) {
                toast.success(res.data.message);
                this.setState({
                    message: ""
                })
                this.props.refresh()
            }
        })
    }

    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
        console.log(this.state)
    }
    render() {
        var { classes, Key, OrderDate, OrderTime, Status, Name, Phone } = this.props;
        var styleBtnSeeDetail = (Status === "Đã giao" || Status === "Đã hủy") ? "-15%" : "50%";
        var heightCard = (Status === "Đang xử lý" || Status === "Đang giao") ? 240 : 180;
        return (
            <Grid item xs={12}>
                <div
                    className={classes.well}
                    style={{ borderRadius: 10, shadow: 10, height: heightCard, marginBottom: 20 }}
                >
                    <Grid container spacing={0}>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "5%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tình trạng đơn hàng
                            </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: "5%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {Status}
                            </div>
                        </Grid>
                    </Grid>
                    <Divider />
                    {/* thong tin khach hang */}
                    <Grid container spacing={0}>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "5%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Thông tin khách hàng:
                            </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: "5%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {Name} - {Phone}
                            </div>
                        </Grid>
                    </Grid>
                    {/* mã đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "5%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Mã đơn hàng:
                                    </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: "5%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {Key}
                            </div>
                        </Grid>
                    </Grid>
                    {/* ngày đặt */}
                    <Grid container spacing={0}>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "5%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Ngày đặt:
                                    </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: "5%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {OrderDate}
                            </div>
                        </Grid>
                    </Grid>
                    {/* thời gian đặt */}
                    <Grid container spacing={0}>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "5%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Thời gian đặt hàng:
                                    </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: "5%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {OrderTime}
                            </div>
                        </Grid>
                    </Grid>
                    {/* lời nhắn của admin */}
                    {(Status === "Đang xử lý" || Status === "Đang giao") ?  <Grid container spacing={0}>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginTop:"4%",marginLeft: "5%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Lời nhắn:
                            </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: "5%", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <form className={classes.form} noValidate>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Lời nhắn"
                                        name="message"
                                        onChange={this.onChange}
                                        value={this.state.message}
                                    />
                                </form>
                            </div>
                        </Grid>
                    </Grid> : ""}
                   
                    {/* nút xử lý */}
                    <Grid container spacing={0} style={{ marginTop: 10 }}>
                        {Status === "Đang xử lý" ? <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "50%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <Button variant="contained" color="primary" onClick={this.btnGiaoHang}>
                                    <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        Giao hàng
                                    </div>
                                </Button>
                            </div>
                        </Grid> : ""}
                        {Status === "Đang giao" ? <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginLeft: "50%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <Button variant="contained" color="primary" onClick={this.btnShipped}>
                                    <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        Xác nhận đã giao
                                    </div>
                                </Button>
                            </div>
                        </Grid> : ""}

                        <Grid className={classes.rootava} item xs={6} >
                            <div style={{ marginRight: `${styleBtnSeeDetail}`, float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <Link to={`/admin/detail-order/${Key}`} style={{ textDecoration: "none", color: "black" }}>
                                    <Button variant="contained" color="primary">
                                        <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                            Xem chi tiết đơn hàng
                                    </div>
                                    </Button>
                                </Link>
                            </div>
                        </Grid>
                    </Grid>
                    {/* toast */}
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
                </div>
            </Grid>
        )
    }
}

CardOrderAd.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CardOrderAd);