import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from '@material-ui/core';
import "./RatingOrder.css"
import { storage } from "../../../../Firebase"
import CardRating from "./CardRating"
import ReactStars from "react-rating-stars-component";
import Button from 'react-bootstrap/Button';
import instance from '../../../../AxiosConfig';

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
            products: [],
            cmt: "",
            star: 5,
            btnRating: true,
        }
    }
    componentDidMount = async () => {
        this.getData()
    }
    getData = () => {
        const { slug } = this.props.match.params;
        instance.get('/order/detail/' + slug)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        btnRating: res.data.Rating,
                        products: res.data.OrderDetail
                    })
                }
            })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
    }
    rated = (id, size, star, comment, images) => {
        var products = this.state.products;
        for (let i = 0; i < products.length; i++) {
            if (products[i].ProductID == id && products[i].Size == size) {
                products[i].Rating = star;
                products[i].Comment = comment;
                products[i].Images = images;
                i = products.length;
            }
        }
        console.log(products)
        this.setState({ products });
    }
    ratingChanged = (newvalue) => {
        this.setState({
            star: newvalue
        })
    }
    postImg = (detail, list) => {
        var promises = [];
        list.map(async (image, index) => {
            const imgRef = storage.ref('images')
                .child('rating').child(`${Date.now()}_${index}.png`)
            imgRef.put(image.file).then(async () => {
                var url = await imgRef.getDownloadURL();
                promises.push(url)
                if (index == list.length - 1) {
                    console.log(promises)
                    this.postData(detail, promises);
                }
            }).catch(err => console.log(err))
        });
    }
    postData = (orderdetail, images) => {
        const slug = this.props.match.params.slug;
        instance.post('/rating/add/' + slug, {
            orderdetail, images
        }).then(() => {
            alert("Gửi đánh giá thành công")
        })
    }
    sentRatingOrder = async () => {
        const slug = this.props.match.params.slug;
        alert("Những sản phẩm chưa được đánh giá sẽ mặc định 5 sao")
        const { products } = this.state;
        products.forEach((e, index) => {
            if (e.Images != undefined) {
                this.postImg(e, e.Images)
            } else {
                this.postData(e, []);
            }
            if (index == products.length - 1) {
                instance.put('/order/received/' + slug, {
                    Received: true
                })
                instance.put('/order/detail/' + slug, {
                    Rating: parseInt(this.state.star),
                    Comment: this.state.cmt
                })
            }
        })
    }
    render() {
        var { classes } = this.props;
        return (
            <div style={{ minHeight: 500 }}>
                <Grid container spacing={0}>
                    {this.state.products.map((x, index) => {
                        return <CardRating
                            key={x.ProductID}
                            id={x.ProductID}
                            orderid={this.props.match.params.slug}
                            hinh={x.Image}
                            name={x.Name}
                            size={x.Size}
                            price={x.Price}
                            keyProduct={x.Key}
                            rating={x.Rating}
                            rated={this.rated}
                        />
                    })}

                    <Grid item xs={12}>
                        <div
                            className={classes.well}
                            style={{ borderRadius: 10, shadow: 10, height: "auto", margin: 10 }}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={6} style={{ borderRight: `2px solid #f0f0f0`, paddingLeft: "16.4%" }}>
                                    <Typography variant="subtitle2" gutterBottom style={{ marginLeft: "-45.4%" }}>
                                        Đánh giá chất lượng dịch vụ:
                                        </Typography>
                                    <ReactStars
                                        count={5}
                                        onChange={this.ratingChanged}
                                        size={60}
                                        value={this.state.star}
                                        activeColor="#ffd700"
                                        style={{ paddingLeft: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{}}>
                                    <Typography variant="subtitle2" gutterBottom style={{ marginLeft: 20 }}>
                                        Để lại nhận xét về dịch vụ:
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
                                <Grid item xs={12} style={{ marginTop: 10, borderTop: `2px solid #f0f0f0`, marginBottom: 20 }}>
                                    <Button
                                        disabled={this.state.btnRating}
                                        onClick={this.sentRatingOrder}
                                        variant="success"
                                        style={{
                                            fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                                            width: "auto",
                                            marginLeft: "44%",
                                            marginTop: 20
                                        }}>
                                        Gửi đánh giá đơn hàng
                                        </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

RatingOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RatingOrder);