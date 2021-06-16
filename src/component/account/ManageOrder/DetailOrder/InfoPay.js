import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Divider } from '@material-ui/core';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class DetailOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { classes,data } = this.props;
        return (
            <Grid item xs={12}>
                <div
                    className={classes.well}
                    style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 200 }}
                >
                    <Typography variant="h6" gutterBottom align="center">
                        Thông tin chi phí
                    </Typography>
                    <Divider/>
                    {/* tổng tiền hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "7%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tổng tiền hàng
                                    </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "7%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.OrderPrice}(vnđ)
                                    </div>
                        </Grid>
                    </Grid>
                    {/* Tổng tiền vận chuyển: */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "7%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tổng tiền vận chuyển:
                                    </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "7%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                            {data.ShipCost}(vnđ)
                                    </div>
                        </Grid>
                    </Grid>
                    {/* Tổng tiền giảm từ voucher: */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "7%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tổng tiền giảm từ voucher:
                                    </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "7%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                            {data.Discount}(vnđ)
                                    </div>
                        </Grid>
                    </Grid>
                    {/* Điểm đã sử dụng: */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "7%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Điểm đã sử dụng:
                                    </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "7%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                            {data.PointUsed} điểm
                                    </div>
                        </Grid>
                    </Grid>
                    {/* Tổng thanh toán: */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "7%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tổng thanh toán:
                                    </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "7%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                            {data.TotalPrice}(vnđ)
                                    </div>
                        </Grid>
                    </Grid>
                    {/* Tình trạng thanh toán: */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "7%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tình trạng thanh toán:
                                    </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "7%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                            {data.PayStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        )
    }
}

DetailOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DetailOrder);