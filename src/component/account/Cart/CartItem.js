import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PropTypes from 'prop-types';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class CartItem extends Component {
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
        const { classes, item } = this.props;
        const { width } = this.state;
        const productWidth = width * 0.1;
        return (
            <Grid
                className={classes.well}
                container item direction='row'
                justify='space-around'
                alignItems='center'
                style={{ paddingBlock: 10, marginBottom: 20 }}
                key={item.ProductID + item.Size}>
                <Grid container item xs={4}
                    direction='row' justify='center'>
                    <img
                        width={productWidth}
                        height={productWidth * 5 / 4}
                        src={item.Image} />
                </Grid>
                <Grid container item xs={7}
                    direction='column'
                    justify='space-around'
                    style={{ textAlign: 'left' }}>
                    <Typography variant="h6">
                        {item.Name}
                    </Typography>
                    <Typography variant="subtitle1">
                        Phân loại: {item.Size}
                    </Typography>
                    <Typography variant="subtitle1">
                        Đơn giá: {item.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                    </Typography>
                    <Grid container item
                        direction='row'
                        alignItems='center'>
                        <Typography variant="subtitle1">
                            Số lượng:
                        </Typography>
                        <ButtonGroup
                            style={{ alignItems: 'center' }}>
                            <IconButton
                                variant="outlined"
                                aria-label="decrease quantity">
                                <IndeterminateCheckBoxIcon />
                            </IconButton>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                name="quantity"
                                style={{ width: '25%' }}
                                value={item.Quantity}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <IconButton aria-label="increase quantity">
                                <AddBoxIcon />
                            </IconButton>
                        </ButtonGroup>
                    </Grid>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        Tổng tiền: {(item.Price * item.Quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                    </Typography>
                </Grid>
                <Grid container item xs={1}
                    style={{ height: '100%', textAlign: 'center' }}>
                    <IconButton aria-label="delete">
                        <DeleteOutlineIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    }
}

CartItem.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CartItem);