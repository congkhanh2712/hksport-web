import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import CardOrderAd from './CardOrderAd';
import instance from '../../../AxiosConfig';
import CircularProgress from '@material-ui/core/CircularProgress';
import FilterNoneIcon from '@material-ui/icons/FilterNone';


const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class ProcessingOrderAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            loading: true
        }
    }
    componentDidMount = async () => {
        this.getData();
    }
    getData = () => {
        instance.get('/order/list', {
            params: {
                page: 0,
                status: "Đang xử lý",
            }
        }).then(res => {
            this.setState({
                order: res.data.list,
                loading: false
            })
        })
    }
    render() {
        var { order } = this.state;
        return (
            <Grid container
                direction='column'
                justify='center'
                alignItems='center'
                spacing={0}>
                {this.state.loading == false
                    ? order.length != 0
                        ? order.map((x) =>
                            <Grid
                                key={x.key}
                                item style={{ width: '100%' }}>
                                <CardOrderAd
                                    Phone={x.Address.Phone}
                                    Name={x.Address.Name}
                                    Key={x.key}
                                    OrderDate={x.OrderDate}
                                    OrderTime={x.OrderTime}
                                    Status={x.Status}
                                    User={x.User}
                                    refresh={this.getData}
                                />
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

ProcessingOrderAd.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ProcessingOrderAd);