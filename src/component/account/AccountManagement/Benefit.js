import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Icon, InlineIcon } from '@iconify/react';
import crownIcon from '@iconify-icons/mdi/crown';
import circleFill from '@iconify-icons/akar-icons/circle-fill';
import Divider from '@material-ui/core/Divider';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    sizeAva: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    button: {
        margin: theme.spacing(1),
    },
    roott: {
        width: "90%",
    },
});

class Benefit extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        var {value,onChange,phanTramTichLuy,kc,freeship,color,classes}=this.props;
        return (
            <Grid item xs={6}>
                <div
                    className={classes.well}
                    style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 214 }}
                >
                    <BottomNavigation value={value} onChange={onChange} className={classes.roott} style={{ marginLeft: "5%" }}>
                        <BottomNavigationAction label="Thành Viên Thường" value="thuong" icon={<Icon icon={crownIcon} color="#2ED5F3" height="40" />} />
                        <BottomNavigationAction label="Thành Viên Bạc" value="bac" icon={<Icon icon={crownIcon} color="#C0C0C0" height="40" />} />
                        <BottomNavigationAction label="Thành Viên Vàng" value="vang" icon={<Icon icon={crownIcon} color="gold" height="40" />} />
                    </BottomNavigation>
                    <Divider />
                    <Typography variant="button" gutterBottom style={{ marginLeft: "35%" }}>
                        Đặc quyền dành cho tài khoản
                            </Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>

                            <Typography variant="subtitle1" gutterBottom>
                                <Icon icon={circleFill} color={color} style={{ marginLeft: 30, marginBottom: 3 }} />{` Tỷ lệ quy đổi điểm tích luỹ ${phanTramTichLuy}%`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>

                            <Typography variant="subtitle1" gutterBottom>
                                <Icon icon={circleFill} color={color} style={{ marginLeft: 30, marginBottom: 3 }} />{` Các ưu đãi áp dụng dành riêng cho thành viên`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>

                            <Typography variant="subtitle1" gutterBottom>
                                <Icon icon={circleFill} color={color} style={{ marginLeft: 30, marginBottom: 3 }} />{` Giao hàng hoả tốc tối đa ${kc}km`}
                            </Typography>
                        </Grid>
                        {freeship === true ? <Grid item xs={12}>

                            <Typography variant="subtitle1" gutterBottom>
                                <Icon icon={circleFill} color={color} style={{ marginLeft: 30, marginBottom: 3 }} />{` Miễn phí giao hàng đối với giao hàng hoả tốc`}
                            </Typography>
                        </Grid> : ""}
                    </Grid>
                </div>
            </Grid>
        )
    }
}

Benefit.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Benefit);