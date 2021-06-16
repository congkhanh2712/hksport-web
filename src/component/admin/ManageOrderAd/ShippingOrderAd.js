import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CardOrderAd from './CardOrderAd'
import { Grid } from '@material-ui/core';
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class ShippingOrderAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            loading: true,
        }
    }
    componentDidMount = async () => {
        var user
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        this.getData();
    }
    getData = () => {
        instance.get('/order/list', {
            params: {
                page: 0,
                status: "Đang giao",
            }
        }).then(res => {
            console.log(res.data)
            this.setState({
                order: res.data.list,
                loading: false,
            })
        })
    }
    render() {
        const { order } = this.state;
        return (
            <div style={{ minHeight: 420 }}>
                {this.state.loading == false
                    ? <Grid container spacing={0}>
                        {order.map((x, index) => {
                            return <CardOrderAd
                                Phone={x.Address.Phone}
                                Name={x.Address.Name}
                                Address={x.Address}
                                Key={x.key}
                                OrderDate={x.OrderDate}
                                OrderTime={x.OrderTime}
                                Status={x.Status}
                                User={x.User}
                                refresh={this.getData}
                            />
                        })}
                    </Grid>
                    : null}
            </div>
        )
    }
}

ShippingOrderAd.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ShippingOrderAd);