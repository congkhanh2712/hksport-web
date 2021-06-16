import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import InfoOrder from './InfoOrder'
import InfoPay from './InfoPay'
import ShipAddress from './ShipAddress'
import CartOrder from './CartOrder'
import fbApp from '../../../../Firebase'
import instance from '../../../../AxiosConfig';

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
            key: "",
            order: {},
            loading: true,
        }
    }
    componentDidMount = async () => {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        var slug = this.props.match.params.slug;
        this.getData(slug);
    }
    getData = (id) => {
        instance.get('/order/detail/' + id)
            .then(res => {
                this.setState({
                    order: res.data,
                    loading: false,
                })
            })
    }
    render() {
        var { order } = this.state;
        const { classes } = this.props;
        if (this.state.loading == false) {
            return (
                <div className={classes.root} style={{ backgroundColor: "#f0f0f0", minHeight: 500, paddingLeft: "11%", paddingRight: "11%" }}>
                    <Grid container spacing={0} >
                        <InfoOrder data={order} processing={order.Timeline} />
                        <ShipAddress address={order.Address} />
                        <CartOrder products={order.OrderDetail} />
                        <InfoPay data={order} />
                    </Grid>
                </div>
            )
        } else {
            return null;
        }
    }
}

DetailOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DetailOrder);