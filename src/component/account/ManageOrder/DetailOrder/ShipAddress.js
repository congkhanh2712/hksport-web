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

class ShipAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { classes,address } = this.props;
        return (
            <Grid item xs={6}>
                <div
                    className={classes.well}
                    style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 220 }}
                >
                    <Typography variant="h6" gutterBottom align="center">
                        Địa chỉ nhận hàng
                    </Typography>
                    <Divider/>
                    {/* id đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Khách hàng:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {address.Name} - {address.Phone}
                            </div>
                        </Grid>
                    </Grid>
                    {/* ngày đặt đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Địa chỉ:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {address.Detail}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Thời gian đặt đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Phường/Xã:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {address.Ward}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Hình thức vận chuyển */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Quận/Huyện:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {address.District}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Hình thức thanh toán */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tỉnh/Thành phố:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {address.City}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        )
    }
}

ShipAddress.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ShipAddress);