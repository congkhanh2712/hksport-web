import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import instance from '../../AxiosConfig';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {
    NavLink
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import VoucherDetailDialog from '../account/Cart/Dialog/VoucherDetailDialog';



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

class ManageVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbRole: [],//mang luu tblRole
            voucherList: [],
            chosing: null,
            detailDialog: false
        }
    }

    componentDidMount = async () => {
        this.getData();
    }
    getData = () => {
        instance.get('/voucher/all', {
            params: { page: 0 }
        }).then(res => {
            console.log(res.data.list)
            this.setState({
                voucherList: res.data.list,
            })
        })
        instance.get('/role')
            .then(res => {
                this.setState({
                    fbRole: res.data,
                })
            })
    }
    render() {
        const { voucherList, fbRole, chosing, detailDialog } = this.state;
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="lg" >
                <Typography variant="h5" align="center">
                    DANH SÁCH VOUCHER
                </Typography>
                <Grid container item xs={12}
                    direction='row' justify="flex-end"
                    style={{ marginBlock: 10 }}>
                    <Grid item xs={2}>
                        <NavLink to={`/admin/add-voucher`}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddBoxIcon />}
                            >
                                Thêm voucher
                            </Button>
                        </NavLink>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} style={{ marginTop: 30 }}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">CODE</TableCell>
                                <TableCell align="center">Tên Voucher</TableCell>
                                <TableCell align="center">Mức giảm</TableCell>
                                <TableCell align="center">Ngày bắt đầu</TableCell>
                                <TableCell align="center">Ngày kết thúc</TableCell>
                                <TableCell align="center">Số lượng còn lại</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {voucherList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.Code}</TableCell>
                                    <TableCell align="center">{row.Name}</TableCell>
                                    <TableCell align="center">{row.Discount}</TableCell>
                                    <TableCell align="center">{row.DateStart}</TableCell>
                                    <TableCell align="center">{row.DateEnd}</TableCell>
                                    <TableCell align="center">{row.Limited != -1 ? row.Limited : "Không giới hạn"}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton color="primary"
                                                aria-label="upload picture"
                                                component="span"
                                                onClick={() => {
                                                    this.setState({
                                                        chosing: row,
                                                        detailDialog: true,
                                                    })
                                                }}>
                                                <CreateIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {detailDialog
                    ? <VoucherDetailDialog
                        close={() => {
                            this.setState({
                                detailDialog: false,
                                chosing: null
                            })
                        }}
                        item={chosing} />
                    : null

                }
            </Container>
        )
    }
}

ManageVoucher.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ManageVoucher);