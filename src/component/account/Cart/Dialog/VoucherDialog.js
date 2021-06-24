import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import VoucherCard from '../VoucherCard';
import instance from '../../../../AxiosConfig';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';


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
            loading: true,
            voucherList: [],
            chosing: '',
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
        instance.get('/voucher')
            .then(res => {
                this.setState({
                    voucherList: this.filter(res.data.list),
                    loading: false,
                }, () => console.log(this.state.voucherList))
            })
    }
    filter = (items) => {
        items = items.filter(item => this.isAvailable(item.Role) != -1)
        return items
    }
    isAvailable = (role) => {
        var pos = -1;
        const { roleList, point } = this.props;
        for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].key == role && point >= roleList[i].MinPoint) {
                pos = i;
            }
        }
        return pos
    }
    chooseVoucher = (item) => {
        this.props.useVoucher(item);
        this.setState({
            chosing: item,
        })
    }
    render() {
        const { loading, voucherList, chosing } = this.state;
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
                <DialogTitle id="alert-dialog-slide-title">ÁP DỤNG VOUCHER CHO ĐƠN HÀNG</DialogTitle>
                <DialogContent>
                    <List
                        style={{ textAlign: 'center' }}
                        disablePadding={true}>
                        {loading == false
                            ? voucherList.length != 0
                                ? voucherList.map((item) =>
                                    <VoucherCard
                                        key={item.key}
                                        item={item}
                                        chosing={chosing}
                                        onClick={this.chooseVoucher} />
                                )
                                : null
                            : <CircularProgress />
                        }
                    </List>
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
                    <Button onClick={() => {
                        this.props.close();
                    }} variant="contained" color="primary">
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: 'white'
                        }}>
                            Áp dụng
                        </div>
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

VoucherDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(VoucherDialog);