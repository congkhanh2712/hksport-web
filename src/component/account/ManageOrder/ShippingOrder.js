import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CardOrder from './CardOrder'
import instance from '../../../AxiosConfig';
import { Grid, Typography } from '@material-ui/core';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class ShippingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
        }
    }
    componentDidMount = async () => {
        var user
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        this.getBillList()
    }
    getBillList = () => {
        instance.get('/order/list/user', {
            params: {
                page: 0,
                status: "Đang giao",
                prevpage: 0,
            }
        }).then(res => {
            console.log(res)
            if (res.status == 200) {
                this.setState({
                    order: res.data.list
                })
            }
        })
    }
    render() {
        var { classes } = this.props;
        var { order } = this.state;
        return (
            <div style={{ minHeight: 420 }}>
                <Grid container spacing={0}>
                    {order.length != 0
                        ? order.map(x => {
                            return <CardOrder
                                Key={x.key}
                                OrderDate={x.OrderDate}
                                OrderTime={x.OrderTime}
                                refresh={this.getBillList}
                                Rating={x.Rating}
                                Status={x.Status}
                                OrderDetail={x.OrderDetail} />
                        })
                        : <Typography variant="subtitle2" gutterBottom style={{ marginLeft: 20 }}>
                            Không có đơn hàng
                        </Typography>
                    }
                </Grid>
            </div>
        )
    }
}

ShippingOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ShippingOrder);