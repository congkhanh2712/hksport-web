import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ReplyIcon from '@material-ui/icons/Reply';
import Divider from '@material-ui/core/Divider';
import Rating from '@material-ui/lab/Rating';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';
import "./Comment.css"
import Dialog from '@material-ui/core/Dialog';
import Link from '@material-ui/core/Link';
import instance from '../../../AxiosConfig';
import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import ReplyCard from './ReplyCard';
import CircularProgress from '@material-ui/core/CircularProgress';


const GREY = "#9E9E9E";

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
const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
        marginTop: theme.spacing(-3),
        marginBottom: theme.spacing(0),
    },
}))(MuiDialogContent);
class CommentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagelist: [],
            replylist: [],
            loading: true,
            src: '',
            open: false,
            liked: false,
            likeNumber: 0,
            isfocused: false,
            replyNumber: 0,
            visibleRep: 2,//số cmt trả lời lúc đầu có thể xem, bấm xem thêm thì state này tăng
            replycmt: ""//state của cmt đang viết
        }
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
    }

    componentDidMount = async () => {
        this.getData();
        var items = [];
        Object.entries(this.props.detail.Images).forEach(([key, value]) => {
            items.push({
                key,
                src: value
            });
        });
        this.setState({
            imagelist: items,
        })
    }
    showMoreRep = () => {
        const { visibleRep } = this.state;
        if (visibleRep + 3 <= this.state.replylist.length) {
            this.setState({
                visibleRep: visibleRep + 3
            })
        } else {
            this.setState({
                visibleRep: this.state.replylist.length
            })
        }
    }
    getData = () => {
        const { detail } = this.props;
        this.setState({
            loading: true
        })
        instance.get('/rating/liked/' + detail.key)
            .then(res => {
                this.setState({
                    likeNumber: res.data.likedNumber,
                    liked: res.data.liked,
                })
            })
        instance.get('/rating/replied/' + detail.key, {
            params: {
                page: 0
            },
        }).then(res => {
            this.setState({
                replyNumber: res.data.length,
                replylist: res.data.list,
                loading: false
            })
        })
    }
    replyComment = () => {
        const { detail } = this.props;
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        if (this.state.replycmt.trim() == '') {
            alert("Vui lòng nhập nội dùng bình luận");
        } else if (user == null) {
            alert("bạn cần đăng nhập để thực hiện chức năng này")
        } else {
            instance.post('/rating/replied/' + detail.key, {
                content: this.state.replycmt
            }).then(res => {
                console.log(res)
                if (res.status == 200 && res.data.succeed == true) {
                    alert(res.data.message);
                    this.setState({
                        replycmt: ''
                    })
                    this.getData()
                }
            }).catch(err => alert(err))
        }
    }
    removeComment = (id) => {
        const { detail } = this.props;
        instance.delete('/rating/replied/' + detail.key + '/' + id)
            .then(res => {
                if (res.status == 200 && res.data.succeed == true) {
                    alert(res.data.message);
                    this.getData();
                } else {
                    alert("Xóa bình luận không thành công");
                }
            })
    }
    handleClickOpen = (y) => {
        this.setState({
            open: true,
            src: y
        })
    };
    likeCmt = () => {
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        const { detail } = this.props;
        if (user == null) {
            alert("bạn cần đăng nhập để thực hiện chức năng này")
        } else {
            this.setState({ liked: !this.state.liked })
            instance.put('/rating/liked/' + detail.key, {
                liked: this.state.liked
            }).then(res => {
                this.getData();
            })
        }
    }
    handleClose = () => {
        this.setState({
            open: false
        })
    };
    render() {
        const { detail, classes } = this.props;
        const { liked, likeNumber, replyNumber, imagelist, src,
            visibleRep, replycmt, open, replylist, isfocused, loading } = this.state;
        return (
            <Grid item xs={12}
                style={{ marginTop: 10, marginInline: 4, }}>
                {/* ava và tên */}
                <Grid container spacing={1}>
                    <Grid item style={{ marginLeft: 10 }}>
                        <Avatar
                            alt={detail.Username}
                            src={detail.Avatar}
                            className={classes.small}
                        />
                    </Grid>

                    <Grid item style={{ marginLeft: 0 }}>
                        <Typography variant="subtitle2" gutterBottom style={{ marginTop: 5 }}>
                            {detail.Username}
                        </Typography>
                    </Grid>
                </Grid>
                {/* số sao đánh giá và phân loại */}
                <Grid container spacing={1} style={{ marginTop: 0, marginLeft: 42, marginBottom: 0 }}>
                    <Grid item style={{ marginLeft: 10 }}>
                        <Rating name="size-large" size="small" value={detail.Rating} readOnly />
                    </Grid>

                    <Grid item style={{ marginLeft: 0, borderLeft: `2px solid #f0f0f0` }}>
                        <Typography variant="body2" gutterBottom style={{ marginLeft: 15 }} color="textSecondary">
                            Phân loại: {detail.Size != '' ? detail.Size : 'Không có'}
                        </Typography>
                    </Grid>
                </Grid>
                {/* cmt */}
                <Typography variant="body2" gutterBottom style={{ marginLeft: 60, marginTop: 10 }} >
                    {detail.Comment}
                </Typography>
                {/* hình nếu có */}
                <Grid container spacing={1} style={{ marginLeft: 57 }}>
                    {imagelist.length != 0 ? imagelist.map(y => {
                        return <Grid item >
                            <img id="myImg"
                                src={y.src}
                                alt="Hình ảnh"
                                height="100"
                                width="90"
                                onClick={() => this.handleClickOpen(y.src)}
                                style={{ cursor: 'zoom-in' }} />
                        </Grid>
                    }) : ""}

                </Grid>
                <Dialog onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open} maxWidth={false}>
                    <DialogContent dividers>
                        <img src={src} alt="Hình ảnh" onClick={() => this.handleClickOpen(src)} />
                    </DialogContent>
                </Dialog>
                {/* thời gian */}
                <Typography variant="caption" gutterBottom style={{ marginLeft: 60 }} color="textSecondary">
                    {detail.Time} {detail.Date}
                </Typography>
                {/* like và rep cmt */}
                <Grid container spacing={1} style={{ marginLeft: 45, marginBlock: 5 }}>
                    <Tooltip title={liked ? `Bỏ thích` : "Thích"} placement="bottom">
                        <Button
                            onClick={() => this.likeCmt()}
                            color="default"
                            className={classes.button}
                            startIcon={<ThumbUpAltIcon style={{ color: liked ? 'red' : "pink" }} />}
                        >
                            {likeNumber}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Trả lời bình luận này" placement="bottom">
                        <Button
                            onClick={() => { this.setState({ isfocused: true }) }}
                            color="default"
                            className={classes.button}
                            startIcon={<ReplyIcon style={{ color: `rgb(6, 184, 68)` }} />}
                        >
                            {replyNumber}
                        </Button>
                    </Tooltip>
                </Grid>
                {/* ô nhập cmt trả lời */}
                <Grid container spacing={1} style={{ marginInline: 58 }}>
                    <Grid item xs={10}>
                        <TextField multiline
                            id="outlined-basic"
                            label="Trả lời bình luận"
                            variant="outlined"
                            name="replycmt"
                            size="small"
                            focused={isfocused}
                            style={{ width: "100%" }}
                            value={replycmt}
                            onChange={this.onChange} />
                    </Grid>
                    <Grid item xs={1} style={{ marginTop: -5 }}>
                        <Tooltip title="Gửi" placement="right">
                            <IconButton onClick={() => this.replyComment()}>
                                <SendIcon style={{ color: `rgb(6, 184, 68)` }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                {replylist.length != 0
                    ? <Typography variant="caption" style={{ marginLeft: 60, marginTop: 10 }} >
                        Bình luận hiển thị theo thứ tự mới nhất
                    </Typography>
                    : null
                }
                <Grid container spacing={1}
                    direction='column'
                    alignItems='center'
                    style={{ marginBottom: 20 }}>
                    {/* reply cmt */}
                    {loading == false
                        ? replylist.slice(0, visibleRep).map((item, index) => {
                            return <ReplyCard
                                key={index}
                                detail={item.detail}
                                username={item.Username}
                                comment_id={item.key}
                                isMe={item.isMe}
                                avatar={item.Avatar}
                                remove={this.removeComment}
                            />
                        })
                        : <CircularProgress size={20} />
                    }
                </Grid>
                {visibleRep < replylist.length
                    ? <div className="link" style={{ display: "flex", justifyContent: "center" }}>
                        <Link variant="body2" onClick={this.showMoreRep} align="center" >
                            Xem những trả lời khác
                        </Link>
                    </div>
                    : ""
                }
                <Divider />
            </Grid>
        )
    }
}

CommentCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CommentCard);