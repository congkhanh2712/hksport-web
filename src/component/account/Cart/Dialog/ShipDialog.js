import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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

class RemoveDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        console.log('I am here')
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    render() {
        const { distance } = this.props;
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
                <DialogTitle id="alert-dialog-slide-title">CHÍNH SÁCH VẬN CHUYỂN CỦA HK SPORT</DialogTitle>
                <DialogContent>
                    <Grid item xs={12}
                        style={{ borderRadius: 5, backgroundColor: '#E2E2E2', paddingBlock: 5, paddingInline: 10 }}>
                        <Typography variant="h6">
                            Giao hàng tiêu chuẩn
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Đơn vị vận chuyển: Giaohangtietkiem
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Nhận hàng trong vòng 3-5 ngày
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Áp dụng với mọi địa chỉ nhận hàng
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ height: 15, backgroundColor: 'white' }}></Grid>
                    <Grid item xs={12}
                        style={{ borderRadius: 5, backgroundColor: '#E2E2E2', paddingBlock: 5, paddingInline: 10 }}>
                        <Typography variant="h6" gutterBottom>
                            Giao hàng hỏa tốc
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Đơn vị vận chuyển: GrabExpress
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Nhận hàng trong ngày
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Chỉ áp dụng với nơi nhận có khoảng cách tối đa {distance} km
                        </Typography>
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

RemoveDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RemoveDialog);