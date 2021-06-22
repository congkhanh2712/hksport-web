import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, ProgressBar } from 'react-bootstrap';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Redirect, Link, NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';


export default class HomeProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    clickCard = (name) => {
        console.log(name)
    }
    render() {
        const { product, classes, sl } = this.props;
        return (
            <Col style={{ marginBottom: 5 }} key={product.key}>
                <NavLink to={`/detail-product/${product.key}`} style={{ textDecoration: "none" }}>
                    <Card className={classes.root} onClick={() => this.clickCard(product.key)}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={product.Image}
                                title={product.Name}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom variant="caption" component="h3" noWrap style={{ marginTop: -5, marginBottom: -20 }}>
                                            {product.Name}
                                        </Typography>
                                    </Grid >
                                    <Grid item xs={5} style={{ marginTop: -5 }}>
                                        <Typography gutterBottom variant="caption" component="h3" >
                                            Đã bán:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={7} style={{ marginTop: -5 }}>
                                        <ProgressBar style={{ marginLeft: -30 }}>
                                            <ProgressBar
                                                label={`${product.Sold}/${sl + product.Sold}`}
                                                variant="success"
                                                now={product.Sold / (product.Sold + sl) * 100 > 25 ? product.Sold / (product.Sold + sl) * 100 : 25} key={1} />
                                        </ProgressBar>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </NavLink>
            </Col>
        );
    }
}