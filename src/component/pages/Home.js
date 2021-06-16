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
import CategoryCard from '../../card/CategoryCard';
import TopProduct from '../../card/TopProduct';
import instance from '../../AxiosConfig';
//import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
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

  render() {
    const { classes } = this.props;
    var { fbCompetition, fbProducts, fbCategory } = this.state;

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
      <div style={{ backgroundColor: "#f0f0f0" }}>
        <div style={{ paddingLeft: "25%", paddingRight: "25%" }} >
          <Carousel style={{ width: "100%" }} className={classes.well}>
            {fbCompetition.map((x, index) => {
              return <Carousel.Item key={index}>
                <img
                  height="300"
                  className="d-block w-100"
                  src={x.Banner}
                  alt={x.Name}
                />
              </Carousel.Item>
            })}
          </Carousel>
        </div>
        {/* cac san pham ban chay */}
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
            key={item.key}
            classes={this.props.classes}
            category={item}
          />)}
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home);
