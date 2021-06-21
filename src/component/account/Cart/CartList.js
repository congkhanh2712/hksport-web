import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PropTypes from 'prop-types';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CartItem from './CartItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const GREY = "#D4D4D4";
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
            cartItems: null,
            loading: true,
        }
    }

    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.setState({
            cartItems: this.props.cartItems,
            loading: this.props.loading,
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.cartItems != this.props.cartItems) {
            this.setState({
                cartItems: this.props.cartItems
            })
        }
        if (prevProps.loading != this.props.loading) {
            this.setState({
                loading: this.props.loading
            })
        }
    }
    render() {
        const { classes } = this.props;
        const { width, height, loading, cartItems } = this.state;
        const productWidth = width * 0.1;
        return (
            <Grid container item xs={7}
                direction='column' justify='flex-start'>
                <Typography component="h1" variant="h5"
                    style={{ width: '100%', textAlign: 'left',fontWeight:'bold' }}
                    gutterBottom>
                    GIỎ HÀNG
                </Typography>
                {loading == false && cartItems != null
                    ? cartItems.map((item) =>
                        <CartItem item={item} />
                    )
                    : <CircularProgress />
                }
            </Grid>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);