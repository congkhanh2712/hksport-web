import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Rating from '@material-ui/lab/Rating';
import "./Comment.css"
import Link from '@material-ui/core/Link';
import instance from '../../../AxiosConfig';
import CommentCard from './CommentCard';

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


class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            fbCmt: [],
            visible: 2,
            count: [],
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
        this.getdata()
    }
    getdata = async () => {
        instance.get('/rating/' + this.props.slug, {
            params: {
                page: 0
            },
        }).then(res => {
            if (res.status == 200) {
                this.setState({
                    fbCmt: res.data.list
                })
            }
        })
        instance.get('/rating/overview/' + this.props.slug)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        count: res.data.list.reverse()
                    })
                }
            })
    }
    showMore = () => {
        const { visible } = this.state;
        if (visible + 3 <= this.state.fbCmt.length) {
            this.setState({
                visible: visible + 3
            })
        } else {
            this.setState({
                visible: this.state.fbCmt.length
            })
        }
    }
    render() {
        const { classes, product } = this.props;
        const { fbCmt, count, visible } = this.state;
        return (
            <Grid container spacing={0} style={{ paddingInline: "15%", marginBottom: 15 }}>
                <Grid item xs={12} className={classes.well}>
                    <Grid container spacing={0} style={{ backgroundColor: 'white', height: "auto" }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom align="center">
                                Nhận xét sản phẩm
                            </Typography>
                            <Divider />
                        </Grid>
                        {/* đếm số nhận xét */}
                        {fbCmt.length === 0 ?
                            <Grid item xs={12}>
                                <Typography variant="body2" gutterBottom align="center">
                                    (Chưa có nhận xét nào)
                                </Typography>
                                <Divider />
                            </Grid> : <Grid item xs={12}>
                                <Grid container spacing={0}>
                                    <Grid item xs={4}>
                                        <Typography variant="h3" component="h2" gutterBottom align="center">
                                            {product.Rating}
                                        </Typography>
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: -15 }}>
                                            <Rating name="size-large" size="large" value={this.props.star} precision={0.5} readOnly />
                                        </div>
                                        <Typography variant="subtitle1" component="h2" gutterBottom align="center">
                                            ({fbCmt.length} nhận xét)
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8} style={{ borderLeft: `2px solid #f0f0f0` }}>
                                        {count.slice(0, 5).map((i, index) => {
                                            return <Grid container spacing={1} style={{ marginTop: 5 }} justify="space-between">
                                                <Grid item style={{ marginLeft: 10 }}>
                                                    <Rating name="size-large" size="small" value={5 - index} />
                                                </Grid>
                                                <Grid item style={{ marginTop: 2 }}>
                                                    <ProgressBar now={i / fbCmt.length * 100} style={{ width: 500 }} variant="success" />
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
                        {fbCmt.length !== 0 ? <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom align="center">
                                Menu lọc cmt
                            </Typography>
                            <Divider />
                        </Grid> : ""}
                        {/* hiển thị cmt */}
                        {fbCmt.slice(0, visible).map((x) => {
                            return <CommentCard
                                key={x.key}
                                detail={x} />
                        })}
                        {/* nút xem thêm */}
                        <Grid item xs={12}>
                            {visible < fbCmt.length ? <div className="link" style={{ display: "flex", justifyContent: "center", }}>
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