import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import toast, { Toaster } from 'react-hot-toast';
import instance from '../../../AxiosConfig';


const styles = theme => ({
    paper: {
        marginTop: theme.spacing(0),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        '& > *': {
            margin: theme.spacing(0),
        },
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "100%",
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(5),
    },
});

class AddVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbRole: [],//mang luu tblRole
            name: "", //tên của voucher,
            code: "", //mã code
            description: "", //mô tả
            dateStart: "",
            dateEnd: "",
            discount: 0,
            icon: "",
            image: "",
            limited: "0", //0 là k giới hạn, 1 là giới hạn
            slVoucher: 0,// số lượng voucher
            max: 0,//tối đa được giảm bn
            validFrom: 0,//đơn hàng tối thiểu bn thì đc áp dụng code
            role: "",//từ thành viên nào được áp dụng code
        }
    }

    onSubmit = (event) => {
        event.preventDefault(); //k cho trình duyệt reload lại khi bấm submit
        var slvoucher = 0;
        if (this.state.limited === "0") {
            slvoucher = -1
        } else {
            slvoucher = this.state.slVoucher;
        }
        instance.post('/voucher', {
            Code: this.state.code,
            DateStart: this.formatDay(this.state.dateStart),
            DateEnd: this.formatDay(this.state.dateEnd),
            Description: this.state.description,
            Discount: (this.state.discount + "%"),
            Icon: this.state.icon,
            Image: this.state.image,
            Limited: Number(slvoucher),
            Max: Number(this.state.max),
            Name: this.state.name,
            Role: this.state.role,
            ValidFrom: Number(this.state.validFrom),
            Time: Date.now(),
        }).then((res) => {
            toast.success("Đã thêm voucher khuyến mãi");
        }).catch(() => {
            toast.error('Thêm thất bại')
        })
    }

    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
        console.log(this.state)
    }

    formatDay(date) {
        var d = '';
        var m = '';
        var y = '';
        for (let i = 0; i < 5; i++) {
            if (date[i] === '-') {
                y = date.slice(0, i);
                for (let j = i + 1; j < date.length; j++) {
                    if (date[j] === '-') {
                        m = date.slice(i + 1, j);
                        d = date.slice(j + 1, date.length);
                    }
                }
            }
        }
        return d + '/' + m + "/" + y;
    }

    componentDidMount = async () => {
        this.getRoles();
    }
    getRoles = () => {
        instance.get('/role')
            .then(res => {
                this.setState({
                    fbRole: res.data,
                })
            })
    }
    render() {
        var { dateStart, fbRole } = this.state;
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <div className={classes.paper}>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        {/* Tên Voucher */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Tên Voucher"
                            name="name"

                            onChange={this.onChange}
                            value={this.state.name}
                        />
                        {/* Mã voucher */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Mã Voucher"
                            name="code"

                            onChange={this.onChange}
                            value={this.state.code}
                        />
                        {/* Mô tả */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Mô tả"
                            name="description"

                            onChange={this.onChange}
                            value={this.state.description}
                        />

                        <Grid container spacing={7}>
                            <Grid item xs={6}>
                                {/* ngày bắt đầu */}
                                <TextField
                                    label="Ngày bắt đầu"
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.onChange}
                                    name="dateStart"
                                    value={this.state.dateStart}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {/* ngày kết thúc */}
                                <TextField
                                    label="Ngày kết thúc"
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.onChange}
                                    name="dateEnd"
                                    value={this.state.dateEnd}
                                />
                            </Grid>
                        </Grid>

                        {/* discount bn % */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Số % giảm"
                            name="discount"

                            onChange={this.onChange}
                            value={this.state.discount}
                        />
                        {/* icon */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Link icon"
                            name="icon"

                            onChange={this.onChange}
                            value={this.state.icon}
                        />
                        {/* discount bn % */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Link hình"
                            name="image"

                            onChange={this.onChange}
                            value={this.state.image}
                        />

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                {/* limited */}
                                <FormControl className={classes.formControl} style={{ marginTop: 8 }}>
                                    <InputLabel >Giới hạn voucher</InputLabel>
                                    <NativeSelect
                                        value={this.state.limited}
                                        defaultValue={this.state.limited}
                                        inputProps={{
                                            name: 'limited',
                                        }}
                                        onChange={this.onChange}
                                    >
                                        <option aria-label="None" value={0}>Không giới hạn</option>
                                        <option aria-label="None" value={1}>Giới hạn</option>
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {this.state.limited === "1" ?
                                    < TextField
                                        size="small"
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Số lượng voucher"
                                        name="slVoucher"
                                        onChange={this.onChange}
                                        value={this.state.slVoucher}
                                    /> : ""}
                            </Grid>
                        </Grid>
                        {/* max đc giảm */}
                        < TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Số tiền tối đa được giảm"
                            name="max"
                            onChange={this.onChange}
                            value={this.state.max}
                        />
                        {/* max đc giảm */}
                        < TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Giá trị đơn hàng được sử dụng voucher"
                            name="validFrom"
                            onChange={this.onChange}
                            value={this.state.validFrom}
                        />
                        {/* Từ thành viên nào được áp dụng */}
                        <FormControl className={classes.formControl}>
                            <InputLabel >Từ thành viên nào được áp dụng</InputLabel>
                            <NativeSelect
                                value={this.state.role}
                                defaultValue={this.state.role}
                                inputProps={{
                                    name: 'role',
                                }}
                                onChange={this.onChange}
                            >
                                <option aria-label="None" value="" />
                                {fbRole.map((x, index) => {
                                    return <option key={index} value={x.key}>{x.Name}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                        {/* nút xác nhận */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Xác nhận
                        </Button>
                    </form>
                </div>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        //Define default options
                        className: '',
                        style: {
                            margin: '40px',
                            background: '#00e676',
                            color: 'white',
                            zIndex: 1,
                        },
                        duration: 5000,
                        // Default options for specific types
                        success: {
                            duration: 3000,
                            // theme: {
                            //     primary: 'yellow',
                            //     secondary: 'yellow',
                            // },
                            style: {
                                margin: '100px',
                                background: '#00e676',
                                color: 'white',
                                zIndex: 1,
                            },
                        },
                        error: {
                            duration: 3000,
                            style: {
                                margin: '100px',
                                background: 'red',
                                color: 'white',
                                zIndex: 1,
                            },
                        },
                    }} />
            </Container>
        )
    }
}

AddVoucher.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AddVoucher);