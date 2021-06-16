import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddProduct from './AddProduct'
import UpdateProduct from './UpdateProduct'
import AddVoucher from './voucher/AddVoucher'
import CancelOrderAd from "./ManageOrderAd/CancelOrderAd"
import ProcessingOrderAd from "./ManageOrderAd/ProcessingOrderAd"
import ShippedOrderAd from "./ManageOrderAd/ShippedOrderAd"
import ShippingOrderAd from "./ManageOrderAd/ShippingOrderAd"
import Chat from './Chat';
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import instance from '../../AxiosConfig';

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
      redirect: false,
      value: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    })
  }

  componentDidMount = () => {
    if (localStorage && localStorage.getItem('user')) {
      var user = JSON.parse(localStorage.getItem("user"));
      this.props.isLogin(user);
    };

    if (localStorage.getItem('user') == null) {
      this.setState({
        redirect: true,
      })
    } else {
      var user = JSON.parse(localStorage.getItem("user"));
      instance.get('/auth/', {
        headers: {
          'x-access-token': user.token
        }
      }).then(res => {
        if (res.data.Role != 'Admin') {
          this.setState({
            redirect: true,
          })
        }
      })
    }
    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    })
  }
  render() {
    const { classes } = this.props;
    const { width, height } = this.state;
    if (this.state.redirect === true) {
      return <Redirect to="/" />
    }

    return (
      <>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              style={{ marginInline: '5%' }}
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Thêm sản phẩm" {...a11yProps(0)} />
              <Tab label="Sửa sản phẩm" {...a11yProps(1)} />
              <Tab label="Thêm voucher" {...a11yProps(2)} />
              <Tab label="Đơn hàng đang xử lý" {...a11yProps(3)} />
              <Tab label="Đơn hàng đang giao" {...a11yProps(4)} />
              <Tab label="Đơn hàng đã giao" {...a11yProps(5)} />
              <Tab label="Đơn hàng đã huỷ" {...a11yProps(6)} />
              <Tab label="Tin nhắn" {...a11yProps(7)} />
              {/* <Tab label="Item 9" {...a11yProps(8)} />
              <Tab label="Item Ten" {...a11yProps(9)} /> */}
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.value} index={0}>
            <AddProduct />
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            <UpdateProduct />
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            <AddVoucher />
          </TabPanel>
          <TabPanel value={this.state.value} index={3}>
            <ProcessingOrderAd />
          </TabPanel>
          <TabPanel value={this.state.value} index={4}>
            <ShippingOrderAd />
          </TabPanel>
          <TabPanel value={this.state.value} index={5}>
            <ShippedOrderAd />
          </TabPanel>
          <TabPanel value={this.state.value} index={6}>
            <CancelOrderAd />
          </TabPanel>
          <TabPanel value={this.state.value} index={7}>
            <Chat />
          </TabPanel>
          {/*<TabPanel value={this.state.value} index={8}>
            Item Nine
          </TabPanel>
          <TabPanel value={this.state.value} index={9}>
            Item 10
          </TabPanel> */}
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
      </>
    );
  }
}

HomeAd.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(HomeAd);