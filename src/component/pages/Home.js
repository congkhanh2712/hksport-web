import React, { Component } from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CategoryCard from '../../card/CategoryCard';
import TopProduct from '../../card/TopProduct';
import instance from '../../AxiosConfig';
import ZoomImageDialog from '../account/Cart/Dialog/ZoomImageDialog';
const GREY = "#9E9E9E";

const styles = ({
  root: {
    //maxWidth: 345,
    maxWidth: 2250,
  },
  media: {
    //height: 300,
    height: 170,
  },
  name: {
  },
  well: {
    boxShadow: `3px 3px 10px 3px ${GREY}`,
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      fbCompetition: [],
      fbProducts: [],
      fbCategory: [],
      zoomDialog: false,
      src: '',
    }
  }

  componentDidMount = async () => {
    if (localStorage && localStorage.getItem('user')) {
      var user = JSON.parse(localStorage.getItem("user"));
      this.props.isLogin(user);
    };

    this.getCategories();
    this.getProducts();
    this.getCompetitions();
  }

  clickCard = (name) => {
    console.log(name)
  }
  getProducts = async () => {
    instance.get('/products/topproduct/10')
      .then((response) => {
        this.setState({
          fbProducts: response.data,
        })
      }).catch(err => console.log(err))
  }
  getCategories = async () => {
    instance.get('/category')
      .then((response) => {
        this.setState({
          fbCategory: response.data,
        })
      }).catch(err => console.log(err))
  }
  getCompetitions = async () => {
    instance.get('/competition')
      .then((response) => {
        this.setState({
          fbCompetition: response.data.list,
        })
      }).catch(err => console.log(err))
  }
  zoomImage = (src) => {
    this.setState({
      src,
      zoomDialog: true
    })
  }
  render() {
    const { classes } = this.props;
    var { fbCompetition, fbProducts, fbCategory, zoomDialog, src } = this.state;

    var settings = {
      dots: false,
      infinite: false,
      speed: 1000,
      slidesToShow: 5,
      slidesToScroll: 4
    };
    //lấy mảng size
    var size = [];
    fbProducts.map((x) => {
      size.push(Object.values(x.Size));
      return 0
    })
    //số lượng hàng còn lại
    var sl = [];
    size.map((x) => {
      var sum = 0;
      x.forEach((elm) => {
        sum = sum + elm;
      })
      sl.push(sum);
      return 0
    })
    return (
      <div style={{ backgroundColor: "#f0f0f0", paddingBlock: 15 }}>
        <Grid container
          justify='space-between'
          direction='row' style={{ paddingInline: "14%" }}>
          <Carousel style={{ width: "60%" }} className={classes.well}>
            {fbCompetition.map((x, index) => {
              return <Carousel.Item key={index}>
                <img
                  onClick={() => this.zoomImage(x.Banner)}
                  style={{ cursor: 'zoom-in' }}
                  height="300"
                  className="d-block w-100"
                  src={x.Banner}
                  alt={x.Name}
                />
              </Carousel.Item>
            })}
          </Carousel>
          <Carousel style={{ width: "39%" }} className={classes.well}>
            {fbCategory.map((x, index) => {
              return <Carousel.Item key={index}>
                <img
                  onClick={() => this.zoomImage(x.Image)}
                  style={{ cursor: 'zoom-in' }}
                  height="300"
                  className="d-block w-100"
                  src={x.Image}
                  alt={x.Name}
                />
              </Carousel.Item>
            })}
          </Carousel>
        </Grid>
        <div
          className={classes.well}
          style={{ backgroundColor: "white", margin: 200, marginTop: 20, marginBottom: 0, borderRadius: 10 }}
        >
          <Typography variant="h6" gutterBottom style={{ marginLeft: 15, }}>
            Top 10 sản phẩm bán chạy nhất
          </Typography>
          <Divider style={{ marginTop: -5, marginBottom: 10 }}></Divider>
          <Slider {...settings}>
            {fbProducts.map((product, index) =>
              <TopProduct
                key={index}
                product={product}
                classes={classes}
                sl={sl[index]}
              />)}
          </Slider>
        </div>
        {fbCategory.map((item) =>
          <CategoryCard
            searchProduct={this.props.searchProduct}
            keyProductType={this.props.keyProductType}
            key={item.key}
            classes={this.props.classes}
            category={item}
          />)}
        {zoomDialog
          ? <ZoomImageDialog
            close={() => {
              this.setState({ zoomDialog: false })
            }}
            src={src} />
          : null
        }
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home);
