import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';
import "./RatingOrder.css"
import ReactStars from "react-rating-stars-component";
import Button from 'react-bootstrap/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
});

class RatingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            products: [],
            open: false,
            cmt: "",
            star: 5
        }
    }
    openDialog = () => {
        this.setState({
            open: true
        })
    }

    closeDialog = () => {
        this.setState({
            open: false
        })
    }
    componentDidMount = async () => {
        this.setState({
            size: this.props.size
        })
        if(this.props.rating != undefined){
            console.log(this.props.rating)
            this.setState({
                star: this.props.rating
            })
        }
    }

    imageSelect = () => {
        var images = [];
        var image = document.getElementById('image').files;
        if (image.length > 5) {
            alert("Chỉ chọn tối đa 5 hình ảnh")
        } else {
            for (var i = 0; i < image.length; i++) {
                images.push({
                    name: Date.now(),
                    url: URL.createObjectURL(image[i]),
                    file: image[i]
                })
            }
            this.setState({
                images: images,
            })
            const { id, size } = this.props;
            this.props.rated(id, size, this.state.star, this.state.cmt, images)
        }

    }
    deleteImage = (e) => {
        var images = this.state.images;
        images.splice(e, 1);
        this.setState({
            images: images
        })
        const { id, size } = this.props;
        this.props.rated(id, size, this.state.star, this.state.cmt, images)
    }
    onChange = async (event) => {
        const { id, size } = this.props;
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
        this.props.rated(id, size, this.state.star, this.state.cmt, this.state.images)
    }
    ratingChanged = (newvalue) => {
        const { id, size } = this.props;
        this.setState({
            star: newvalue
        })
        this.props.rated(id, size, newvalue, this.state.cmt, this.state.images)
    }
    render() {
        var { classes } = this.props;
        return (
            <Grid item xs={6}>
                <div
                    className={classes.well}
                    style={{ borderRadius: 10, shadow: 10, height: 220, margin: 10 }}
                >
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{ borderRight: `2px solid #f0f0f0` }}>
                            <img
                                src={this.props.hinh}
                                alt="Hình ảnh"
                                style={{ height: 180, margin: 10 }}
                            />
                        </Grid>
                        <Grid item xs={5} style={{ marginLeft: 10 }}>
                            <Typography variant="subtitle2" gutterBottom align="center">
                                Thông tin sản phẩm
                                            </Typography>
                            <Typography variant="body2" gutterBottom style={{ marginBottom: 12 }}>
                                {this.props.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom style={{ marginBottom: 12 }}>
                                Kích cỡ: {this.props.size}
                            </Typography>
                            <Typography variant="body2" gutterBottom style={{ marginBottom: 12 }}>
                                Giá sản phẩm: {this.props.price}(vnđ)
                            </Typography>
                            <Button
                                onClick={this.openDialog}
                                variant="success"
                                style={{
                                    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                                    width: "110%",
                                }}>
                                Đánh giá sản phẩm
                                        </Button>
                        </Grid>

                        {/* dialog */}
                        <Dialog
                            open={this.state.open}
                            onClose={this.closeDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            fullWidth={true}
                            maxWidth="lg"
                        >
                            <DialogTitle id="alert-dialog-title">Đánh giá và nhận xét sản phẩm: {this.props.name}</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={0}>
                                    <Grid item xs={6} style={{ borderRight: `2px solid #f0f0f0` }}>
                                        <Typography variant="body2" gutterBottom style={{ marginBottom: 0 }}>
                                            Đánh giá sản phẩm:
                                        </Typography>
                                        <ReactStars
                                            count={5}
                                            onChange={this.ratingChanged}
                                            size={60}
                                            value={this.state.star}
                                            activeColor="#ffd700"
                                            style={{ paddingLeft: 100 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} style={{}}>
                                        <Typography variant="body2" gutterBottom style={{ marginLeft: 20 }}>
                                            Nhận xét sản phẩm:
                                        </Typography>
                                        <TextField
                                            style={{ width: "95%", marginLeft: 20 }}
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            name="cmt"
                                            onChange={this.onChange}
                                            value={this.state.cmt}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: 20, borderTop: `2px solid #f0f0f0` }}>
                                        <Typography variant="body2" gutterBottom style={{ marginLeft: 0 }}>
                                            Thêm hình ảnh trải nghiệm sản phẩm(tối đa 5 hình):
                                        </Typography>
                                        <div className="container mt-3 w-100" >
                                            <div className="card shadow-sm w-100" style={{ width: "100%" }}>
                                                <div className="card-header d-flex justify-content-between" style={{ height: 70 }}>
                                                    <input
                                                        accept="image/*"
                                                        className={classes.input}
                                                        id="image"
                                                        name="image"
                                                        multiple
                                                        hidden
                                                        type="file"
                                                        onChange={this.imageSelect}
                                                    />
                                                    <label htmlFor="image">
                                                        <Tooltip title="Chọn hình ảnh từ thư viện">
                                                            <IconButton onClick={this.openFolder} color="primary" aria-label="upload picture" component="span">
                                                                <PhotoCamera />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </label>
                                                </div>

                                                <div className="card-body d-flex flex-wrap justify-content-start">
                                                    {this.state.images.length === 0 ? <Typography variant="body2" gutterBottom style={{ marginLeft: 20 }}>
                                                        Chưa có hình ảnh được chọn
                                                    </Typography> : ""}
                                                    {this.state.images.map((i, index) => {
                                                        return <div className="image_container d-flex justify-content-center position-relative">
                                                            <img src={i.url} alt="Hình ảnh" />
                                                            <span onClick={() => this.deleteImage(this.state.images.indexOf(i))} className="position-absolute">&times;</span>
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        this.setState({
                                            open: false
                                        })
                                    }}
                                    color="primary">
                                    Xác nhận
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </div>
            </Grid>

        )
    }
}

RatingOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RatingOrder);