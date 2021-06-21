import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CartList from './CartList';
import Order from './Order';
import instance from '../../../AxiosConfig';

const GREY = "#B6B6B6";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});
class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            cartItems: [],
            loading: true,
            money: 0,
        }
    }

    componentDidMount = async () => {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.getData();
    }
    calculateTotalPrice(items) {
        var money = 0;
        for (let i = 0; i < items.length; i++) {
            money = money + items[i].Quantity * items[i].Price;
        }
        return money;
    }
    getData = () => {
        instance.get('/cart')
            .then(res => {
                this.setState({
                    cartItems: res.data,
                    loading: false,
                    money: this.calculateTotalPrice(res.data),
                });
            })
    }
    render() {
        const { classes } = this.props;
        const { width, height, loading, cartItems, money } = this.state;
        return (
            <Grid container
                style={{ minHeight: height * 0.55, marginBlock: 15 }}
                direction='row' justify={'center'}>
                {loading == true
                    ? <CircularProgress />
                    : <Grid container item
                        direction='row' justify='center'>
                        <CartList cartItems={cartItems} loading={loading} />
                        <Grid style={{ width: '1.5%' }}></Grid>
                        <Order money={money} />
                    </Grid>
                }
            </Grid>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);