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
    //T??nh ti???n ship
    getShipPrice(b, city, district, ward, type) {
        //L???y t???a ????? n??i nh???n
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
            if (city != "Th??nh ph??? H??? Ch?? Minh") {
                if (city.toLowerCase().indexOf('th??nh ph???') != -1 || district.toLowerCase().indexOf('th??nh ph???')) {
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
    //L???y t???a ????? ?????a ch??? kh??ch h??ng
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
    //T??nh kho???ng c??ch gi???a 2 ??i???m
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
            var payments = 'Thanh to??n khi nh???n h??ng';
            var shiptype = 'Giao h??ng ti??u chu???n';
            var shipmoney = normalPrice;
            var km = '';
            if (normalShip == false) {
                shipmoney = fastPrice;
                shiptype = 'Giao h??ng h???a t???c'
            }
            if (voucherAvailable == true && voucher != null) {
                km = voucher.Code;
            }
            //Set l???i s??? l?????ng t???ng s???n ph???m
            await instance.put('/products', {
                orderdetail: cartItems,
                type: 1,
            }).then(res => {
                if (res.status == 200) {
                    //Set tr???ng th??i gi??? h??ng th??nh false
                    instance.delete('/cart')
                }
            })
            //Set th??ng tin ????n h??ng
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
                    ?????T H??NG
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
                            {/* TH??NG TIN NH???N H??NG */}
                            <Box borderBottom={0.1}
                                style={{ paddingInline: 10 }}>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        Th??ng tin nh???n h??ng
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
                                                THAY ?????I
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
                                                m???c ?????nh
                                            </div>
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Typography variant="subtitle1"
                                    style={{ fontWeight: 'bold' }}>
                                    {name} - {phone}
                                </Typography>
                                <Typography variant="subtitle1">
                                    ?????a ch???: {address}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Ph?????ng/ X??: {ward}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Qu???n/ Huy???n: {district}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Th??nh ph???/ T???nh: {city}
                                </Typography>
                            </Box>
                            {/* H??NH TH???C V???N CHUY???N */}
                            <Box borderBottom={0.1}
                                style={{ padding: 10 }}>
                                <FormControl component="fieldset" required className={classes.formControl}>
                                    <FormLabel component="legend"
                                        style={{ color: 'black', fontWeight: 'bold' }}>
                                        H??nh th???c v???n chuy???n
                                    </FormLabel>
                                    <div style={{
                                        fontFamily: `Arial, Helvetica, sans-serif`,
                                        color: '#0072E1', cursor: 'pointer', fontSize: 15
                                    }} onClick={() => { this.setState({ shipDialog: true }) }}>
                                        Xem th??ng tin v??? h??nh th???c v???n chuy???n
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
                                            label={`Giao h??ng ti??u chu???n 
                                            ( ${normalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vn?? )`} />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={fastShip}
                                                    onChange={this.onChange}
                                                    disabled={benefit.ShipDistance >= distance ? false : true}
                                                    name="fastShip"
                                                    color="primary"
                                                />}
                                            label={`Giao h??ng h???a t???c 
                                                ( ${fastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vn?? )`} />
                                    </FormGroup>
                                    <FormHelperText>Vui l??ng ch???n 1 trong 2</FormHelperText>
                                </FormControl>
                            </Box>
                            {/* H??NH TH???C THANH TO??N */}
                            <Box borderBottom={0.1}
                                style={{ padding: 10 }}>
                                <FormControl component="fieldset"
                                    error={!payment}
                                    required className={classes.formControl}>
                                    <FormLabel component="legend"
                                        style={{ color: 'black', fontWeight: 'bold' }}>
                                        H??nh th???c thanh to??n
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
                                            label="Thanh to??n khi nh???n h??ng" />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={false}
                                                    color="primary"
                                                    disabled={true}
                                                />}
                                            label="Thanh to??n tr???c tuy???n (qua Zalopay)" />
                                    </FormGroup>
                                    <FormHelperText>Vui l??ng ch???n 1 trong 2</FormHelperText>
                                </FormControl>
                            </Box>
                            {/* CHI PH?? */}
                            <Box
                                borderBottom={0.1}
                                style={{ padding: 10 }}>
                                <Typography variant="h6">
                                    T???ng chi ph??
                                </Typography>
                                <Typography variant="subtitle1">
                                    T???ng ti???n h??ng: {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vn??
                                </Typography>
                                <Typography variant="subtitle1">
                                    Ti???n v???n chuy???n: {normalShip == true
                                        ? normalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                        : fastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vn??
                                </Typography>
                                <Typography variant="subtitle1">
                                    Ti???n gi???m t??? voucher: -{discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vn??
                                </Typography>
                                <Typography variant="subtitle1">
                                    Ti???n gi???m t??? ??i???m t??ch l??y: -{
                                        pointUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vn??
                                </Typography>
                                <Typography variant="subtitle1"
                                    style={{ fontWeight: 'bold', fontSize: 17 }}
                                    gutterBottom>
                                    T???ng thanh to??n: {normalShip == true
                                        ? (normalPrice + money - pointUsed - discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                        : (fastPrice + money - pointUsed - discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vn??
                                </Typography>
                            </Box>
                            {/* T??Y CH???N */}
                            <Box style={{ padding: 10 }}>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        ??u ????i:
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
                                                    B???n ??ang s??? d???ng {voucher.Code}
                                                </div>
                                                : <div style={{
                                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                                    color: '#FF5F38'
                                                }}>
                                                    B???n ch??a ????? ??i???u ki???n s??? d???ng {voucher.Code}
                                                </div>
                                            : <div style={{
                                                fontFamily: `Arial, Helvetica, sans-serif`,
                                                color: '#0072E1'
                                            }}>
                                                ch???n ??u ????i
                                            </div>}
                                    </Button>
                                </Grid>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        D??ng ??i???m t??ch l??y
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
                                    label="Ghi ch??"
                                    name="note"
                                    multiline
                                    rowsMax={3}
                                    placeholder="Nh???p ghi ch?? b???n mu???n g???i ?????n c???a h??ng...."
                                    onChange={this.onChange}
                                    value={note}
                                />
                            </Box>
                            <Button variant="contained"
                                disabled={loading}
                                onClick={() => this.orderClick()}
                                color="primary" component="span">
                                ?????t h??ng
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
                        dialogcontent={`Gi??? h??ng c???a b???n ch???a s???n ph???m kh??ng h???p l???. 
                        Vui l??ng ki???m tra l???i!`}
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