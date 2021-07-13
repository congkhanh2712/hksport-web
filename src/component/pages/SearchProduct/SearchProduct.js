import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import fbApp from "../../../Firebase"
import { green } from '@material-ui/core/colors';
import {
    Divider,
    Radio,
    Grid,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Typography,
    NativeSelect,
    InputLabel,
    Button,
    TextField,
    Card, CardContent, CardMedia, CardActionArea
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SearchCard from './SearchCard'
import instance from '../../../AxiosConfig';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    formControl: {
        margin: theme.spacing(-0, 1, 0, 3),
        minWidth: "50%",
    },
    formControlFilter: {
        minWidth: "90%",
    },
    media: {
        //height: 300,
        height: 200,
    },
    rootcard: {
        maxWidth: 210,
    }
});

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

class SearchProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbProducts: [],
            products: [],
            fbRatings: [],
            fbProductType: [],
            fbCompetition: [],
            fbCategory: [],
            fbBrand: [],
            fbMaterial: [],
            selectedValue: "latest",
            filterForm: false,
            productType: "all",
            from: "",
            //state của menu lọc:
            minPrice: "",
            maxPrice: "",
            categoryid: "",
            competition: "",
            rating: 0,
            brand: "",
            material: ""
        }
    }

    handleChange = (event) => {
        this.setState({
            selectedValue: event.target.value
        })
    };

    componentDidMount = async () => {
        var user
        var from
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        if (localStorage && localStorage.getItem('from')) {
            from = JSON.parse(localStorage.getItem("from"));
            if (from.from === "home") {
                var key = JSON.parse(localStorage.getItem("keyProductType"));
                this.setState({
                    productType: key.key
                })
            }
        };
        this.getProductType();
        this.getCompetitions();
        this.getBrands();
        this.getCategories();
        this.getRating();
        this.getProducts();
        this.getMaterials();
    }
    getProducts = () => {
        instance.get('/products')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbProducts: res.data,
                        products: res.data,
                    })
                }
            })
    }
    getBrands = () => {
        instance.get('/brand/all')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbBrand: res.data
                    })
                }
            })
    }
    getCompetitions = () => {
        instance.get('/competition')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbCompetition: res.data.list
                    })
                }
            })
    }
    getCategories = () => {
        instance.get('/category')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbCategory: res.data
                    })
                }
            })
    }
    getProductType = () => {
        instance.get('/producttype')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbProductType: res.data.list
                    })
                }
            })
    }
    getRating = () => {
        instance.get('/rating')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbRatings: res.data.list
                    })
                }
            })
    }
    getMaterials = () => {
        instance.get('/products/list/materials', { params: { page: 0 } })
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        fbMaterial: res.data.list,
                    })
                }
            })
    }
    searchProduct(keyword, str) {
        let arr = []; //Lưu các từ được tách ra từ keyword
        let index = []; //lưu vị trí dấu cách
        let d = 0;

        keyword = keyword.trim(); //Xóa các dấu cách thừa ở đầu hoặc ở cuối của keyword
        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i] === " ") {
                index.push(i);
            }
        }

        if (index.length === 0) {
            arr.push(keyword);
        } else {
            for (let i = 0; i < index.length; i++) {  //đưa từng từ vào arr[]
                if (i === 0) {
                    arr.push(keyword.slice(0, index[i]));
                }
                if (i != (index.length - 1) && i != 0) {
                    arr.push(keyword.slice(index[i - 1] + 1, index[i]));
                }
                if (i === index.length - 1) {
                    arr.push(keyword.slice(index[i - 1] + 1, index[i]));
                    arr.push(keyword.slice(index[i] + 1, keyword.length));
                }
            }
        }
        for (var x of arr) {
            if (str.indexOf(x) !== -1) d++;
        }
        if (d === arr.length) return true;
        else return false;
    }
    removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }

    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
    }
    submitFilter = () => {
        this.setState({
            minPrice: "",
            maxPrice: "",
            categoryid: "",
            competition: "",
            rating: 0,
            brand: "",
            material: ""
        })
    }
    render() {
        var { fbProducts, fbBrand, fbCompetition, fbCategory, fbRatings, fbProductType, products, selectedValue, productType } = this.state;
        var { props, classes, keyProductType } = this.props;
        const slug = this.props.match.params.slug;

        // khi load lại trang props sẽ mất nên phải kiểm tra nếu nó mất thì nó đc gán lại giá trị đc lưu trong localstorage

        if (props === "") {
            if (localStorage.getItem('from') && JSON.parse(localStorage.getItem("from")).from === "home") {
                props = JSON.parse(localStorage.getItem("nameProductType")).name
                keyProductType = JSON.parse(localStorage.getItem("keyProductType")).key
            } else if (localStorage.getItem('from')) {
                props = JSON.parse(localStorage.getItem("search")).keyword
            } else {
                productType = slug
            }
        }
        //lọc sản phẩm giống với từ khoá tìm kiếm
        if (keyProductType === "") {
            products = fbProducts.filter((x) => {
                if (this.searchProduct(this.removeVietnameseTones(props.toLowerCase()), this.removeVietnameseTones(x.Name.toLowerCase())) === true) {
                    return x;
                }
            })
        }
        //lọc sản phẩm mới nhất
        if (selectedValue === "latest") {
            products = products.reverse()
        }
        //lọc sản phẩm phổ biến
        if (selectedValue === "popular") {
            products = products.sort((a, b) => {
                return b.Sold - a.Sold
            })
        }
        //lọc sản phẩm từ giá cao đến giá thấp
        if (selectedValue === "fromhighprice") {
            products = products.sort((a, b) => {
                return b.Price - a.Price
            })
        }
        //lọc sản phẩm từ giá cao đến giá thấp
        if (selectedValue === "fromlowprice") {
            products = products.sort((a, b) => {
                return a.Price - b.Price
            })
        }
        //lọc sản phẩm theo danh mục
        if (productType !== "all") {
            products = products.filter(x => {
                return x.Product_Type === productType
            })
        }

        //lọc trong menu lọc:
        //lọc sp lớn hơn giá min
        if (this.state.minPrice !== "") {
            products = products.filter(x => {
                return x.Price >= (this.state.minPrice * 1)
            })
        }
        //lọc sp bé hơn giá max
        if (this.state.maxPrice !== "") {
            products = products.filter(x => {
                return x.Price <= (this.state.maxPrice * 1)
            })
        }
        //lọc sp theo loại sản phẩm
        if (this.state.categoryid !== "") {
            products = products.filter(x => {
                return x.CategoryID === this.state.categoryid
            })
        }
        //lọc sp theo giải đấu
        if (this.state.competition !== "") {
            products = products.filter(x => {
                return x.CompetitionID === this.state.competition
            })
        }
        //lọc sp theo đánh giá
        if (this.state.rating * 1 > 0) {
            products = products.filter(x => {
                return x.Rating >= this.state.rating * 1
            })
        }
        //lọc sp theo thương hiệu
        if (this.state.brand !== "") {
            products = products.filter(x => {
                return x.BrandID === this.state.brand
            })
        }
        //lọc sp theo chất liệu
        if (this.state.material !== "") {
            products = products.filter(x => {
                return x.Material.toLowerCase() === this.state.material
            })
        }
        return (
            <div style={{ backgroundColor: "#f0f0f0", minHeight: 500 }}>
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                        <div
                            className={classes.well}
                            style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 60 }}
                        >
                            <FormControl component="fieldset">
                                {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
                                <RadioGroup row aria-label="position" name="position" defaultValue="latest" value={this.state.selectedValue} onChange={this.handleChange} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                                    <FormControlLabel value="latest" control={<Radio color="primary" />} label="Mới nhất" style={{ marginRight: 80 }} />
                                    <FormControlLabel value="popular" control={<Radio color="primary" />} label="Phổ biến" style={{ marginRight: 80 }} />
                                    <FormControlLabel value="fromhighprice" control={<Radio color="primary" />} label="Giá giảm dần" style={{ marginRight: 75 }} />
                                    <FormControlLabel value="fromlowprice" control={<Radio color="primary" />} label="Giá tăng dần" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </Grid>

                    <Grid item xs={6}>
                        <div
                            className={classes.well}
                            style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 60 }}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={8} >
                                    <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                        <FormControl
                                            className={classes.formControl}
                                        >
                                            <InputLabel >Danh mục</InputLabel>
                                            <NativeSelect
                                                value={productType}
                                                //defaultValue={category}
                                                inputProps={{
                                                    name: 'productType',
                                                }}
                                                onChange={this.onChange}
                                            >
                                                {/* <option aria-label="None" value="" /> */}
                                                <option value="all">Tất cả</option>
                                                {fbProductType.map((x, index) => {
                                                    return <option key={index} value={x.key}>{x.Name}</option>
                                                })}
                                            </NativeSelect>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={4} >
                                    <div style={{ marginTop: 13, marginLeft: 140 }}>
                                        <Button variant="contained" color="primary" onClick={() => {
                                            this.setState({
                                                filterForm: !this.state.filterForm,
                                            })
                                        }}>
                                            {/* <FilterListIcon style={{ marginTop: -2 }} /> */}
                                            <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>
                                                Lọc {this.state.filterForm ? <ArrowUpwardIcon style={{ marginTop: -2 }} /> : <ArrowDownwardIcon style={{ marginTop: -2 }} />}
                                            </div>
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>

                    {this.state.filterForm ? <Grid item xs={12}>
                        <div
                            className={classes.well}
                            style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: "auto" }}
                        >
                            <Grid container spacing={0} style={{ paddingLeft: 20 }}>
                                <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                    Lọc sản phẩm:
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container spacing={0} style={{ paddingLeft: 20 }}>
                                {/* lọc theo giá */}
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, borderRight: `2px solid #f0f0f0` }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                            Giá:
                                        </Grid>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginTop: -10 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={5}>
                                                    {/* giá min */}
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        name="minPrice"
                                                        label="Giá min"
                                                        onChange={this.onChange}
                                                        value={this.state.minPrice}
                                                    />
                                                </Grid>
                                                <Grid item xs={1} style={{ marginLeft: 5, marginTop: 13 }}>
                                                    _
                                                </Grid>
                                                <Grid item xs={5}>
                                                    {/* giá max */}
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        name="maxPrice"
                                                        label="Giá max"
                                                        onChange={this.onChange}
                                                        value={this.state.maxPrice}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* lọc theo loại sản phẩm */}
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, borderRight: `2px solid #f0f0f0`, paddingLeft: 20 }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                            Loại sản phẩm:
                                        </Grid>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginTop: 12 }}>
                                            <FormControl className={classes.formControlFilter}>
                                                <NativeSelect
                                                    value={this.state.categoryid}
                                                    inputProps={{
                                                        name: 'categoryid',
                                                    }}
                                                    onChange={this.onChange}
                                                >
                                                    {/* <option aria-label="None" value="" /> */}
                                                    <option value="">Tất cả</option>
                                                    {fbCategory.map((x, index) => {
                                                        return <option key={index} value={x.key}>{x.Name}</option>
                                                    })}
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* lọc theo giải đấu */}
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, borderRight: `2px solid #f0f0f0`, paddingLeft: 20 }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                            Giải đấu:
                                        </Grid>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginTop: 12 }}>
                                            <FormControl className={classes.formControlFilter}>
                                                <NativeSelect
                                                    value={this.state.competition}
                                                    inputProps={{
                                                        name: 'competition',
                                                    }}
                                                    onChange={this.onChange}
                                                >
                                                    {/* <option aria-label="None" value="" /> */}
                                                    <option value="">Tất cả</option>
                                                    {fbCompetition.map((x, index) => {
                                                        return <option key={index} value={x.key}>{x.Name}</option>
                                                    })}
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* lọc theo đánh giá */}
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, borderRight: `2px solid #f0f0f0`, paddingLeft: 20 }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                            Đánh giá:
                                        </Grid>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginTop: 12 }}>
                                            <FormControl className={classes.formControlFilter}>
                                                <NativeSelect
                                                    value={this.state.rating}
                                                    inputProps={{
                                                        name: 'rating',
                                                    }}
                                                    onChange={this.onChange}
                                                >
                                                    {/* <option aria-label="None" value="" /> */}
                                                    <option value="">Tất cả</option>
                                                    <option value={5}>5 sao</option>
                                                    <option value={4}>Từ 4 sao</option>
                                                    <option value={3}>Từ 3 sao</option>
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* lọc theo thương hiệu */}
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, borderRight: `2px solid #f0f0f0`, paddingLeft: 20 }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                            Thương hiệu:
                                        </Grid>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginTop: 12 }}>
                                            <FormControl className={classes.formControlFilter}>
                                                <NativeSelect
                                                    value={this.state.brand}
                                                    inputProps={{
                                                        name: 'brand',
                                                    }}
                                                    onChange={this.onChange}
                                                >
                                                    {/* <option aria-label="None" value="" /> */}
                                                    <option value="">Tất cả</option>
                                                    {fbBrand.map((x, index) => {
                                                        return <option key={index} value={x.key}>{x.Name}</option>
                                                    })}
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* lọc theo chất liệu */}
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, borderRight: `2px solid #f0f0f0`, paddingLeft: 20 }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                            Chất liệu:
                                        </Grid>
                                        <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginTop: 12 }}>
                                            <FormControl className={classes.formControlFilter}>
                                                <NativeSelect
                                                    value={this.state.material}
                                                    inputProps={{
                                                        name: 'material',
                                                    }}
                                                    onChange={this.onChange}
                                                >
                                                    {/* <option aria-label="None" value="" /> */}
                                                    <option value="">Tất cả</option>
                                                    {this.state.fbMaterial.map((x, index) => {
                                                        return <option key={index} value={x}>{x}</option>
                                                    })}
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container spacing={0} style={{ paddingLeft: 20 }}>
                                <Grid item xs={12} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, marginLeft: "44.5%" }}>
                                    <Button variant="contained" color="primary" onClick={this.submitFilter} style={{ margin: 10 }}>
                                        <div style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>Đưa về mặc định</div>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid> : ""}

                    <Grid item xs={12}>
                        <div
                            className={classes.well}
                            style={{
                                margin: 10,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                shadow: 10,
                                height: "auto",
                                fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                                //paddingLeft: 20,
                                //borderRight: `2px solid #f0f0f0`,
                            }}
                        >
                            <Grid container spacing={0} style={{ paddingLeft: 20 }}>
                                <Grid item xs={2} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                    Kết quả tìm kiếm:
                                </Grid>
                                <Grid item xs={10}>
                                    <div style={{ marginLeft: -120, fontWeight: "bold", fontStyle: "italic" }}>{props}</div>
                                </Grid>
                            </Grid>
                            <Divider />
                            {products.length === 0 ? <Typography align="center" variant="h6" gutterBottom>
                                Không có sản phẩm phù hợp theo tiêu chí bạn tìm kiếm
                            </Typography> : ""}
                            <Grid container spacing={0} style={{ paddingLeft: 20 }}>
                                {products.map((product, index) => {
                                    return (
                                        <Grid
                                            key={product}
                                            item xs={6} sm={2} key={index}>
                                            <SearchCard
                                                key={product}
                                                data={product} rating={fbRatings} />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                    </Grid>
                    <Divider />
                </Grid>
            </div>
        )
    }
}

SearchProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchProduct);