import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import CartList from './CartList';
import Order from './Order';
import instance from '../../../AxiosConfig';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
            openDialog: false,
            dialogcontent: '',
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
    putData = (pid, size, quantity) => {
        instance.put('/cart', {
            pid: pid,
            size: size,
            quantity: quantity
        }).then(res => {
            if (res.status == 200) {
                this.getData();
                this.setState({
                    openDialog: true,
                    dialogcontent: 'Đã lưu thay đổi'
                })
            }
        })
    }
    updateItemQuantity = (pid, size, quantity) => {
        instance.get('/products/' + pid)
            .then(res => {
                if (res.status == 200) {
                    if (size != '') {
                        if (quantity > res.data.Size[size]) {
                            this.setState({
                                openDialog: true,
                                dialogcontent: 'Thay đổi thất bại, số sản phẩm bạn chọn vượt quá giới hạn'
                            })
                        } else {
                            this.putData(pid, size, quantity);
                        }
                    } else {
                        if (quantity > res.data.Size) {
                            this.setState({
                                openDialog: true,
                                dialogcontent: 'Thay đổi thất bại, số sản phẩm bạn chọn vượt quá giới hạn'
                            })
                        } else {
                            this.putData(pid, size, quantity);
                        }
                    }
                }
            })
    }
    handleClose = () => {
        this.setState({
            openDialog: false,
            dialogcontent: '',
        })
    }
    render() {
        const { classes } = this.props;
        const { width, height, loading, cartItems, money, openDialog } = this.state;
        return (
            <Grid container
                style={{ minHeight: height * 0.55, marginBlock: 15 }}
                direction='row' justify={'center'}>
                {loading == true
                    ? <CircularProgress />
                    : <Grid container item
                        direction='row' justify='center'>
                        <CartList
                            cartItems={cartItems}
                            loading={loading}
                            update={this.updateItemQuantity}
                            remove={this.putData} />
                        <Grid style={{ width: '1.5%' }}></Grid>
                        {cartItems.length != 0
                        ? <Order money={money} cartItems={cartItems} />
                        : null
                        }
                    </Grid>
                }
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">THÔNG BÁO</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.state.dialogcontent}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);