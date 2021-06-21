import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import CardUpdate from './CardUpdate';
import Pagination from '@material-ui/lab/Pagination';
import instance from '../../AxiosConfig';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    NavLink
} from "react-router-dom";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "24.3%",
    },
});

class UpdateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbProducts: [],
            fbCategory: [], //lưu mảng TblCategory từ fb
            fbCompetition: [],//lưu mảng TblCompetition từ fb
            fbBrand: [],//lưu mảng TblBrand từ fb
            fbProductType: [],//lưu mảng TblProductType từ fb
            //
            products: [],
            searchProduct: "",
            page: 1,
            count: 0,
            //
            category: "",
            competition: "",
            brand: "",
            productType: "",
            loading: true,
        }
    }

    componentDidMount = async () => {
        this.getProducts();
        this.getProductTypes();
        this.getBrands();
        this.getCompetitions();
        this.getCategories();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.category != this.state.category) {
            this.getProductTypes();
            this.setState({
                productType: ''
            })
        }
        if (prevState.brand != this.state.brand && this.state.category != '') {
            this.getProductTypes();
            this.setState({
                productType: ''
            })
        }
    }
    getCategories = async () => {
        instance.get('/category')
            .then((response) => {
                this.setState({
                    fbCategory: response.data,
                })
            })
    }
    getBrands = async () => {
        instance.get('/brand/all')
            .then((response) => {
                this.setState({
                    fbBrand: response.data,
                })
            })
    }
    getProductTypes = async () => {
        var url = '/producttype';
        if (this.state.category != '') {
            url = url + '/' + this.state.category
        }
        if (this.state.brand != '') {
            url = url + '/' + this.state.brand;
        }
        instance.get(url, {
            params: { page: 0 }
        }).then((response) => {
            this.setState({
                fbProductType: response.data.list,
            })
        }).catch(err => console.log(err))
    }
    getProducts = () => {//lấy data và truyền vào state: fbProducts
        var temp = []; //mảng lưu TblProduct
        instance.get('/products').then((res) => {
            res.data.forEach((childSnapshot) => {
                temp.push({
                    key: childSnapshot.key,
                    name: childSnapshot.Name,
                    image: childSnapshot.Image,
                    categoryID: childSnapshot.CategoryID,
                    competitionID: childSnapshot.CompetitionID,
                    brandID: childSnapshot.BrandID,
                    productType: childSnapshot.Product_Type
                });
            });
            this.setState({
                fbProducts: temp,
                products: temp,
                loading: false,
            })
        })
    }
    getCompetitions = async () => {
        instance.get('/competition')
            .then((response) => {
                this.setState({
                    fbCompetition: response.data.list,
                })
            })
    }
    onSubmit = (event) => {
        event.preventDefault();
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        });
        if (name === "brand") {
            this.setState({
                productType: "",
            });
        }
        if (name === "category") {
            this.setState({
                competition: "",
                brand: "",
                productType: "",
            });
        }
        if (name === "searchProduct") {
            this.setState({
                page: 1,
            });
        }
    }

    handleChange = (event, value) => {
        this.setState({
            page: value,
        })
    }

    render() {
        var { searchProduct, fbProducts, fbCategory, fbCompetition, fbBrand, fbProductType, page, products, count,
            category, competition, brand, productType, loading } = this.state;
        //tìm kiếm
        if (searchProduct !== "") {
            products = fbProducts.filter((product) => {
                return product.name.toLowerCase().indexOf(searchProduct) !== -1;
            })
            if (products.length >= 6) {
                count = products.length / 6;
                if (count % 1 > 0) {
                    count = count - count % 1 + 1;
                }
            } else {
                count = 1;
            }

        }
        //lọc theo loại sp(áo, giày, dụng cụ khác...)
        if (category !== "") {
            products = products.filter((product) => {
                return product.categoryID === category;
            })
            if (products.length >= 6) {
                count = products.length / 6;
                if (count % 1 > 0) {
                    count = count - count % 1 + 1;
                }
            } else {
                count = 1;
            }
            // productType = "";
        }
        //lọc theo giải đấu
        if (competition !== "") {
            products = products.filter((product) => {
                return product.competitionID === competition;
            })
            if (products.length >= 6) {
                count = products.length / 6;
                if (count % 1 > 0) {
                    count = count - count % 1 + 1;
                }
            } else {
                count = 1;
            }
        }
        //lọc theo nhãn hiệu
        if (brand !== "") {
            products = products.filter((product) => {
                return product.brandID === brand;
            })
            if (products.length >= 6) {
                count = products.length / 6;
                if (count % 1 > 0) {
                    count = count - count % 1 + 1;
                }
            } else {
                count = 1;
            }
            // productType = "";
        }
        //lọc theo danh mục
        if (productType !== "") {
            products = products.filter((product) => {
                return product.productType === productType;
            })
            if (products.length >= 6) {
                count = products.length / 6;
                if (count % 1 > 0) {
                    count = count - count % 1 + 1;
                }
            } else {
                count = 1;
            }
        }

        //
        if (products.length >= 12) {
            count = products.length / 12;
            if (count % 1 > 0) {
                count = count - count % 1 + 1;
            }
        } else {
            count = 1;
        }
        if (page !== 0) {
            var temp = [];
            for (var i = (page - 1) * 12; i <= (page - 1) * 12 + 11; i++) {
                if (products[i]) {
                    temp.push(products[i])
                }
            }
            products = temp;
        }

        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                size="small"
                                label="Tìm kiếm"
                                disabled={loading}
                                placeholder="Nhập tên sản phẩm..."
                                variant="outlined"
                                fullWidth
                                name="searchProduct"
                                value={this.state.searchProduct}
                                onChange={this.onChange}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="delete"
                                                color="green"
                                                type="submit"
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                }} />
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl
                                className={classes.formControl}
                                style={{ marginTop: -10, marginRight: 5 }}
                            >
                                <InputLabel >Loại sản phẩm</InputLabel>
                                <NativeSelect
                                    value={category}
                                    defaultValue={category}
                                    inputProps={{
                                        name: 'category',
                                    }}
                                    onChange={this.onChange}
                                >
                                    <option aria-label="None" value="" />
                                    {fbCategory.map((x, index) => {
                                        return <option key={index} value={x.key}>{x.Name}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                            <FormControl
                                className={classes.formControl}
                                style={{ marginTop: -10, marginRight: 5 }}
                            >
                                <InputLabel >Giải đấu</InputLabel>
                                <NativeSelect
                                    value={competition}
                                    defaultValue={competition}
                                    inputProps={{
                                        name: 'competition',
                                    }}
                                    onChange={this.onChange}
                                >
                                    <option aria-label="None" value="" />
                                    {fbCompetition.map((x, index) => {
                                        return <option key={index} value={x.key}>{x.Name}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                            <FormControl
                                className={classes.formControl}
                                style={{ marginTop: -10, marginRight: 5 }}
                            >
                                <InputLabel >Nhãn hiệu</InputLabel>
                                <NativeSelect
                                    value={brand}
                                    defaultValue={brand}
                                    inputProps={{
                                        name: 'brand',
                                    }}
                                    onChange={this.onChange}
                                >
                                    <option aria-label="None" value="" />
                                    {fbBrand.map((x, index) => {
                                        return <option key={index} value={x.key}>{x.Name}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                            <FormControl
                                className={classes.formControl}
                                style={{ marginTop: -10, marginRight: 5 }}
                            >
                                <InputLabel >Danh mục sản phẩm</InputLabel>
                                <NativeSelect
                                    value={productType}
                                    defaultValue={productType}
                                    inputProps={{
                                        name: 'productType',
                                    }}
                                    onChange={this.onChange}
                                >
                                    <option aria-label="None" value="" />
                                    {fbProductType.map((x, index) => {
                                        return <option key={index} value={x.key}>{x.Name}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <NavLink to={`/admin/add-product`}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddBoxIcon />}
                                >
                                    Thêm sản phẩm
                                </Button>
                            </NavLink>
                        </Grid>
                    </Grid>
                </form>
                <hr />

                <Grid container spacing={3}
                    direction='row'
                    justify={loading == true ? 'center' : 'flex-start'}
                    style={{ marginTop: 5 }}>
                    {loading == true
                        ? <CircularProgress />
                        : products.map((product) => {
                            return (
                                <Grid item xs={6} sm={2} key={product.key}>
                                    <CardUpdate data={product} />
                                </Grid>
                            )
                        })
                    }
                </Grid>
                <Pagination
                    page={page}
                    showFirstButton
                    showLastButton
                    size="large"
                    count={count}
                    color="primary"
                    style={{
                        marginTop: 25,
                        marginLeft: "40%"
                    }}
                    onChange={this.handleChange}
                    boundaryCount={1}
                    siblingCount={0}
                />
            </div >
        )
    }
}

UpdateProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UpdateProduct);