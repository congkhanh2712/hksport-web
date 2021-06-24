import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./Comment.css"
import instance from '../../../AxiosConfig';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


const GREY = "#9E9E9E";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    media: {
        //height: 300,
        height: 200,
    },
    rootcard: {
        maxWidth: 210,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    table: {
        maxWidth: "100%",
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "120",
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
});


class ReplyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            fbCmt: [],
            visible: 2,//số cmt lúc đầu có thể xem, bấm xem thêm thì state này tăng
            count: [],//Đếm số cmt ứng với số sao đánh giá(vd: 5 sao có 4cmt, 4 sao có 2 cmt...)
            removeDialog: false,
        }
    }

    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
    }
    closeRemoveDialog = () => {
        this.setState({
            removeDialog: false
        })
    }
    componentDidMount = async () => {
        this.getdata()
    }
    getdata = async () => {
        instance.get('/rating/' + this.props.slug, {
            params: {
                page: 0
            },
        }).then(res => {
            this.setState({
                fbCmt: res.data.list
            })
        })
        instance.get('/rating/overview/' + this.props.slug)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        count: res.data.list.shift()
                    })
                }
            })
    }
    render() {
        const { classes, detail, username, isMe, avatar, comment_id } = this.props;
        const { removeDialog } = this.state;
        return (
            <Grid container spacing={1}
                alignItems='center'
                style={{
                    marginTop: 10,
                    marginInline: 60,
                    width: "90%",
                    marginBottom: 5,
                    backgroundColor: "#f4f5f0",
                    borderRadius: 10,
                    paddingInline: 10,
                    paddingBlock: 10
                }}>
                <Grid container direction='row'>
                    <Grid container direction='row' item xs={11}>
                        <Avatar
                            alt={username}
                            src={avatar}
                            className={classes.small}
                        />
                        <Grid item style={{ marginInline: 7 }}>
                            <Typography variant="subtitle2" gutterBottom style={{ marginTop: 5 }}>
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item style={{ marginTop: 3 }}>
                            <Typography variant="caption" gutterBottom>
                                (Đã trả lời lúc {detail.Time}  {detail.Date})
                            </Typography>
                        </Grid>
                    </Grid>
                    {isMe == true
                        ? <Grid container item xs={1}
                            direction='row'
                            alignItems={'flex-start'}
                            justify={'flex-end'}>
                            <Tooltip title={"Xóa bình luận này"} placement="bottom">
                                <IconButton
                                    onClick={() => {
                                        this.setState({
                                            removeDialog: true
                                        })
                                    }}
                                    aria-label="delete">
                                    <CancelIcon fontSize={'small'} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        : null
                    }
                </Grid>
                <Grid item xs={12} style={{ marginInline: 30 }}>
                    <Typography variant="body2" gutterBottom>
                        {detail.Comment}
                    </Typography>
                </Grid>
                <Dialog
                    open={removeDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.closeRemoveDialog}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Bạn muốn xóa bình luận này?</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.closeRemoveDialog} variant="contained" color="default">
                            Không
                        </Button>
                        <Button onClick={() => {
                            this.props.remove(comment_id);
                            this.closeRemoveDialog();
                        }} variant="contained" color="primary">
                            Có
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        )
    }
}

ReplyCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReplyCard);