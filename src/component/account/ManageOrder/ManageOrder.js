import React, { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProcessingOrder from "./ProcessingOrder"
import ShippingOrder from "./ShippingOrder"
import ShippedOrder from "./ShippedOrder"
import CancelOrder from "./CancelOrder"
import {
    BrowserRouter as Router,
    Link,
    Redirect
} from "react-router-dom";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

class HomeAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue,
        })
    }

    componentDidMount = async () => {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        var slug = this.props.match.params.slug;
        await this.setState({
            value: slug * 1
        })
    }
    render() {
        //var slug = this.props.match.params.slug;
        const { classes } = this.props;
        return (
            <>
                <div className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            style={{ marginLeft: "28%" }}
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Đơn hàng đang xử lý" {...a11yProps(0)} />
                            <Tab label="Đơn hàng đang giao" {...a11yProps(1)} />
                            <Tab label="Đơn hàng đã giao" {...a11yProps(2)} />
                            <Tab label="Đơn hàng đã huỷ" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        <ProcessingOrder />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        <ShippingOrder />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        <ShippedOrder />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={3}>
                        <CancelOrder />
                    </TabPanel>

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
            </>
        );
    }
}

HomeAd.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(HomeAd);