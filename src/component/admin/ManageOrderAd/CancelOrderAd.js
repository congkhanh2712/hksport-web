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

class CancelOrderAd extends Component {
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
        this.getData();
    }
    getData = () => {
        instance.get('/order/list', {
            params: {
                page: 0,
                status: "Đã hủy",
            }
        }).then(res => {
            this.setState({
                order: res.data.list,
            })
        })
    }
    render() {
        var { order } = this.state;
        var { classes } = this.props;
        return (
            <div style={{ minHeight: 420 }}>
                <Grid container spacing={0}>
                    {order.map((x, index) => {
                        console.log(x)
                        return <CardOrderAd
                            Phone={x.Address.Phone}
                            Name={x.Address.Name}
                            Key={x.key}
                            OrderDate={x.OrderDate}
                            OrderTime={x.OrderTime}
                            refresh = {this.getData}
                            Status={x.Status} />
                    })}
                </Grid>
            </div>
        )
    }
}

CancelOrderAd.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CancelOrderAd);