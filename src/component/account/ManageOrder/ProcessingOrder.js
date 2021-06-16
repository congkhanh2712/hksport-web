import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import CardOrder from './CardOrder'
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class ProcessingOrder extends Component {
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
        this.getBillList();
    }
    getBillList = () => {
        instance.get('/order/list/user', {
            params: {
                page: 0,
                status: 'Đang xử lý',
                prevpage: 0,
            }
        }).then(res => {
            if (res.status == 200) {
                this.setState({
                    order: res.data.list
                })
            }
        })
    }
    render() {
        var { order } = this.state;
        var { classes } = this.props;
        return (
            <div style={{ minHeight: 420 }}>
                <Grid container spacing={0}>
                    {order.map(x => {
                        return <CardOrder
                            Key={x.key}
                            OrderDate={x.OrderDate}
                            OrderTime={x.OrderTime}
                            refresh={this.getBillList}
                            Rating={x.Rating}
                            OrderDetail = {x.OrderDetail}
                            Status={x.Status} />
                    })}

                </Grid>
            </div>
        )
    }
}

ProcessingOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ProcessingOrder);