import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Redirect, Link } from 'react-router-dom';

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
    rootMenu: {
        width: "97%",
    },
});

class AccountMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        var { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={0}>
                    <div
                        className={classes.well}
                        style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 270, width: "100%" }}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs={6}>
                                <List component="nav" className={classes.rootMenu} aria-label="mailbox folders" style={{ marginLeft: 10 }}>
                                    <Link to="/account/manage-order/0" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText style={{ marginLeft: "40%", size: 50 }}>
                                                <Typography variant="button" gutterBottom>
                                                    Quản lý đơn hàng
                                            </Typography>
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/manage-order/0" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText primary="Đơn hàng đang xử lý" />
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/manage-order/1" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText primary="Đơn hàng đang giao" />
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/manage-order/2" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText primary="Đơn hàng đã giao" />
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/manage-order/3" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText primary="Đơn hàng đã huỷ" />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>

                            <Grid item xs={6} style={{ borderLeft: `2px solid #f0f0f0` }}>
                                <List component="nav" className={classes.rootMenu} aria-label="mailbox folders" style={{ marginLeft: 10 }}>
                                    <Link to="/account/change-password" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText>
                                                Đổi mật khẩu
                                            </ListItemText>
                                        </ListItem>
                                    </Link>

                                    <Link to="/account/change-shipaddress" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText>
                                                Địa chỉ nhận hàng
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/useable-voucher" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText>
                                                Ví voucher của bạn
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/seen-product" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText>
                                                Sản phẩm đã xem
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                    <Link to="/account/liked-product" style={{ textDecoration: "none", color: "black", fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <ListItem button divider>
                                            <ListItemText>
                                                Sản phẩm đã thích
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </div>
        )
    }
}

AccountMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AccountMenu);