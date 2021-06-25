import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class InfoOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    openDialog = () => {
        this.setState({
            open: true
        })
    }

    closeDialog = () => {
        this.setState({
            open: false
        })
    }
    render() {
        const { classes, data, processing } = this.props;

        return (
            <Grid item xs={6}>
                <div
                    className={classes.well}
                    style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 220 }}
                >
                    <Typography variant="h6" gutterBottom align="center">
                        Thông tin đơn hàng
                    </Typography>
                    <Divider />
                    {/* id đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={4} >
                            <div style={{ marginLeft: "23%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                ID đơn hàng:
                            </div>
                        </Grid>
                        <Grid item xs={8} >
                            <div style={{ marginRight: "11.5%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.key}
                            </div>
                        </Grid>
                    </Grid>
                    {/* ngày đặt đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Ngày đặt đơn:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.OrderDate}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Thời gian đặt đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Thời gian đặt:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.OrderTime}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Hình thức vận chuyển */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Hình thức vận chuyển:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.ShipType}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Hình thức thanh toán */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Hình thức thanh toán:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.Payments}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Tình trạng đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tình trạng đơn hàng:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "15%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                {data.Status}
                            </div>
                        </Grid>
                    </Grid>
                    {/* Tiến trình của đơn hàng */}
                    <Grid container spacing={0}>
                        <Grid item xs={6} >
                            <div style={{ marginTop: 7, marginLeft: "15%", float: "left", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                Tiến trình của đơn hàng:
                            </div>
                        </Grid>
                        <Grid item xs={6} >
                            <div style={{ marginRight: "13%", float: "right", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                <Button color="primary" onClick={this.openDialog}>Xem chi tiết</Button>
                            </div>
                        </Grid>
                    </Grid>


                    {/* dialog */}
                    <Dialog
                        open={this.state.open}
                        onClose={this.closeDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth={true}
                        maxWidth="sm"
                    >
                        <DialogTitle id="alert-dialog-title">Tiến trình đơn hàng</DialogTitle>
                        <DialogContent>
                            <Timeline>
                                {processing.map((x, index) => {
                                    return <TimelineItem key={index}>
                                        <TimelineOppositeContent>
                                            <Typography color="textSecondary">{x.time} {x.title}</Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography>{x.description}</Typography>
                                        </TimelineContent>
                                    </TimelineItem>
                                })}
                            </Timeline>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDialog} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Grid>
        )
    }
}

InfoOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InfoOrder);