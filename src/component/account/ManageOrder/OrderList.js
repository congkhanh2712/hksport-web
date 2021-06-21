import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import CardOrder from './CardOrder'
import CircularProgress from '@material-ui/core/CircularProgress';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import Typography from '@material-ui/core/Typography';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            loading: true,
        }
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props.order != prevProps.order){
            console.log(this.props.order)
            this.setState({
                order: this.props.order,
                loading: false
            })
        }
    }
    render() {
        const { order, loading } = this.state;
        const { classes } = this.props;
        return (
            <Grid container
                direction='column'
                justify={loading == false ? 'flex-start' : 'center'}
                alignItems='center'
                style={{ minHeight: 420 }}
                spacing={0}>
                {loading == false
                    ? order.length != 0
                        ? order.map((x) =>
                            <Grid 
                            key = {x.key}
                            item style={{ width: '100%' }}>
                                <CardOrder
                                    Key={x.key}
                                    OrderDate={x.OrderDate}
                                    OrderTime={x.OrderTime}
                                    refresh={this.getBillList}
                                    Rating={x.Rating}
                                    OrderDetail={x.OrderDetail}
                                    Status={x.Status} />
                            </Grid>
                        )
                        : <Grid container item
                            alignItems='center'
                            justify='center'
                            style={{ minHeight: 420 }}
                            direction='column'>
                            <FilterNoneIcon fontSize={'large'} />
                            <Typography component="h1" variant="h5"
                                style={{ paddingBlock: 10 }}>
                                Không có đơn hàng
                            </Typography>
                        </Grid>
                    : <CircularProgress />}
            </Grid>
        )
    }
}

OrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OrderList);