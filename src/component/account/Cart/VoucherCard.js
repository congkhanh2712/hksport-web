import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ListItem from '@material-ui/core/ListItem';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});


class VoucherDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            time: 0,
            donvi: ""
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.getTimeLeft()
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
    getTimeLeft() {
        const { item } = this.props;
        const time = this.isExpired(item.DateEnd);
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
    isExpired = (day) => {
        var d = this.tranDay(day) + 86400000;
        var today = (new Date().getTime());
        return d - today;
    }
    choose = () => {
        const { item, chosing } = this.props;
        if (chosing == item) {
            this.props.onClick(null);
        } else {
            this.props.onClick(item);
        }
    }
    render() {
        const { classes, item, chosing } = this.props
        return (
            <Grid
                className={classes.well}
                container item xs={12}
                style={{ borderRadius: 5, backgroundColor: '#ECECEC', marginBottom: 20 }}>
                <ListItem button onClick={() => { this.choose() }}>
                    <Grid item xs={2}>
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
                        <Typography variant="body1"
                            style={{ fontWeight: 'bold', color: '#FF5F38' }}>
                            Hết hạn sau {this.state.time} {this.state.donvi}
                        </Typography>
                    </Grid>
                    <Grid container item xs={1}
                        justify='center' alignItems='center'>
                        {chosing == item
                        ? <RadioButtonCheckedIcon fontSize='large' />
                        : <RadioButtonUncheckedIcon fontSize='large' />
                        }
                    </Grid>
                </ListItem>
            </Grid>
        )
    }
}

VoucherDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(VoucherDialog);