import React, { Component } from 'react';
import fbApp from '../../../Firebase';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'react-bootstrap/Image'
import Divider from '@material-ui/core/Divider';
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class DetailVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            voucher: {},
            time: 0,
            donvi: "",
            role: []
        }
    }
    componentDidMount = async () => {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        var slug = this.props.match.params.slug;
        await this.setState({
            key: slug,
        })
        this.getData(slug)
    }
    getData = (id) => {
        instance.get('/voucher/' + id)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        voucher: res.data.detail,
                        role: res.data.role,
                    })
                    var time = this.isExpired(res.data.detail.DateEnd)
                    if (time / 86400000 >= 1) {
                        this.setState({
                            time: Math.floor(time / 86400000),
                            donvi: "ngày"
                        })
                    } else if (time / 3600000 >= 1) {
                        this.setState({
                            time: Math.floor(time / 3600000),
                            donvi: "giờ"
                        })
                    }
                    else if (time / 60000 >= 1) {
                        this.setState({
                            time: Math.floor(time / 60000),
                            donvi: "phút"
                        })
                    }
                }
            })
    }
    isExpired = (day) => {
        var d = this.tranDay(day) + 86400000;
        var today = (new Date().getTime());
        return d - today;
    }

    tranDay = (ngay) => {
        var d = '';
        var m = '';
        var y = '';
        for (let i = 0; i < 3; i++) {
            if (ngay[i] === '/') {
                d = ngay.slice(0, i);
                for (let j = i + 1; j < ngay.length; j++) {
                    if (ngay[j] === '/') {
                        m = ngay.slice(i + 1, j);
                        y = ngay.slice(j + 1, ngay.length);
                    }
                }
            }
        }
        return (new Date(y, m - 1, d)).getTime();
    }

    render() {
        const { classes } = this.props;
        var slug = this.props.match.params.slug;
        var { voucher, time, donvi, role } = this.state;
        // console.log(time + " " + donvi)
        return (
            <div className={classes.root} style={{ minHeight: 503, backgroundColor: "#f0f0f0" }}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div
                            className={classes.well}
                            style={{ margin: 5, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 700, marginLeft: "35%", marginRight: "35%" }}
                        >
                            <div style={{ margin: 5, height: "50%", width: "96%" }}>
                                <Image style={{ margin: 5, height: "100%", width: "100% " }} src={voucher.Image} fluid />
                            </div>
                            <Divider />
                            <Typography color="error" variant="h6" gutterBottom align="center">
                                {voucher.Name}
                            </Typography>
                            <div style={{ background: "lightgreen", marginLeft: "30%", marginRight: "30%", marginBottom: 30, borderRadius: 10 }}>
                                <Typography variant="subtitle2" gutterBottom align="center">
                                    Hết hạn sau {time} {donvi}
                                </Typography>
                            </div>
                            <Grid container spacing={0} >
                                <Grid item xs={7} style={{ paddingLeft: 10 }}>
                                    <Typography variant="subtitle2" gutterBottom align="center">
                                        Thành viên áp dụng
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        - {role.RoleName}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        - Các mức thành viên cao hơn(nếu có)
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} style={{ borderLeft: `2px solid #f0f0f0`, paddingLeft: 10 }}>
                                    <Typography variant="subtitle2" gutterBottom align="center">
                                        Hiệu lực
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        - Từ ngày {voucher.DateStart}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        - Đến ngày {voucher.DateEnd}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Typography variant="h6" gutterBottom align="center">
                                Mô tả khuyến mãi
                            </Typography>
                            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                                <Typography variant="body2" gutterBottom>
                                    - {voucher.Description}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {voucher.Limited === -1 ? "- Khuyến mãi này không giới hạn số lượng" : `- Số lượng khuyến mãi còn lại: ${voucher.Limited} cái`}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    - Khuyến mãi này chỉ áp dụng trên giá trị đơn hàng, không áp dụng trên phí giao hàng
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

DetailVoucher.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DetailVoucher);