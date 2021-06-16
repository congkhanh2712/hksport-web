import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {
    BrowserRouter as Router,
    NavLink,
    Redirect,Link
} from "react-router-dom";

const GREY = "#9E9E9E";
const styles = theme => ({
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    root: {
        flexGrow: 1,
    },
    sizeAva: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    rootava: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
});

class CardVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            time: 0,
            donvi: ""
        }
    }

    componentDidMount = async () => {
        var { time } = this.props;
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

    toggleHover = () => {
        this.setState({ hover: !this.state.hover })
    }
    render() {
        const { classes, data } = this.props;
        var linkStyle;
        if (this.state.hover) {
            linkStyle = { margin: 1, backgroundColor: '#f0f0f0', borderRadius: 10, shadow: 10, height: 150 }
        }
        if (!this.state.hover) {
            linkStyle = { margin: 5, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 150 }
        }
        return (
            <Grid item xs={6}>
                <Link to={`/account/useable-voucher/${data.key}`} style={{textDecoration:"none", color:"black"}}>
                    <div onClick={() => {
                        console.log(this.props.data.Name)
                    }}
                        onMouseOver={this.toggleHover}
                        onMouseOut={this.toggleHover}
                        className={classes.well}
                        style={linkStyle}
                    >
                        <Grid container spacing={0}>
                            <Grid className={classes.rootava} item xs={2} >
                                <Avatar style={{ width: 115, height: 115 }} alt="icon-voucher" src={data.Icon} />
                            </Grid>
                            <Grid item xs={10} style={{ borderLeft: `2px solid #f0f0f0` }}>
                                <Typography color="error" variant="h6" gutterBottom align="center">
                                    {data.Name}
                                </Typography>
                                <Grid container spacing={0}>
                                    <Grid item xs={6}>
                                        <Grid container spacing={0} style={{ marginLeft: 0 }}>
                                            <Grid item item xs={4}>
                                                <Typography variant="body1" gutterBottom align="left">
                                                    Mã code:
                                            </Typography>
                                            </Grid>
                                            <Grid item item xs={8}>
                                                <Typography variant="h6" gutterBottom align="left" style={{ marginTop: -5 }}>
                                                    {data.Code}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={0} style={{ marginLeft: 0 }}>
                                            <Grid item item xs={4}>
                                                <Typography variant="body1" gutterBottom align="left">
                                                    Giảm giá:
                                            </Typography>
                                            </Grid>
                                            <Grid item item xs={8}>
                                                <Typography variant="h6" gutterBottom align="left" style={{ marginTop: -5 }}>
                                                    {data.Discount}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={0} style={{ marginLeft: 0 }}>
                                            <Grid item item xs={4}>
                                                <Typography variant="body1" gutterBottom align="left">
                                                    Giảm tối đa:
                                            </Typography>
                                            </Grid>
                                            <Grid item item xs={8}>
                                                <Typography variant="h6" gutterBottom align="left" style={{ marginTop: -5 }}>
                                                    {data.Max}(vnđ)
                                            </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container spacing={0} style={{ marginLeft: 0 }}>
                                            <Grid item item xs={5}>
                                                <Typography variant="body1" gutterBottom align="left">
                                                    Ngày bắt đầu:
                                            </Typography>
                                            </Grid>
                                            <Grid item item xs={7}>
                                                <Typography variant="h6" gutterBottom align="left" style={{ marginTop: -5 }}>
                                                    {data.DateStart}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={0} style={{ marginLeft: 0 }}>
                                            <Grid item item xs={5}>
                                                <Typography variant="body1" gutterBottom align="left">
                                                    Ngày kết thúc:
                                            </Typography>
                                            </Grid>
                                            <Grid item item xs={7}>
                                                <Typography variant="h6" gutterBottom align="left" style={{ marginTop: -5 }}>
                                                    {data.DateEnd}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={0} style={{ marginLeft: 0 }}>
                                            <Grid item item xs={12}>
                                                <Typography color="textSecondary" variant="body1" gutterBottom align="left">
                                                    Hết hạn sau {this.state.time} {this.state.donvi}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                    </div>
                </Link>

            </Grid>
        )
    }
}

CardVoucher.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CardVoucher);