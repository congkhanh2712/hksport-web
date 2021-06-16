import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import fbApp from '../../../Firebase'
import toast, { Toaster } from 'react-hot-toast';
import {
    Router,
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
});

class CardOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount = () => {
        console.log(this.props.OrderDetail)
    }
    btnLeft = async () => {
        var { Status, Key } = this.props
        if (Status === "Đang xử lý" || Status === "Đang giao") {
            //Set trạng thái đơn hàng
            instance.put('/order/detail/' + Key, {
                Status: 'Đã hủy'
            })
            //Set timeline Cancelled
            instance.post('/order/detail/' + Key, {
                status: 'Cancelled'
            })
            instance.put('/products', {
                orderdetail: this.props.OrderDetail,
                type: 0,
            })
            toast.success("Đã hủy đơn hàng");
        } else {
            const { OrderDetail } = this.props;
            for (let i = 0; i < OrderDetail.length; i++) {
                await instance.post('/cart', OrderDetail[i])
            }
            toast.success("Đã thêm các sản phẩm thuộc đơn hàng vào giỏ hàng");
        }
    }
    render() {
        var { classes, Key, OrderDate, OrderTime, Status, Rating } = this.props;
        return (
            <Grid item xs={12}>
                <div
                    className={classes.well}
                    style={{ borderRadius: 10, shadow: 10, height: 150, marginBottom: 20 }}
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
                    {/* nút xử lý */}
                    <Grid container spacing={0} style={{ marginTop: 10 }}>
                        <Grid className={classes.rootava} item xs={4} >
                            <div style={{ marginLeft: "50%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <Button variant="contained" color="primary" onClick={this.btnLeft}>
                                    <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, color: 'white' }}>
                                        {(Status === "Đang xử lý" || Status === "Đang giao") ? "Huỷ đơn hàng" : "Mua lại"}
                                    </div>
                                </Button>
                            </div>
                        </Grid>
                        <Grid className={classes.rootava} item xs={4} >
                            <div style={{ marginRight: "50%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <Link to={`/account/manage-order/detail-order/${Key}`} style={{ textDecoration: "none", color: "black" }}>
                                    <Button variant="contained" color="primary">
                                        <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, color: 'white' }}>
                                            Xem chi tiết đơn hàng
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        </Grid>
                        {Status === "Đã giao"
                            ? Rating == false || Rating == 0
                                ? <Grid className={classes.rootava} item xs={4} >
                                    <div style={{ marginRight: "40%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>

                                        <Button variant="contained" color="primary" disabled={Rating}>
                                            <Link to={`/account/manage-order/rating-order/${Key}`} style={{ textDecoration: "none", color: "black" }}>
                                                <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, color: "white" }}>
                                                    Đánh giá đơn hàng
                                                </div>
                                            </Link>
                                        </Button>

                                    </div>
                                </Grid>
                                : ""
                            : ""}
                    </Grid>

                    {/* toast */}
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
                </div>
            </Grid>
        )
    }
}

CardOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CardOrder);