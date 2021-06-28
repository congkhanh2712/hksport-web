import React, { Component } from 'react';

import toast, { Toaster } from 'react-hot-toast';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import UpdateProduct from './UpdateProduct'
import ManageVoucher from './ManageVoucher'
import ManageOrder from './ManageOrder';
import Report from './Report';
import Chat from './Chat';

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
    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    })
  }
  render() {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.root}>
          <AppBar position="static" color="default" style={{ alignItems: 'center' }}>
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
              <Tab label="Báo cáo và thống kê" {...a11yProps(0)} />
              <Tab label="Quản lý sản phẩm" {...a11yProps(1)} />
              <Tab label="Quản lý voucher" {...a11yProps(2)} />
              <Tab label="Quản lý đơn hàng" {...a11yProps(3)} />
              <Tab label="Tin nhắn" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.value} index={0}>
            <Report />
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            <UpdateProduct />
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            <ManageVoucher />
          </TabPanel>
          <TabPanel value={this.state.value} index={3}>
            <ManageOrder />
          </TabPanel>
          <TabPanel value={this.state.value} index={4}>
            <Chat />
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