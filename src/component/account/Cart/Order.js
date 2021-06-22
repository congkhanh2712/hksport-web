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
            voucher: {},
            normalPrice: 0,
            fastPrice: 0,
            roleList: [],
            pointUsed: 0,
            isEnable: false,
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
            loading: false
        })
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.money != this.props.money) {
            this.setState({
                money: this.props.money
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
                            normalPrice: 0,
                            fastPrice: 0,
                        })
                    }
                })
                this.setState({
                    roleList: res.data
                })
            })
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
                    address: res.data.Address.Detail
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
                if (this.state.money < this.state.pointAvailable) {
                    this.setState({
                        [name]: value,
                        pointUsed: this.state.money
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
    render() {
        const { classes } = this.props;
        const { width, height, loading, money, normalShip, fastShip, payment,
            name, phone, address, ward, district, city, normalPrice, fastPrice,
            point, pointAvailable, pointUsed, isEnable } = this.state;
        return (
            <Box style={{ width: '25%' }}>
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
                                    <Button
                                        color="primary">
                                        THAY ĐỔI
                                    </Button>
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
                                            (${normalPrice} vnđ)`} />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={fastShip}
                                                    onChange={this.onChange}
                                                    name="fastShip"
                                                    color="primary"
                                                />}
                                            label={`Giao hàng tiêu hỏa tốc 
                                                (${fastPrice} vnđ)`} />
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
                                    Tiền giảm từ voucher: -0 vnđ
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
                                        ? (normalPrice + money - pointUsed).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                        : (fastPrice + money - pointUsed).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    } vnđ
                                </Typography>
                            </Box>
                            <Box style={{ padding: 10 }}>
                                <Grid container item
                                    direction='row' justify='space-between'>
                                    <Typography variant="h6">
                                        Ưu đãi:
                                    </Typography>
                                    <Button
                                        color="primary">
                                        Chọn ưu đãi
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
                            </Box>
                            <Button variant="contained" color="primary" component="span">
                                đặt hàng
                            </Button>
                        </Grid>
                        : <CircularProgress />
                    }
                </Grid>
            </Box>
        )
    }
}

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Cart);