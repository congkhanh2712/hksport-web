import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import HomeProduct from './HomeProduct';
import instance from '../AxiosConfig';

export default class CategoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbProducts: [],
            fbType: [],
        }
    }
    componentDidMount() {
        instance.get('/products/category/' + this.props.category.key)
            .then((response) => {
                console.log(response.data)
                this.setState({
                    fbProducts: response.data,
                })
            })
        instance.get('/producttype/' + this.props.category.key, {
            params: { page: 1 }
        })
            .then((response) => {
                this.setState({
                    fbType: response.data.list,
                })
            })

    }
    render() {
        const { classes, category } = this.props;
        var { fbProducts, fbType } = this.state;
        var settings = {
            dots: false,
            infinite: false,
            speed: 1000,
            slidesToShow: 5,
            slidesToScroll: 4
        };
        if (fbProducts.length <= 0) {
            return (null);
        } else {
            return (
                <div
                    className={classes.well}
                    style={{
                        backgroundColor: "white", margin: 200, marginTop: 20,
                        marginBottom: 0, borderRadius: 10, shadow: 10,
                    }}
                >
                    <div className="clearfix">
                        <Typography variant="h6" gutterBottom style={{ marginLeft: 15 }} className="float-left">
                            {category.Name}
                        </Typography>
                        {fbType.map((x, index) => {
                            return <Link
                                key={index}
                                onClick={() => {                                 
                                    this.props.searchProduct(x.Name);
                                    this.props.keyProductType(x.key);
                                    localStorage.setItem('keyProductType', JSON.stringify({
                                        key: x.key,
                                    }));
                                    localStorage.setItem('nameProductType', JSON.stringify({
                                        name: x.Name,
                                    }));
                                    localStorage.setItem('from', JSON.stringify({
                                        from: "home",
                                    }));
                                }}
                                to={`/search-product/${x.key}`}
                                className="float-right"
                                style={{ marginRight: 15, marginTop: 10 }}>
                                {x.Name}
                            </Link>
                        })}
                    </div>
                    <Divider style={{ marginTop: -5, marginBottom: 10 }}></Divider>
                    <Slider {...settings}>
                        {fbProducts.slice(0,10).map((product) =>
                            <HomeProduct
                                key={product.key}
                                product={product} classes={classes} />
                        )}
                    </Slider>
                </div>
            );
        }
    }
}