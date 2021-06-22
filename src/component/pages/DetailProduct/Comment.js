import React, { Component } from 'react';
import fbApp from '../../../Firebase'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
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
import MuiDialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';

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

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            fbCmt: [],
            fbUser: [],
            src: "",
            color: "pink",// hình như cái này bị dư, k dùng đến thì phải
            visible: 2,//số cmt lúc đầu có thể xem, bấm xem thêm thì state này tăng
            visibleRep: 2,//số cmt trả lời lúc đầu có thể xem, bấm xem thêm thì state này tăng
            count: [],//Đếm số cmt ứng với số sao đánh giá(vd: 5 sao có 4cmt, 4 sao có 2 cmt...)
            openReply: "",//dùng để mở ô viết cmt khi click vào nút trả lời cmt
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
        var slug = this.props.slug
        this.getdata()
        this.getdataUser()
    }
    getdata = async () => {
        //lấy ra mảng cmt của sản phẩm, setstate vô state fbcmt, rồi từ đó tìm ra mảng count rồi setstate cho state count
        var temp = []//lưu mảng cmt
        await fbApp.database().ref('TblRating').orderByChild("ProductID").equalTo(this.props.slug).once("value", (snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                temp.push({
                    key: childSnapshot.key,
                    Date: childSnapshot.val().Date,
                    OrderId: childSnapshot.val().OrderId,
                    ProductID: childSnapshot.val().ProductID,
                    Rating: childSnapshot.val().Rating,
                    Size: childSnapshot.val().Size,
                    Time: childSnapshot.val().Time,
                    User: childSnapshot.val().User,
                    Comment: childSnapshot.val().Comment,
                    Images: childSnapshot.val().Images,
                    Liked: childSnapshot.val().Liked,
                    Replied: childSnapshot.val().Replied,
                })

            })
            this.setState({
                fbCmt: temp.reverse()
            })
        })
        var count = []
        for (var i = 5; i >= 1; i--) {
            var dem = 0
            // eslint-disable-next-line no-loop-func
            temp.forEach((x) => {
                if (x.Rating === i) {
                    dem = dem + 1
                }
            })
            count.push(dem)
        }
        this.setState({
            count: count
        })
    }
    getdataUser = async () => {
        // lấy thông tin bảng user
        var temp = []//lưu mảng user
        await fbApp.database().ref('TblCustomer').once("value", (snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                temp.push({
                    key: childSnapshot.key,
                    Avatar: childSnapshot.val().Avatar,
                    Name: childSnapshot.val().Name,
                })

            })
            this.setState({
                fbUser: temp
            })
        })
    }
    zoomImage = () => {
        this.setState({
            open: true
        })
    }
    handleClickOpen = (y) => {
        this.setState({
            open: true,
            src: y
        })
    };
    handleClose = () => {
        this.setState({
            open: false
        })
    };
    likeCmt = (x) => {
        var key = ""
        if (localStorage && localStorage.getItem('user')) {
            key = JSON.parse(localStorage.getItem("user")).key;
        };
        if (key === "") {
            alert("bạn cần đăng nhập để thực hiện")
        } else {
            if (x.Liked !== undefined && x.Liked[key] !== undefined) { //kiểm tra xem đã like chưa
                //nếu đã like r thì xoá
                fbApp.database().ref('TblRating').child(x.key).child("Liked").child(key).remove().then(() => {
                    this.getdata()
                })

            } else {
                // chưa like thì thêm vô
                var today = new Date();
                var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                fbApp.database().ref('TblRating').child(x.key).child("Liked").child(key).set({
                    Date: date,
                    Time: time
                }).then(() => {
                    this.getdata()
                })
            }
        }
    }
    showMore = () => {
        this.setState({
            visible: this.state.visible + 3
        })
    }
    showMoreRep = () => {
        this.setState({
            visibleRep: this.state.visibleRep + 3
        })
    }
    replyComment = (key) => {
        //key là id của sp
        var user
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        var today = new Date();
        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // thêm vô nhánh replied và gọi getdata load lại, setstate để reset ô nhập cmt
        fbApp.database().ref('TblRating').child(key).child("Replied").push({
            Comment:this.state.replycmt,
            Date: date,
            Time: time,
            User: user.key
        }).then(() => {
            this.getdata();
            this.setState({
                replycmt: "",
                openReply: ""
            })
            alert("Bình luận thành công")
        })
    }
    getAvatar = (key) => {
        var url
        this.state.fbUser.forEach(e => {
            if(e.key === key){
               url = e.Avatar
            }
        })
        return url;
    }
    render() {
        var key = ""
        if (localStorage && localStorage.getItem('user')) {
            var key = JSON.parse(localStorage.getItem("user")).key;
        };
        var { classes } = this.props;
        var sum = 0;
        this.state.fbCmt.forEach(x => {
            sum = sum + x.Rating
        })

        this.state.fbCmt.forEach(x => {

        })
        return (
            <Grid container spacing={0} style={{ paddingLeft: "15%", paddingRight: "15%" }}>
                <Grid item xs={12} className={classes.well}>
                    <Grid container spacing={0} style={{ backgroundColor: 'white', height: "auto" }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom align="center">
                                Nhận xét sản phẩm
                            </Typography>
                            <Divider />
                        </Grid>
                        {/* đếm số nhận xét */}
                        {this.state.fbCmt.length === 0 ?
                            <Grid item xs={12}>
                                <Typography variant="body2" gutterBottom align="center">
                                    (Chưa có nhận xét nào)
                                </Typography>
                                <Divider />
                            </Grid> : <Grid item xs={12}>
                                <Grid container spacing={0}>
                                    <Grid item xs={4}>
                                        <Typography variant="h3" component="h2" gutterBottom align="center">
                                            {this.props.product.Rating}
                                        </Typography>
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: -15 }}>
                                            <Rating name="size-large" size="large" value={this.props.star} precision={0.5} readOnly />
                                        </div>
                                        <Typography variant="subtitle1" component="h2" gutterBottom align="center">
                                            ({this.state.fbCmt.length} nhận xét)
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8} style={{ borderLeft: `2px solid #f0f0f0` }}>
                                        {this.state.count.map((i, index) => {
                                            return <Grid container spacing={1} style={{ marginTop: 5 }} justify="space-between">
                                                <Grid item style={{ marginLeft: 10 }}>
                                                    <Rating name="size-large" size="small" value={5 - index} />
                                                </Grid>
                                                <Grid item style={{ marginTop: 2 }}>
                                                    <ProgressBar now={i / this.state.fbCmt.length * 100} style={{ width: 500 }} variant="success" />
                                                </Grid>
                                                <Grid item style={{ marginRight: 30 }}>
                                                    {i}
                                                </Grid>
                                            </Grid>
                                        })}
                                    </Grid>
                                </Grid>
                                <Divider />
                            </Grid>}
                        {/* lọc cmt */}
                        {this.state.fbCmt.length !== 0 ? <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom align="center">
                                Menu lọc cmt
                            </Typography>
                            <Divider />
                        </Grid> : ""}
                        {/* hiển thị cmt */}
                        {this.state.fbCmt.slice(0, this.state.visible).map((x, index) => {
                            return <Grid item xs={12}>
                                {/* ava và tên */}
                                <Grid container spacing={1} style={{ marginTop: 10, marginLeft: 4, marginBottom: 0 }}>
                                    <Grid item style={{ marginLeft: 10 }}>
                                        <Avatar
                                            alt={this.state.fbUser.map(y => {
                                                if (y.key === x.User) {
                                                    return y.Name
                                                }
                                            })}
                                            src={this.state.fbUser.map(y => {
                                                if (y.key === x.User) {
                                                    return y.Avatar
                                                }
                                            })}
                                            className={classes.small}
                                        />
                                    </Grid>

                                    <Grid item style={{ marginLeft: 0 }}>
                                        <Typography variant="subtitle2" gutterBottom style={{ marginTop: 5 }}>
                                            {this.state.fbUser.map(y => {
                                                if (y.key === x.User) {
                                                    return y.Name
                                                }
                                            })}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {/* số sao đánh giá và phân loại */}
                                <Grid container spacing={1} style={{ marginTop: 0, marginLeft: 42, marginBottom: 0 }}>
                                    <Grid item style={{ marginLeft: 10 }}>
                                        <Rating name="size-large" size="small" value={x.Rating} readOnly />
                                    </Grid>

                                    <Grid item style={{ marginLeft: 0, borderLeft: `2px solid #f0f0f0` }}>
                                        <Typography variant="body2" gutterBottom style={{ marginLeft: 15 }} color="textSecondary">
                                            Phân loại: {x.Size}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {/* cmt */}
                                <Typography variant="body2" gutterBottom style={{ marginLeft: 60, marginTop: 10 }} >
                                    {x.Comment}
                                </Typography>
                                {/* hình nếu có */}
                                <Grid container spacing={1} style={{ marginLeft: 57 }}>
                                    {x.Images !== undefined ? Object.values(x.Images).map(y => {
                                        return <Grid item >
                                            <img id="myImg" src={y} alt="Hình ảnh" height="100" width="90" onClick={() => this.handleClickOpen(y)} />
                                        </Grid>
                                    }) : ""}

                                </Grid>
                                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open} maxWidth={false}>
                                    <DialogContent dividers>
                                        <img src={this.state.src} alt="Hình ảnh" onClick={() => this.handleClickOpen(this.state.src)} height="700" width="auto" />
                                    </DialogContent>
                                </Dialog>
                                {/* thời gian */}
                                <Typography variant="caption" gutterBottom style={{ marginLeft: 60 }} color="textSecondary">
                                    {x.Time} {x.Date}
                                </Typography>
                                {/* like và rep cmt */}
                                <Grid container spacing={1} style={{ marginLeft: 45 }}>
                                    <Grid item >
                                        <Tooltip title={(x.Liked !== undefined && x.Liked[key] !== undefined) ? `Bỏ thích` : "Thích"} placement="bottom">
                                            <IconButton onClick={() => this.likeCmt(x)}>
                                                <ThumbUpAltIcon style={{ color: (x.Liked !== undefined && x.Liked[key] !== undefined) ? `rgb(6, 184, 68)` : "pink" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item >
                                        <div style={{ marginTop: 14, marginLeft: -13 }}>
                                            {x.Liked !== undefined ? Object.values(x.Liked).length : 0}
                                        </div>
                                    </Grid>
                                    <Grid item style={{ marginLeft: 35 }}>
                                        <Tooltip title="Trả lời bình luận này" placement="bottom">
                                            <IconButton onClick={() => {
                                                // if(this.state.openReply === ""){
                                                this.setState({
                                                    openReply: x.key,
                                                    replycmt: ""
                                                })
                                                // }else{
                                                //     this.setState({
                                                //         openReply : ""
                                                //     })
                                                // }                                           
                                            }}>
                                                <ReplyIcon style={{ color: `rgb(6, 184, 68)` }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                {/* ô nhập cmt trả lời */}
                                {this.state.openReply === x.key ? <Grid container spacing={1} style={{ marginLeft: 58, marginBottom: 20 }}>
                                    <Grid item xs={10}>
                                        <TextField multiline
                                            id="outlined-basic"
                                            label="Trả lời bình luận"
                                            variant="outlined"
                                            name="replycmt"
                                            size="small"
                                            style={{ width: "100%" }}
                                            value={this.state.replycmt}
                                            onChange={this.onChange} />
                                    </Grid>
                                    <Grid item xs={1} style={{ marginTop: -5 }}>
                                        <Tooltip title="Gửi" placement="right">
                                            <IconButton onClick={() => this.replyComment(x.key)}>
                                                <SendIcon style={{ color: `rgb(6, 184, 68)` }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid> : null}

                                {/* reply cmt */}
                                {x.Replied !== undefined ?
                                    Object.values(x.Replied).slice(0, this.state.visibleRep).map(y => {
                                        return <Grid container spacing={1}
                                            style={{
                                                marginTop: 10,
                                                marginLeft: 60,
                                                width: "90%",
                                                marginBottom: 5,
                                                backgroundColor: "#f4f5f0",
                                                borderRadius: 10
                                            }}
                                        >
                                            <Grid item style={{ marginLeft: 10 }}>
                                                <Avatar
                                                    alt={this.state.fbUser.map(z => {
                                                        if (z.key === y.User) {
                                                            return z.Name
                                                        }
                                                    })}
                                                    src={this.getAvatar(y.User)}
                                                    className={classes.small}
                                                />
                                            </Grid>

                                            <Grid item style={{ marginLeft: 0 }}>
                                                <Typography variant="subtitle2" gutterBottom style={{ marginTop: 5 }}>
                                                    {this.state.fbUser.map(z => {
                                                        if (z.key === y.User) {
                                                            return z.Name
                                                        }
                                                    })}
                                                </Typography>
                                            </Grid>
                                            <Grid item style={{ marginLeft: 0, marginTop: 3 }}>
                                                <Typography variant="caption" gutterBottom>
                                                    (Đã trả lời lúc {y.Time}  {y.Date})
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" gutterBottom style={{ marginLeft: 50 }}>
                                                    {y.Comment}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    })
                                    : null}
                                {(x.Replied !== undefined && this.state.visibleRep < Object.values(x.Replied).length) ? <div className="link" style={{ display: "flex", justifyContent: "center" }}>
                                    <Link variant="body2" onClick={this.showMoreRep} align="center" >
                                        Xem những trả lời khác
                                    </Link>
                                </div> : ""}
                                <Divider />
                            </Grid>
                        })}
                        {/* nút xem thêm */}
                        <Grid item xs={12}>
                            {this.state.visible < this.state.fbCmt.length ? <div className="link" style={{ display: "flex", justifyContent: "center", }}>
                                <Link variant="body2" onClick={this.showMore} align="center" >
                                    Xem những bình luận khác
                                </Link>
                            </div> : ""}
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

Comment.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Comment);