import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ReceiptIcon from '@material-ui/icons/Receipt';
import InfoIcon from '@material-ui/icons/Info';
import ContactsIcon from '@material-ui/icons/Contacts';
import Box from '@material-ui/core/Box';
import PinDropIcon from '@material-ui/icons/PinDrop';
import instance from '../../../AxiosConfig';
import avatar from '../../../images/ic_avatar.png';
import ZoomImageDialog from '../../account/Cart/Dialog/ZoomImageDialog';


const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            search: '',
            user: null,
            otherData: null,
            loading: false,
            zoomDialog: false,
        }
    }
    componentDidMount = async () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.setState({
            user: this.props.user,
            loading: true,
        })
        if (this.props.user != null) {
            this.getData();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user != this.props.user) {
            this.setState({
                user: this.props.user,
                loading: true,
            })
            this.getData();
        }
    }
    getData = () => {
        instance.get('/auth/' + this.props.user.uid)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        otherData: res.data.information,
                        loading: false,
                    })
                }
            })
    }
    render() {
        const { classes } = this.props;
        const { user, otherData, loading, zoomDialog } = this.state;
        return (
            <Grid container item
                justify='center'
                style={{
                    borderRadius: 10,
                    width: '20%',
                    paddingBlock: 5
                }}
                className={classes.well}>
                {user != null
                    ? <Grid container item
                        style={{ width: '95%', paddingBlock: 5, height: '15%' }}
                        direction={'row'}>
                        <img
                            onClick={() => {
                                this.setState({ zoomDialog: true })
                            }}
                            src={user.Avatar != '' ? user.Avatar : avatar}
                            style={{ width: 65, borderRadius: 65, height: 65, cursor: 'zoom-in' }}
                        />
                        <Grid item
                            style={{ width: '75%', paddingInline: 10 }}>
                            <Typography variant="h6" gutterBottom>
                                {user.Name}
                            </Typography>
                            <Grid container item
                                direction={'row'}
                                alignItems='flex-start'
                                style={{ width: '100%' }}>
                                <img
                                    style={{
                                        width: 25, borderRadius: 25, height: 25,
                                        backgroundColor: user.Color, marginRight: 10
                                    }} />
                                <Typography variant="subtitle1" gutterBottom>
                                    {user.RoleName}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    : null
                }

                {user != null && loading != true
                    ? <Grid container
                        justify='space-between'
                        style={{ height: '85%', width: '100%' }}>
                        <Box
                            borderTop={1}
                            borderBottom={1}
                            borderColor={'#A4A4A4'}
                            style={{
                                width: '100%', paddingBlock: 5,
                                paddingInline: 10
                            }}>
                            <Grid container
                                direction='row' alignItems='center'>
                                <ContactsIcon style={{ paddingRight: 5 }} />
                                <Typography variant="h6" >
                                    Thông tin khách hàng
                                </Typography>
                            </Grid>
                            <Typography variant="body1" >
                                Email: {otherData.email}
                            </Typography>
                            <Typography variant="body1" >
                                Ngày tạo: {otherData.createdate.substring(0, 16)}
                            </Typography>
                            <Typography variant="body1" >
                                Số điện thoại: {user.Phone_Number}
                            </Typography>
                            <Typography variant="body1">
                                Điểm thành viên: {user.Point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} điểm
                            </Typography>
                            <Typography variant="body1">
                                Điểm khả dụng: {user.PointAvailable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} điểm
                            </Typography>
                            <Grid container
                                direction='row' alignItems='center'>
                                <PinDropIcon style={{ paddingRight: 5 }} />
                                <Typography variant="h6" >
                                    Địa chỉ:
                                </Typography>
                            </Grid>
                            <Typography variant="body1">
                                {user.Address.Detail}
                            </Typography>
                            <Typography variant="body1" >
                                {user.Address.Ward}
                            </Typography>
                            <Typography variant="body1" >
                                {user.Address.District}
                            </Typography>
                            <Typography variant="body1">
                                {user.Address.City}
                            </Typography>
                        </Box>
                        <Box
                            style={{ width: '95%', paddingBlock: 5 }}>
                            <Grid container
                                direction='row' alignItems='center'>
                                <InfoIcon style={{ paddingRight: 5 }} />
                                <Typography variant="h6" >
                                    Thông tin khác
                                </Typography>
                            </Grid>
                            <Grid container
                                direction='row' alignItems='center'>
                                <ReceiptIcon style={{ paddingRight: 5 }} />
                                <Typography variant="body1" >
                                    Số đơn đã đặt: {otherData.order}
                                </Typography>
                            </Grid>
                            <Grid container
                                direction='row' alignItems='center'>
                                <VisibilityIcon style={{ paddingRight: 5 }} />
                                <Typography variant="body1" >
                                    Số sản phẩm đã xem: {otherData.seen}
                                </Typography>
                            </Grid>
                            <Grid container
                                direction='row' alignItems='center'>
                                <FavoriteIcon style={{ paddingRight: 5 }} />
                                <Typography variant="body1" >
                                    Số sản phẩm đã thích: {otherData.liked}
                                </Typography>
                            </Grid>
                        </Box>
                    </Grid>
                    : <CircularProgress />
                }
                {zoomDialog
                    ? <ZoomImageDialog
                        close={() => {
                            this.setState({ zoomDialog: false })
                        }}
                        src={user.Avatar != '' ? user.Avatar : avatar} />
                    : null
                }
            </Grid>
        );
    }
}
UserInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UserInfo);