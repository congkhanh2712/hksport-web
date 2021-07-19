import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, NativeSelect, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from 'react-bootstrap/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Divider from '@material-ui/core/Divider';
import Rating from '@material-ui/lab/Rating';
import { Carousel } from 'react-bootstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Comment from './Comment';
import MuiDialogContent from '@material-ui/core/DialogContent';
import instance from '../../../AxiosConfig';
import Dialog from '@material-ui/core/Dialog';


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
});
const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
        marginTop: theme.spacing(-3),
        marginBottom: theme.spacing(0),
    },
}))(MuiDialogContent);

class SearchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {},//lưu obj sản phẩm
            size: 0,//lưu bảng size
            title: "Thêm sp vào danh sách yêu thích", //tooltip của button like
            color: "pink",//màu mặc định khi chưa like sp, khi like rồi thì màu đỏ
            liked: false,//trạng thái ban đầu là chưa like
            selectSize: "", //size đặt
            number: 0, //số lượng đặt hàng
            //thương hiệu
            brand: "",
            imagelist: [],
            loading: true,
        }
    }
    likedProduct = () => {
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        const slug = this.props.match.params.slug;
        if (user == null) {
            alert("Bạn cần đăng nhập để thực hiện chức năng này")
            return;
        } else {
            this.setState({ liked: !this.state.liked });
            instance.put('/seen/' + slug, {
                like: !this.state.liked,
                remove: null
            })
        }
    }
    addToCart = () => {
        var user = null
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        if (user == null) {
            alert("Bạn cần đăng nhập để thực hiện chức năng này")
            return;
        }
        const slug = this.props.match.params.slug;
        const { size, selectSize, number } = this.state;
        if (selectSize === "" && isNaN(parseInt(size))) {
            alert("Bạn chưa chọn size")
            return;
        } else if (number === 0) {
            alert("Bạn chưa chọn số lượng")
            return;
        } else {
            if (isNaN(parseInt(size))) {
                size.forEach(x => {
                    if (x[0] === selectSize) {
                        if (number > x[1]) {
                            alert("Số lượng sản phẩm bạn đặt vượt quá số lượng sản phẩm của shop")
                            return;
                        } else {
                            this.postToCart(slug);
                        }
                    }
                })
            } else {
                if (size < number) {
                    alert("Số lượng sản phẩm bạn đặt vượt quá số lượng sản phẩm của shop")
                    return;
                } else {
                    this.postToCart(slug);
                }
            }
        }
    }
    postToCart(slug) {
        const { number, product, selectSize } = this.state;
        instance.post('/cart', {
            ProductID: slug,
            Name: product.Name,
            Size: selectSize,
            Quantity: parseInt(number),
            Price: product.Price,
            Image: product.Image,
        }).then((res) => {
            if (res.status == 200) {
                alert("Đã thêm sản phẩm vào giỏ hàng")
                this.getDataProduct(slug);
                this.setState({
                    selectSize: '',
                    number: 0,
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
        if (this.state.number < 0) {
            this.setState({
                number: 0
            })
        }
    }

    componentDidMount = async () => {
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        const slug = this.props.match.params.slug;
        await this.getDataProduct(slug).then(() => {
            this.seenProduct(user, slug);
        })
        this.getLikeStatus(user, slug);
    }
    getDataProduct = async (slug) => {
        await instance.get('/products/' + slug)
            .then((res) => {
                this.getBrandName(res.data.BrandID);
                var size;
                if (isNaN(parseInt(res.data.Size)) == true) {
                    size = [];
                    Object.entries(res.data.Size).forEach(([key, value]) => {
                        var item = [];
                        item.push(key, value);
                        size.push(item);
                    });
                } else {
                    size = parseInt(res.data.Size);
                }
                this.getQuantityData(slug, size);
                this.getImageList(res.data.Image);
                this.setState({
                    product: res.data,
                    loading: false,
                })
            })
    }
    getQuantityData = async (slug, items) => {
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        if (user == null) {
            this.setState({
                size: items
            })
        } else {
            var cart = []
            await instance.get('/cart')
                .then((res) => {
                    cart = res.data;
                })
            if (isNaN(parseInt(items))) {
                items.forEach(e => {
                    for (let j = 0; j < cart.length; j++) {
                        if (e[0] == cart[j].Size && slug == cart[j].ProductID) {
                            e[1] = e[1] - cart[j].Quantity;
                            cart.filter(item => item.size != cart[j].Size);
                            j = cart.length;
                        }
                    }
                })
            } else {
                for (let j = 0; j < cart.length; j++) {
                    if (slug == cart[j].ProductID) {
                        items = items - cart[j].Quantity;
                        j = cart.length;
                    }
                }
            }
            this.setState({
                size: items
            })
        }
    }
    seenProduct = async (existUser, slug) => {
        const { product } = this.state;
        //nếu đã đăng nhập rồi thì đưa vô bảng "seen":
        if (existUser != null) {
            instance.post('/seen/' + slug, {
                Image: product.Image,
                Name: product.Name,
                Price: product.Price,
                Remove: false,
                Time: Date.now(),
            })
        }
    }
    getLikeStatus = async (existUser, slug) => {
        //nếu có user thì kiểm tra xem đã like sp đó chưa r setstate
        if (existUser != null) {
            instance.get('/seen/liked/' + slug)
                .then(res => {
                    if (res.status == 200) {
                        this.setState({
                            liked: res.data.result,
                        })
                        if (res.data.result == true) {
                            this.setState({
                                title: "Xoá sp khỏi danh sách yêu thích",
                            })
                        } else {
                            this.setState({
                                title: "Thêm sp vào danh sách yêu thích",
                            })
                        }
                    }
                })
        }
    }
    getBrandName = (id) => {
        if (id == "Chưa cập nhật") {
            this.setState({
                brand: "Chưa cập nhật"
            })
        } else {
            instance.get('/brand/' + id)
                .then(res => {
                    if (res.status == 200) {
                        this.setState({
                            brand: res.data.Name
                        })
                    }
                })
        }
    }
    //Get List hình ảnh
    getImageList = (img) => {
        const slug = this.props.match.params.slug;
        instance.get('/image/' + slug)
            .then(res => {
                var temp = [{
                    key: '0',
                    Link: img,
                    Product_id: slug,
                }];
                res.data.list.forEach(e => {
                    temp.push(e)
                })
                this.setState({
                    imagelist: temp,
                })
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
    render() {
        const { product, size, loading, imagelist, open, src, liked } = this.state;
        const slug = this.props.match.params.slug;
        var { classes } = this.props;
        var sp = 0;
        if (isNaN(parseInt(size))) {
            size.forEach(x => {
                sp = sp + x[1]
            })
        } else {
            sp = size;
        }
        return (
            <div style={{ backgroundColor: "#f0f0f0" }}>
                <Grid container spacing={0} style={{ paddingInline: "15%", marginBlock: 10 }}>
                    <Grid item xs={12} className={classes.well}>
                        <Grid container spacing={0} style={{ backgroundColor: 'white', height: "auto" }}>
                            <Grid item xs={6}>
                                {loading == false
                                    ? <Grid>
                                        <div style={{ paddingInline: "20%", paddingBlock: 20 }} >
                                            <Carousel style={{ width: "100%", borderRadius: 10 }}>
                                                {imagelist.map(x =>
                                                    <Carousel.Item >
                                                        <img
                                                            height="400"
                                                            style={{ cursor: 'zoom-in' }}
                                                            className="d-block w-100"
                                                            src={x.Link}
                                                            alt="Hình ảnh"
                                                            onClick={() => this.handleClickOpen(x.Link)}
                                                        />
                                                    </Carousel.Item>
                                                )}
                                            </Carousel>
                                        </div>

                                        <Typography variant="subtitle2" gutterBottom align="center" color="secondary">
                                            Giá sản phẩm: {product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                                        </Typography>
                                        <Typography variant="body2" gutterBottom align="center">
                                            Đã bán: {product.Sold}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom align="center" style={{ marginBottom: 5 }}>
                                            Tình trạng: {sp > 0 ? "Còn hàng" : "Hết hàng"}
                                        </Typography>
                                        <Grid container spacing={1} style={{ marginLeft: "28%" }}>
                                            <Grid item >
                                                <Typography variant="body2" gutterBottom align="center">
                                                    Đánh giá:
                                                </Typography>
                                            </Grid>
                                            <Grid item style={{ marginTop: -2 }}>
                                                <Rating name="read-only" value={product.Rating * 1} readOnly precision={0.5} />
                                            </Grid>
                                            <Grid item >
                                                <Typography variant="body2" gutterBottom align="center">
                                                    {product.Rating > 0 ? `(${product.Rating} sao)` : `(Chưa có đánh giá)`}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} style={{ marginLeft: "35%", marginTop: -20 }}>
                                            <Grid item >
                                                <Typography variant="body2" gutterBottom style={{ marginTop: 15 }}>
                                                    Yêu thích sản phẩm:
                                                </Typography>
                                            </Grid>
                                            <Grid item >
                                                <Tooltip title={this.state.title} placement="right">
                                                    <IconButton onClick={this.likedProduct}>
                                                        <FavoriteIcon style={liked == true
                                                            ? { color: 'red' }
                                                            : { color: 'pink' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    : <Grid container
                                        direction='row'
                                        style={{ minHeight: 250 }}
                                        justify='center'
                                        alignItems='center'>
                                        <CircularProgress />
                                    </Grid>
                                }

                            </Grid>

                            <Grid item xs={6} style={{ borderLeft: `2px solid #f0f0f0` }}>
                                <Typography variant="h6" gutterBottom align="center">
                                    Chi tiết sản phẩm
                                </Typography>
                                <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                    <Grid item >
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Tên sản phẩm:
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ marginRight: "3%" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {product.Name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                    <Grid item >
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Màu sắc:
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ marginRight: "3%" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {product.Color}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                    <Grid item >
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Chất liệu:
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ marginRight: "3%" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {product.Material}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                    <Grid item >
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Xuất xứ:
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ marginRight: "3%" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {product.Source === undefined ? "Chưa cập nhật" : `${product.Source}`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                    <Grid item >
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Thương hiệu:
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ marginRight: "3%" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {this.state.brand === "" ? "Chưa cập nhật" : this.state.brand}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                    <Grid item >
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Mô tả sản phẩm:
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ marginRight: "5%" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {product.Description === "" ? "Chưa cập nhật" : product.Description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {isNaN(parseInt(size))
                                    ? <Grid>
                                        <Typography variant="h6" gutterBottom align="center">
                                            Số lượng sản phẩm hiện có
                                        </Typography>
                                        <TableContainer style={{}} >
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Size</TableCell>
                                                        {size.map(x => {
                                                            return <TableCell align="left">{x[0]}</TableCell>
                                                        })}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">
                                                            Số lượng
                                                        </TableCell>
                                                        {size.map(x => {
                                                            return <TableCell align="left">{x[1]}</TableCell>
                                                        })}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                    : <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                        <Grid item >
                                            <Typography variant="subtitle1" gutterBottom align="center">
                                                Số lượng sản phẩm hiện có:
                                            </Typography>
                                        </Grid>
                                        <Grid item style={{ marginRight: "5%" }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {size}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                                <Divider />
                                <Grid style={{ paddingBlock: 10 }}>
                                    <Typography variant="h6" gutterBottom align="center">
                                        Mua sản phẩm
                                    </Typography>
                                    <Grid container spacing={1} style={{ marginLeft: "3%" }}>
                                        {isNaN(parseInt(size))
                                            ? <Grid item style={{ width: '32%' }}>
                                                <FormControl className={classes.formControl} style={{ width: '98%' }}>
                                                    <InputLabel >Size</InputLabel>
                                                    <NativeSelect
                                                        value={this.state.selectSize}
                                                        defaultValue={this.state.selectSize}
                                                        inputProps={{
                                                            name: 'selectSize',
                                                        }}
                                                        onChange={this.onChange}
                                                    >
                                                        <option aria-label="None" value="" />
                                                        {size.map(x => {
                                                            return <option value={x[0]}>{x[0]}</option>
                                                        })}
                                                    </NativeSelect>

                                                </FormControl>
                                            </Grid>
                                            : null
                                        }
                                        <Grid item style={isNaN(parseInt(size)) ? { width: '32%' } : { width: '62%' }}>
                                            <TextField
                                                value={this.state.number}
                                                style={{ width: '98%' }}
                                                label="Số lượng"
                                                type="number"
                                                name="number"
                                                onChange={this.onChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item style={{ marginLeft: "3%", marginTop: 10 }}>
                                            <Button
                                                onClick={this.addToCart}
                                                variant="success"
                                                style={{
                                                    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                                                    width: "120%",
                                                }}>
                                                Chọn mua
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open} maxWidth={false}>
                    <DialogContent dividers>
                        <img src={src} alt="Hình ảnh"
                            onClick={() => this.handleClickOpen(src)} />
                    </DialogContent>
                </Dialog>
                <Comment slug={slug} product={product} star={product.Rating * 1} />
            </div>
        )
    }
}

SearchCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchCard);