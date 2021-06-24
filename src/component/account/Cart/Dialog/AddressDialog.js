import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import vn from '../../vn.json';
import DialogContent from '@material-ui/core/DialogContent';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class AddressDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            name: '',
            phone: '',
            city: '',
            ward: '',
            district: '',
            address: '',
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
        const { name, address, phone, ward, city, district } = this.props;
        this.setState({
            name, address, phone, ward, city, district,
        }, () => {
            this.setState({
                loading: false
            })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.district != this.state.district && this.state.loading == false) {
            this.setState({
                ward: "",
                address: ''
            })
        }
        if (prevState.city != this.state.city && this.state.loading == false) {
            this.setState({
                ward: "",
                address: '',
                district: ''
            })
        }
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    save = () => {
        const { name, address, phone, ward, city, district } = this.state;
        if (ward == "" || name.trim() == '' || phone.trim() == '' || address.trim() == '') {
            alert('Vui lòng điền đầy đủ thông tin nhận hàng');
        } else {
            if (phone.length == 10 && this.ktraSDT(phone) == true) {
                alert('Thông tin đã được lưu');
                this.props.save(name, address, phone, ward, city, district);
            } else {
                alert('Vui lòng nhập đúng định dạng số điện thoại');
            }
        }
    }
    ktraSDT(sdt) {
        for (var x of sdt) {
            if (x.charCodeAt(0) > 57 || x.charCodeAt(0) < 48) {
                return false;
            }
        }
        return true;
    }
    render() {
        const { name, address, phone, ward, city, district } = this.state;
        var vn1 = vn;
        var quanhuyen = vn1.filter(x => {
            return x.name === city;
        });
        //Truyền các huyện vô mảng huyen[]
        var huyen = []
        quanhuyen.map((x) => {
            x.huyen.forEach(function (item) {
                huyen.push(item)
            });
        });
        //Truyền các huyện vô mảng xa[]
        var xa = [];
        vn.forEach((tinh) => {
            if (tinh.name === city) {
                tinh.huyen.forEach((huyen) => {
                    if (huyen.name === district) {
                        huyen.xa.forEach((x) => {
                            xa.push(x.name);
                        })
                    }
                })
            }
        });
        return (
            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => this.props.close()}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">THAY ĐỎI ĐỊA CHỈ NHẬN HÀNG</DialogTitle>
                <DialogContent>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Tên người nhận"
                        name="name"
                        autoFocus
                        onChange={this.onChange}
                        value={this.state.name}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Số điện thoại nhận hàng"
                        name="phone"
                        onChange={this.onChange}
                        value={this.state.phone}
                    />
                    <FormControl fullWidth style={{ marginBlock: 7 }}>
                        <InputLabel >Tỉnh/TP</InputLabel>
                        <NativeSelect
                            value={this.state.city}
                            defaultValue={this.state.city}
                            inputProps={{
                                name: 'city',
                            }}
                            onChange={this.onChange}
                        >
                            <option aria-label="None" value="" />
                            {vn.map((x, index) => {
                                return <option key={index} value={x.name}>{x.name}</option>
                            })}
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth style={{ marginBlock: 7 }}>
                        <InputLabel >Quận/Huyện</InputLabel>
                        <NativeSelect
                            value={this.state.district}
                            defaultValue={this.state.district}
                            inputProps={{
                                name: 'district',
                            }}
                            onChange={this.onChange}
                        >
                            <option aria-label="None" value="" />
                            {huyen.map((item, index) => {
                                return <option key={index} value={item.name}>{item.name}</option>
                            })}
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth style={{ marginBlock: 7 }}>
                        <InputLabel >Phường/Xã</InputLabel>
                        <NativeSelect
                            value={this.state.ward}
                            defaultValue={this.state.ward}
                            inputProps={{
                                name: 'ward',
                            }}
                            onChange={this.onChange}
                        >
                            <option aria-label="None" value="" />
                            {xa.map((x, index) => {
                                return <option key={index} value={x}>{x}</option>
                            })}
                        </NativeSelect>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Địa chỉ nhận hàng"
                        name="address"
                        onChange={this.onChange}
                        value={this.state.address}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.props.close();
                    }} variant="contained" color="primary">
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: 'white'
                        }}>
                            HỦY THAY ĐỔI
                        </div>
                    </Button>
                    <Button onClick={() => {
                        this.save();
                        this.props.close();
                    }} variant="contained" color="primary">
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: 'white'
                        }}>
                            LƯU THAY ĐỔI
                        </div>
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

AddressDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AddressDialog);