import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import CartList from './CartList';
import Order from './Order';
import instance from '../../../AxiosConfig';
import Slide from '@material-ui/core/Slide';
import NotificationDialog from './Dialog/NotificationDialog';

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
            errItems: [],
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
    handleClose = () => {
        this.setState({
            openDialog: false,
            dialogcontent: '',
        })
    }
    errItemsChange = (type, pid, size) => {
        var err = this.state.errItems;
        var obj = {
            ProductID: pid,
            Size: size,
        }
        var i = -1;
        err.forEach((e, index) => {
            if (e.ProductID == obj.ProductID && e.Size == obj.Size) {
                i = index;
            }
        })
        if (type == "push" && i == -1) {
            err.push(obj)
        } else if (type == "remove") {
            err = err.filter(e => e.ProductID != pid || e.Size != size);
        }
        this.setState({
            errItems: err
        })
    }
    render() {
        const { classes } = this.props;
        const { width, height, loading, cartItems, money,
            openDialog, dialogcontent, errItems } = this.state;
        return (
            <Grid container
                style={{ minHeight: height * 0.55, marginBlock: 15 }}
                direction='row' justify={'center'}>
                {loading == true
                    ? <CircularProgress />
                    : <Grid container item
                        direction='row' justify='center'>
                        <CartList
                            errItemsChange={this.errItemsChange}
                            cartItems={cartItems}
                            loading={loading}
                            update={this.putData} />
                        <Grid style={{ width: '1.5%' }}></Grid>
                        {cartItems.length != 0
                            ? <Order money={money}
                                errItems={errItems}
                                cartItems={cartItems} />
                            : null
                        }
                    </Grid>
                }
                {openDialog == false
                    ? null
                    : <NotificationDialog
                        close={this.handleClose}
                        dialogcontent={dialogcontent}
                    />
                }
            </Grid>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);