import React, { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import OrderList from "./OrderList"
import instance from '../../../AxiosConfig';

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
            order: [],
            value: 0
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue,
            order: [],
        }, () => {
            this.getBillList();
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
        this.getBillList();
    }
    getBillList = () => {
        var status = '';
        switch (this.state.value) {
            case 0:
                status = '??ang x??? l??';
                break;
            case 1:
                status = "??ang giao";
                break;
            case 2:
                status = "???? giao";
                break;
            case 3:
                status = "???? h???y";
                break
        }
        instance.get('/order/list/user', {
            params: {
                page: 0,
                status: status,
                prevpage: 0,
            }
        }).then(res => {
            if (res.status == 200) {
                console.log(res.data.list)
                this.setState({
                    order: res.data.list,
                })
            }
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
                            <Tab label="????n h??ng ??ang x??? l??" {...a11yProps(0)} />
                            <Tab label="????n h??ng ??ang giao" {...a11yProps(1)} />
                            <Tab label="????n h??ng ???? giao" {...a11yProps(2)} />
                            <Tab label="????n h??ng ???? hu???" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        <OrderList order={this.state.order} />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        <OrderList order={this.state.order} />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        <OrderList order={this.state.order} />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={3}>
                        <OrderList order={this.state.order} />
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