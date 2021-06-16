import React, { Component } from 'react';
import '../../App.css';
import Grid from '@material-ui/core/Grid';
import GoogleMap from './GoogleMap'
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import CallIcon from '@material-ui/icons/Call';
import Divider from '@material-ui/core/Divider';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import EmailIcon from '@material-ui/icons/Email';
import Button from '@material-ui/core/Button';
import {
  Link
} from "react-router-dom";

export default class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount = async () => {
    if (localStorage && localStorage.getItem('user')) {
      var user = JSON.parse(localStorage.getItem("user"));
      this.props.isLogin(user);
    };
  }

  render() {
    return (
      <div style={{ flex: 1, flexDirection: 'row', marginLeft: 200, marginRight: 200 }}>
        {/* <div style={{backgroundColor:"white"}}>a</div>
        <div style={{backgroundColor:"orange"}}>b</div> */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div style={{ backgroundColor: "white", height: 603.5 }}>
              <GoogleMap />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ backgroundColor: "#06b844", height: 700, marginLeft: 50 }}>
              <div style={{ paddingTop: 150, paddingLeft: 70, paddingRight: 70 }}>
                <Typography variant="body2" gutterBottom style={{}}>
                  <HomeIcon style={{ marginTop: -5, marginRight: 5 }} fontSize="small" />Địa chỉ:
                </Typography>
                <Typography variant="h6" gutterBottom style={{}}>
                  21/6 đường 11, Phường Tăng Nhơn Phú B, Quận 9, Thành phố Hồ Chí Minh
                </Typography>
                <Typography variant="body2" gutterBottom style={{ marginTop: 30 }}>
                  <CallIcon style={{ marginTop: -5, marginRight: 5 }} fontSize="small" />SĐT:
                </Typography>
                <Typography variant="h6" gutterBottom style={{}}>
                  0969263550
                </Typography>
                <Divider />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}
