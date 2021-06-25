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
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import RemoveDialog from './Dialog/RemoveDialog';
import NotificationDialog from './Dialog/NotificationDialog';
import fbApp from '../../../Firebase';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
            removeDialog: false,
            notiDialog: false,
            quantity: 0,
            available: true,
            nowQuantity: 0,
            dialogcontent: '',
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
            quantity: this.props.item.Quantity
        })
        const { item } = this.props;
        fbApp.database().ref('TblProduct').child(item.ProductID).child('Size')
            .on('value', snap => {
                if (item.Size != '') {
                    if (item.Quantity > snap.val()[item.Size]) {
                        this.setState({
                            available: false
                        })
                        this.props.errItemsChange("push", item.ProductID, item.Size);
                    } else {
                        this.setState({
                            available: true
                        })
                        this.props.errItemsChange("remove", item.ProductID, item.Size);
                    }
                    this.setState({
                        nowQuantity: snap.val()[item.Size]
                    })
                } else {
                    if (item.Quantity > snap.val()) {
                        this.setState({
                            available: false
                        })
                        this.props.errItemsChange("push", item.ProductID, item.Size);
                    } else {
                        this.setState({
                            available: true
                        })
                        this.props.errItemsChange("remove", item.ProductID, item.Size);
                    }
                    this.setState({
                        nowQuantity: snap.val()
                    })
                }
            })
    }
    closeRemoveDialog = () => {
        this.setState({
            removeDialog: false
        })
    }
    closeNotiDialog = () => {
        this.setState({
            notiDialog: false
        })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    handleClick = (type) => {
        const { quantity } = this.state;
        if (type == 'increase') {
            this.setState({ quantity: quantity + 1 })
        } else {
            if (quantity >= 1) {
                this.setState({ quantity: quantity - 1 })
            }
        }
    }
    saveChanges = async () => {
        const { quantity, nowQuantity } = this.state;
        const { item } = this.props;
        if (quantity == 0) {
            this.setState({
                removeDialog: true
            })
        } else {
            if (quantity <= nowQuantity) {
                this.props.errItemsChange("remove", item.ProductID, item.Size);
                this.props.update(item.ProductID, item.Size, quantity);
                this.setState({
                    available: true
                })
            } else {
                this.setState({
                    notiDialog: true,
                    dialogcontent: 'Thay đổi thất bại, số sản phẩm bạn chọn vượt quá giới hạn',
                    quantity: item.Quantity
                })
            }
        }
    }
    remove = () => {
        const { item } = this.props;
        this.props.update(item.ProductID, item.Size, 0);
        this.closeRemoveDialog();
    }
    render() {
        const { classes, item } = this.props;
        const { width, removeDialog, quantity, available, nowQuantity,
            notiDialog, dialogcontent } = this.state;
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
                        onClick={() => this.props.zoomImage(item.Image)}
                        style={{ cursor: 'zoom-in' }}
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
                        Phân loại: {item.Size != '' ? item.Size : 'Không có'}
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
                                onClick={() => this.handleClick("decrease")}
                                aria-label="decrease quantity">
                                <IndeterminateCheckBoxIcon />
                            </IconButton>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                name="quantity"
                                onChange={this.onChange}
                                style={{ width: '25%' }}
                                value={quantity}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <IconButton
                                onClick={() => this.handleClick("increase")}
                                aria-label="increase quantity">
                                <AddBoxIcon />
                            </IconButton>
                        </ButtonGroup>
                        {quantity != item.Quantity
                            ? <Button onClick={this.saveChanges} variant="contained" color="default">
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    color: 'black'
                                }}>
                                    lưu thay đổi
                                </div>
                            </Button>
                            : null
                        }
                    </Grid>
                    {available == true
                        ? null
                        : <div>
                            <p style={{
                                fontFamily: `Arial, Helvetica, sans-serif`,
                                color: '#FF5F38', fontStyle: 'italic'
                            }}>
                                Sản phẩm này hiện tại không đủ số lượng theo yêu cầu của bạn.
                            </p>
                            <p style={{
                                fontFamily: `Arial, Helvetica, sans-serif`,
                                color: '#FF5F38', fontStyle: 'italic'
                            }}>
                                Số lượng hiện tại: {nowQuantity} sản phẩm
                            </p>
                        </div>
                    }
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        Tổng tiền: {(item.Price * quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                    </Typography>
                </Grid>
                <Grid container item xs={1}
                    style={{ height: '100%', textAlign: 'center' }}>
                    <IconButton aria-label="delete" onClick={() => {
                        this.setState({
                            removeDialog: true
                        })
                    }}>
                        <DeleteOutlineIcon />
                    </IconButton>

                </Grid>
                {removeDialog
                    ? <RemoveDialog
                        closeRemoveDialog={this.closeRemoveDialog}
                        remove={this.remove}
                    />
                    : null
                }
                {notiDialog
                    ? <NotificationDialog
                        close={this.closeNotiDialog}
                        dialogcontent={dialogcontent}
                    />
                    : null
                }
            </Grid>
        )
    }
}

CartItem.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CartItem);