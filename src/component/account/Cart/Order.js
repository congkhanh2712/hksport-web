import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import instance from '../../../AxiosConfig';
import vn from '../vn.json';
import AddressDialog from './Dialog/AddressDialog';
import ShipDialog from './Dialog/ShipDialog';
import VoucherDialog from './Dialog/VoucherDialog';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import NotificationDialog from './Dialog/NotificationDialog';
import OrderSuccessDialog from './Dialog/OrderSuccessDialog';


const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
    button: {
        fontFamily: `Arial, Helvetica, sans-serif`,
    }
});

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            money: -1,
            loading: true,
            normalShip: true,
            fastShip: false,
            payment: true,
            name: '',
            phone: '',
            point: '',
            pointAvailable: '',
            city: '',
            ward: '',
            district: '',
            address: '',
            benefit: {},
            normalPrice: 0,
            fastPrice: 1,
            roleList: [],
            pointUsed: 0,
            isEnable: false,
            shipDialog: false,
            addressDialog: false,
            voucherDialog: false,
            notiDialog: false,
            distance: 0,
            note: '',
            voucher: null,
            voucherAvailable: false,
            discount: 0,
            successDialog: false,
        }
    }

    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.getUserData();
        this.setState({
            money: this.props.money,
        })
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.money != this.props.money) {
            this.setState({
                money: this.props.money
            }, () => {
                if (this.state.voucher != null) {
                    this.phanTramDiscount(this.state.voucher);
                }
            })
        }
    }
    getRoleData(role, c, d, w) {
        instance.get('/role')
            .then(res => {
                res.data.forEach(e => {
                    if (e.key == role) {
                        this.setState({
                            benefit: e.Benefit,
                            normalPrice: this.getShipPrice(e.Benefit, c, d, w, 0),
                            fastPrice: this.getShipPrice(e.Benefit, c, d, w, 1),
                        })
                    }
                })
                this.setState({
                    roleList: res.data
                })
            })
    }
    //Tính tiền ship
    getShipPrice(b, city, district, ward, type) {
        //Lấy tọa độ nơi nhận
        var location = '';
        for (let i = 0; i < vn.length; i++) {
            if (vn[i].name == city) {
                for (let j = 0; j < vn[i].huyen.length; j++) {
                    if (vn[i].huyen[j].name == district) {
                        for (let z = 0; z < vn[i].huyen[j].xa.length; z++) {
                            if (vn[i].huyen[j].xa[z].name == ward) {
                                location = vn[i].huyen[j].xa[z].location;
                                z = vn[i].huyen[j].xa.length;
                            }
                        }
                        j = vn[i].huyen.length;
                    }
                }
                i = vn.length;
            }
        }
        var distance = this.getDistanceFromLatLonInKm(10.838650, 106.776147, this.getLat(location), this.getLong(location));
        this.setState({
            distance
        })
        if (type == 0) {
            if (city != "Thành phố Hồ Chí Minh") {
                if (city.toLowerCase().indexOf('thành phố') != -1 || district.toLowerCase().indexOf('thành phố')) {
                    return 35000;
                } else {
                    return 50000;
                }
            } else {
                return 22000;
            }
        } else {
            if (distance > b.ShipDistance) {
                if (this.state.normalShip != true) {
                    this.setState({
                        normalShip: true,
                        fastShip: false
                    })
                }
                return 0;
            }
            else {
                if (b.Freeship == false) {
                    if (distance < 2) {
                        return 15000;
                    }
                    else {
                        return (parseInt(15000 + (distance - 2) * 2500));
                    }
                }
                else return 0;
            }

        }
    }
    //Lấy tọa độ địa chỉ khách hàng
    getLat(str) {
        for (var i = 0; i < str.length; i++) {
            if (str[i] === "-") {
                return parseFloat(str.slice(0, i));
            }
        }
    }
    getLong(str) {
        for (var i = 0; i < str.length; i++) {
            if (str[i] === "-") {
                return parseFloat(str.slice(i + 1, str.length));
            }
        }
    }
    //Tính khoảng cách giữa 2 điểm
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1) * (Math.PI / 180);  // deg2rad below
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    getUserData() {
        this.setState({
            loading: true
        })
        instance.get('/auth/')
            .then(res => {
                this.getRoleData(res.data.Role, res.data.Address.City, res.data.Address.District, res.data.Address.Ward);
                this.setState({
                    name: res.data.Name,
                    phone: res.data.Phone_Number,
                    point: res.data.Point,
                    pointAvailable: res.data.PointAvailable,
                    city: res.data.Address.City,
                    ward: res.data.Address.Ward,
                    district: res.data.Address.District,
                    address: res.data.Address.Detail,
                    loading: false,
                })
            })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (name == 'normalShip') {
            this.setState({
                normalShip: value,
                fastShip: !value
            })
        } else if (name == 'fastShip') {
            this.setState({
                normalShip: !value,
                fastShip: value
            })
        } else if (name == 'isEnable') {
            if (value == true) {
                if (this.state.money - this.state.discount < this.state.pointAvailable) {
                    this.setState({
                        [name]: value,
                        pointUsed: this.state.money - this.state.discount
                    })
                } else {
                    this.setState({
                        [name]: value,
                        pointUsed: this.state.pointAvailable
                    })
                }
            } else {
                this.setState({
                    [name]: value,
                    pointUsed: 0
                })
            }
        } else {
            this.setState({
                [name]: value
            });
        }
    }
    closeShipDialog = () => {
        this.setState({
            shipDialog: false
        })
    }
    closeVoucherDialog = () => {
        this.setState({
            voucherDialog: false
        })
    }
    closeAddressDialog = () => {
        this.setState({
            addressDialog: false
        })
    }
    saveChanges = (name, address, phone, ward, city, district) => {
        const { benefit } = this.state;
        this.setState({
            name, address, phone, ward, city, district,
            normalPrice: this.getShipPrice(benefit, city, district, ward, 0),
            fastPrice: this.getShipPrice(benefit, city, district, ward, 1),
        })
    }
    phanTramDiscount(v) {
        let value = 0
        const { money } = this.state;
        if (money >= v.ValidFrom) {
            this.setState({
                voucherAvailable: true,
            })
            if (money * (v.Discount.slice(0, v.Discount.length - 1) / 100) < v.Max) {
                value = money * (v.Discount.slice(0, v.Discount.length - 1) / 100);
            } else {
                value = v.Max;
            }
        } else {
            this.setState({
                voucherAvailable: false,
            })
        }
        this.setState({
            discount: value
        })
    }
    useVoucher = (item) => {
        if (item != null) {
            this.setState({
                voucher: item,
            })
            this.phanTramDiscount(item);
        } else {
            this.setState({
                voucher: null,
                voucherAvailable: false,
                discount: 0
            })
        }
    }
    orderClick = async () => {
        const { cartItems, errItems } = this.props;
        const { money, normalShip, note, discount, voucher, voucherAvailable,
            name, phone, address, ward, district, city, normalPrice, fastPrice,
            pointUsed, benefit, pointAvailable } = this.state;
        if (errItems.length != 0) {
            this.setState({
                notiDialog: true
            })
        } else {
            var payments = 'Thanh toán khi nhận hàng';
            var shiptype = 'Giao hàng tiêu chuẩn';
            var shipmoney = normalPrice;
            var km = '';
            if (normalShip == false) {
                shipmoney = fastPrice;
                shiptype = 'Giao hàng hỏa tốc'
            }
            if (voucherAvailable == true && voucher != null) {
                km = voucher.Code;
            }
            //Set lại số lượng từng sản phẩm
            await instance.put('/products', {
                orderdetail: cartItems,
                type: 1,
            }).then(res => {
                if (res.status == 200) {
                    //Set trạng thái giỏ hàng thành false
                    instance.delete('/cart')
                }
            })
            //Set thông tin đơn hàng
            instance.post('/order/create', {
                payment: payments, paystatus: false, shiptype, cartItems,
                shipmoney, money, discount, benefit, pointUsed,
                note, km, name, phone, city, address, ward, district, pointAvailable
            }).then(res => {
                if (res.status == 200) {
                    this.setState({
                        successDialog: true,
                    })
                }
            })
        }
    }
    render() {
        const { classes } = this.props;
        const { loading, money, normalShip, fastShip, payment, note, roleList, discount, notiDialog, successDialog,
            name, phone, address, ward, district, city, normalPrice, fastPrice, voucherDialog, voucher, voucherAvailable,
            point, pointAvailable, pointUsed, isEnable, shipDialog, benefit, addressDialog, distance } = this.state;
        return (
            <Box style={{ width: '28%' }}>
                <Typography component="h1" variant="h5"
                    style={{ width: '100%', textAlign: 'left', fontWeight: 'bold' }}
                    gutterBottom>
                    ĐẶT HÀNG
                </Typography>
                <Grid
                    className={classes.well}
                    container
                    direction='row' justify='center'
                    alignItems={loading == true ? 'center' : 'flex-start'}
                    style={{
                        borderRadius: 5, paddingBlock: 10,
                        minHeight: 420, paddingInline: 10
                    }}>
                    {loading == false
                        ? <Grid container item
                            direction='column'>
                            {/* THÔNG TIN NHẬN HÀNG */}
                            <Box borderBottom={0.1}
                                style={{ paddingInline: 10 }}>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        Thông tin nhận hàng
                                    </Typography>
                                    <ButtonGroup variant="text" color="primary">
                                        <Button
                                            onClick={() => {
                                                this.setState({
                                                    addressDialog: true
                                                })
                                            }}
                                            color="primary">
                                            <div style={{
                                                fontFamily: `Arial, Helvetica, sans-serif`,
                                                color: '#0072E1'
                                            }}>
                                                THAY ĐỔI
                                            </div>
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                this.getUserData();
                                            }}
                                            color="primary">
                                            <div style={{
                                                fontFamily: `Arial, Helvetica, sans-serif`,
                                                color: '#0072E1'
                                            }}>
                                                mặc định
                                            </div>
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Typography variant="subtitle1"
                                    style={{ fontWeight: 'bold' }}>
                                    {name} - {phone}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Địa chỉ: {address}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Phường/ Xã: {ward}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Quận/ Huyện: {district}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Thành phố/ Tỉnh: {city}
                                </Typography>
                            </Box>
                            {/* HÌNH THỨC VẬN CHUYỂN */}
                            <Box borderBottom={0.1}
                                style={{ padding: 10 }}>
                                <FormControl component="fieldset" required className={classes.formControl}>
                                    <FormLabel component="legend"
                                        style={{ color: 'black', fontWeight: 'bold' }}>
                                        Hình thức vận chuyển
                                    </FormLabel>
                                    <div style={{
                                        fontFamily: `Arial, Helvetica, sans-serif`,
                                        color: '#0072E1', cursor: 'pointer', fontSize: 15
                                    }} onClick={() => { this.setState({ shipDialog: true }) }}>
                                        Xem thông tin về hình thức vận chuyển
                                    </div>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={normalShip}
                                                    onChange={this.onChange}
                                                    name="normalShip"
                                                    color="primary"
                                                />}
                                            label={`Giao hàng tiêu chuẩn 
                                            ( ${normalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ )`} />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={fastShip}
                                                    onChange={this.onChange}
                                                    disabled={benefit.ShipDistance >= distance ? false : true}
                                                    name="fastShip"
                                                    color="primary"
                                                />}
                                            label={`Giao hàng hỏa tốc 
                                                ( ${fastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ )`} />
                                    </FormGroup>
                                    <FormHelperText>Vui lòng chọn 1 trong 2</FormHelperText>
                                </FormControl>
                            </Box>
                            {/* HÌNH THỨC THANH TOÁN */}
                            <Box borderBottom={0.1}
                                style={{ padding: 10 }}>
                                <FormControl component="fieldset"
                                    error={!payment}
                                    required className={classes.formControl}>
                                    <FormLabel component="legend"
                                        style={{ color: 'black', fontWeight: 'bold' }}>
                                        Hình thức thanh toán
                                    </FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={payment}
                                                    onChange={this.onChange}
                                                    name="payment"
                                                    color="primary"
                                                />}
                                            label="Thanh toán khi nhận hàng" />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={false}
                                                    color="primary"
                                                    disabled={true}
                                                />}
                                            label="Thanh toán trực tuyến (qua Zalopay)" />
                                    </FormGroup>
                                    <FormHelperText>Vui lòng chọn 1 trong 2</FormHelperText>
                                </FormControl>
                            </Box>
                            {/* CHI PHÍ */}
                            <Box
                                borderBottom={0.1}
                                style={{ padding: 10 }}>
                                <Typography variant="h6">
                                    Tổng chi phí
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tổng tiền hàng: {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tiền vận chuyển: {normalShip == true
                                        ? normalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                        : fastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vnđ
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tiền giảm từ voucher: -{discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tiền giảm từ điểm tích lũy: -{
                                        pointUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vnđ
                                </Typography>
                                <Typography variant="subtitle1"
                                    style={{ fontWeight: 'bold', fontSize: 17 }}
                                    gutterBottom>
                                    Tổng thanh toán: {normalShip == true
                                        ? (normalPrice + money - pointUsed - discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                        : (fastPrice + money - pointUsed - discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vnđ
                                </Typography>
                            </Box>
                            {/* TÙY CHỌN */}
                            <Box style={{ padding: 10 }}>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        Ưu đãi:
                                    </Typography>
                                    <Button
                                        onClick={() => {
                                            this.setState({ voucherDialog: true })
                                        }}
                                        color="primary">
                                        {voucher != null
                                            ? voucherAvailable
                                                ? <div style={{
                                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                                    color: '#0072E1'
                                                }}>
                                                    Bạn đang sử dụng {voucher.Code}
                                                </div>
                                                : <div style={{
                                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                                    color: '#FF5F38'
                                                }}>
                                                    Bạn chưa đủ điều kiện sử dụng {voucher.Code}
                                                </div>
                                            : <div style={{
                                                fontFamily: `Arial, Helvetica, sans-serif`,
                                                color: '#0072E1'
                                            }}>
                                                chọn ưu đãi
                                            </div>}
                                    </Button>
                                </Grid>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        Dùng điểm tích lũy
                                        [ {pointAvailable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ] :
                                    </Typography>
                                    <Switch
                                        checked={isEnable}
                                        onChange={this.onChange}
                                        name="isEnable"
                                        color="primary"
                                    />
                                </Grid>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Ghi chú"
                                    name="note"
                                    multiline
                                    rowsMax={3}
                                    placeholder="Nhập ghi chú bạn muốn gửi đến cửa hàng...."
                                    onChange={this.onChange}
                                    value={note}
                                />
                            </Box>
                            <Button variant="contained"
                                disabled={loading}
                                onClick={() => this.orderClick()}
                                color="primary" component="span">
                                đặt hàng
                            </Button>
                        </Grid>
                        : <CircularProgress />
                    }
                </Grid>
                {shipDialog
                    ? <ShipDialog close={this.closeShipDialog} distance={benefit.ShipDistance} />
                    : null
                }
                {addressDialog
                    ? <AddressDialog
                        close={this.closeAddressDialog}
                        save={this.saveChanges}
                        name={name}
                        phone={phone}
                        address={address}
                        ward={ward}
                        district={district}
                        city={city} />
                    : null
                }
                {voucherDialog
                    ? <VoucherDialog
                        point={point}
                        roleList={roleList}
                        useVoucher={this.useVoucher}
                        close={this.closeVoucherDialog} />
                    : null
                }
                {notiDialog
                    ? <NotificationDialog
                        close={() => {
                            this.setState({
                                notiDialog: false,
                            })
                        }}
                        dialogcontent={`Giỏ hàng của bạn chứa sản phẩm không hợp lệ. 
                        Vui lòng kiểm tra lại!`}
                    />
                    : null
                }
                {successDialog
                    ? <OrderSuccessDialog />
                    : null
                }
            </Box>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);