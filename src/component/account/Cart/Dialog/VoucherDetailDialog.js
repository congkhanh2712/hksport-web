import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import instance from '../../../../AxiosConfig';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});


class VoucherDetailDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            role: null
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.getData();
    }
    getData = () => {
        const { item } = this.props;
        instance.get('/role/' + item.Role)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        role: res.data
                    })
                }
            })
    }
    render() {
        const { item } = this.props;
        const { role } = this.state;
        return (
            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                onClose={() => this.props.close()}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <Typography variant="h5" align='center'
                    style={{ marginBlock: 15 }}>
                    CHI TIẾT VOUCHER
                </Typography>
                <DialogContent>
                    <Grid
                        container item xs={12}
                        style={{ marginBottom: 20 }}>
                        <Grid container item xs={3}
                            direction='column'
                            alignItems='center'>
                            <img src={item.Image} width={65} height={65} style={{ backgroundColor: '#CBF19A' }} />
                        </Grid>
                        <Grid container item xs={9}
                            direction='column'
                            justify='flex-start'>
                            <Typography variant="h6">
                                {item.Name}
                            </Typography>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Mã CODE:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.Code}
                                </div>
                            </Grid>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Giảm giá:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.Discount}
                                </div>
                            </Grid>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Tối đa:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.Max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                                </div>
                            </Grid>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Áp dụng với đơn hàng tối thiểu:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.ValidFrom.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                                </div>
                            </Grid>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Ngày bắt đầu:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.DateStart}
                                </div>
                            </Grid>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Ngày kết thúc:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.DateEnd}
                                </div>
                            </Grid>
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Số lượng voucher ban đầu:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.InitQuantity != -1 ? item.InitQuantity
                                        : "Không giới hạn số lượng"} voucher
                                </div>
                            </Grid>
                            {item.Limited == -1
                                ? <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontStyle: 'italic'
                                }}>
                                    Số lượng khuyến mãi không giới hạn
                                </div>
                                : <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontStyle: 'italic'
                                }}>
                                    Còn {item.Limited} voucher
                                </div>
                            }
                            {role != null
                                ? <Grid container item xs={11}
                                    direction='row' justify='space-between'>
                                    <div style={{
                                        fontFamily: `Arial, Helvetica, sans-serif`,
                                        fontSize: 17
                                    }}>
                                        Loại thành viên áp dụng:
                                    </div>
                                    <div style={{
                                        fontFamily: `Arial, Helvetica, sans-serif`,
                                        fontSize: 17, fontWeight: 'bold'
                                    }}>
                                        {role.Name} hoặc cao hơn
                                    </div>
                                </Grid>
                                : null
                            }
                            <Grid container item xs={11}
                                direction='row' justify='space-between'>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17
                                }}>
                                    Mô tả:
                                </div>
                                <div style={{
                                    fontFamily: `Arial, Helvetica, sans-serif`,
                                    fontSize: 17, fontWeight: 'bold'
                                }}>
                                    {item.Description}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.props.close();
                    }} variant="contained" color="primary">
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: 'white'
                        }}>
                            đóng cửa sổ
                        </div>
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

VoucherDetailDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(VoucherDetailDialog);