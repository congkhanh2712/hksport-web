import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import CartItem from './CartItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});
const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
        marginTop: theme.spacing(-3),
        marginBottom: theme.spacing(0),
    },
}))(MuiDialogContent);

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            cartItems: null,
            loading: true,
            open: false,
            src: '',
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
    handleClickOpen = (y) => {
        this.setState({
            open: true,
            src: y
        })
    };
    handleClose = () => {
        this.setState({
            open: false
        })
    };
    render() {
        const { classes } = this.props;
        const { width, height, loading, cartItems, open, src } = this.state;
        return (
            <Grid container item xs={7}
                direction='column' justify='flex-start'>
                <Typography component="h1" variant="h5"
                    style={{ width: '100%', textAlign: 'left', fontWeight: 'bold' }}
                    gutterBottom>
                    GIỎ HÀNG
                </Typography>
                {loading == false && cartItems != null
                    ? cartItems.length != 0
                        ? cartItems.map((item) =>
                            <CartItem
                                key={item.ProductID + item.Size}
                                item={item}
                                zoomImage={this.handleClickOpen}
                                errItemsChange={this.props.errItemsChange}
                                update={this.props.update} />
                        )
                        : <Grid container item
                            alignItems='center'
                            justify='center'
                            style={{ minHeight: 420 }}
                            direction='column'>
                            <FilterNoneIcon fontSize={'large'} />
                            <Typography component="h1" variant="h5"
                                style={{ paddingBlock: 10 }}>
                                Bạn chưa có sản phẩm trong giỏ hàng
                            </Typography>
                            <Link to="/">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<AddShoppingCartIcon />}
                                >
                                    MUA HÀNG
                                </Button>
                            </Link>
                        </Grid>
                    : <CircularProgress />
                }
                {/* PHÓNG TO ẢNH */}
                <Dialog onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open} maxWidth={false}>
                    <DialogContent dividers>
                        <img src={src} alt="Hình ảnh" />
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);