import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storage } from "../../Firebase";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import toast, { Toaster } from 'react-hot-toast';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import instance from '../../AxiosConfig';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(0),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        '& > *': {
            margin: theme.spacing(0),
        },
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "100%",
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(5),
    },
    gridList: {
        flexWrap: 'nowrap',
        paddingBlock: 15,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");
class DetailUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbProducts: [],
            name: "",
            description: "",
            color: "",
            material: "",
            productType: "",
            categoryID: "",
            brandID: "",
            competitionID: "",
            image: "",
            source: "",
            price: 0,
            key: "",
            //size áo
            size: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            images: [],
            newimages: [],
            newimage: null,
            deleteimages: [],
            readprice: '',
        }
    }
    componentDidMount = async () => {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        const { match } = this.props;
        var slug = match.params.slug;
        this.setState({
            key: slug,
        })
        //lấy data các sp
        this.getData(match.params.slug);
    }
    getData = (slug) => {
        instance.get(`/products/${slug}`)
            .then((response) => {
                this.setState({
                    name: response.data.Name,
                    description: response.data.Description,
                    color: response.data.Color,
                    material: response.data.Material,
                    productType: response.data.Product_Type,
                    categoryID: response.data.CategoryID,
                    brandID: response.data.BrandID,
                    competitionID: response.data.CompetitionID,
                    image: response.data.Image,
                    source: response.data.Source,
                    price: response.data.Price,
                    readprice: this.DocTienBangChu(response.data.Price)
                })
                var items;
                if (isNaN(parseInt(response.data.Size))) {
                    items = [];
                    Object.entries(response.data.Size).forEach(([key, value]) => {
                        var item = [];
                        item.push(key, value);
                        items.push(item);
                    });
                } else {
                    items = response.data.Size;
                }
                this.setState({
                    size: items,
                })
            })
        instance.get('/image/' + slug)
            .then(res => {
                this.setState({
                    images: res.data.list,
                })
            })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (name == 'price') {
            if (!isNaN(parseInt(value))) {
                value = parseInt(value);
            } else {
                value = 0;
            }
            this.setState({
                price: value,
                readprice: this.DocTienBangChu(value),
            })
        }
        if (name == 'size') {
            if (!isNaN(parseInt(value))) {
                value = parseInt(value);
            } else {
                value = 0;
            }
            this.setState({
                size: value
            })
        } else {
            this.setState({
                [name]: value
            });
        }
    }
    onChangeSize = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        var items = this.state.size;
        items.forEach(e => {
            if (e[0] == name) {
                if (isNaN(parseInt(value)) == false) {
                    e[1] = parseInt(value);
                } else {
                    e[1] = 0;
                }
            }
        })
        this.setState({ size: items });
    }
    otherImageSelect = () => {
        var images = this.state.newimages;
        const { newimage } = this.state;
        var image = document.getElementById("icon-button-file").files;
        for (let i of image) {
            images = images.filter(e => e.file.name != i.name && e.file.size != i.size)
            images.push({
                name: Date.now(),
                url: URL.createObjectURL(i),
                file: i
            })
        }
        if (newimage != null) {
            images = images.filter(e => e.file.name != newimage.file.name && e.file.size != newimage.file.size)
        }
        console.log(images)
        this.setState({
            newimages: images,
        })
    }
    mainImageSelect = () => {
        var images = this.state.newimages;
        var image = document.getElementById("mainImg").files;
        images = images.filter(e => e.file.name != image[0].name && e.file.size != image[0].size)
        var newimage = {
            name: Date.now(),
            url: URL.createObjectURL(image[0]),
            file: image[0]
        }
        this.setState({
            newimage,
            newimages: images
        })
    }
    postProductData = (url) => {
        const { size } = this.state;
        var submitQuantity;
        if (isNaN(parseInt(size))) {
            submitQuantity = Object.fromEntries(size)
        } else {
            submitQuantity = parseInt(size)
        }
        var submitImage = '';
        if (url == '') {
            submitImage = this.state.image;
        } else {
            submitImage = url
        }
        instance.put('/products/' + this.state.key, {
            Color: this.state.color,
            Description: this.state.description,
            Image: submitImage,
            Material: this.state.material,
            Name: this.state.name,
            Price: parseInt(this.state.price),
            Source: this.state.source,
            Size: submitQuantity,
        }).then((response) => {
            if (response.status == 200) {
                toast.success("Cập nhật sản phẩm thành công");
            } else {
                toast.error("Cập nhật sản phẩm thất bại");
            }
        })
    }
    onSubmit = (event) => {
        const { newimage } = this.state;
        event.preventDefault(); //k cho trình duyệt reload lại khi bấm submit
        if (newimage != null) {
            const { match } = this.props;
            var slug = match.params.slug;
            const imgRef = storage.ref('images')
                .child('products').child(`${slug}_0.png`)
            imgRef.put(newimage.file).then(async () => {
                var url = await imgRef.getDownloadURL();
                this.postProductData(url);
            }).catch(err => console.log(err))
        } else {
            this.postProductData('');
        }
    }
    DocSo3ChuSo(baso) {
        var tram;
        var chuc;
        var donvi;
        var KetQua = "";
        tram = parseInt(baso / 100);
        chuc = parseInt((baso % 100) / 10);
        donvi = baso % 10;
        if (tram == 0 && chuc == 0 && donvi == 0) return "";
        if (tram != 0) {
            KetQua += ChuSo[tram] + " trăm ";
            if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
        }
        if ((chuc != 0) && (chuc != 1)) {
            KetQua += ChuSo[chuc] + " mươi";
            if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
        }
        if (chuc == 1) KetQua += " mười ";
        switch (donvi) {
            case 1:
                if ((chuc != 0) && (chuc != 1)) {
                    KetQua += " mốt ";
                }
                else {
                    KetQua += ChuSo[donvi];
                }
                break;
            case 5:
                if (chuc == 0) {
                    KetQua += ChuSo[donvi];
                }
                else {
                    KetQua += " lăm ";
                }
                break;
            default:
                if (donvi != 0) {
                    KetQua += ChuSo[donvi];
                }
                break;
        }
        return KetQua;
    }
    deleteimages = (i) => {
        var images = this.state.newimages;
        images = images.filter(e => e != i)
        this.setState({ newimages: images })
    }
    //2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)
    DocTienBangChu(SoTien) {
        var lan = 0;
        var i = 0;
        var so = 0;
        var KetQua = "";
        var tmp = "";
        var ViTri = new Array();
        if (SoTien < 0) return "Số tiền âm !";
        if (SoTien == 0) return "Không đồng !";
        if (SoTien > 0) {
            so = SoTien;
        }
        else {
            so = -SoTien;
        }
        if (SoTien > 8999999999999999) {
            //SoTien = 0;
            return "Số quá lớn!";
        }
        ViTri[5] = Math.floor(so / 1000000000000000);
        if (isNaN(ViTri[5]))
            ViTri[5] = "0";
        so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
        ViTri[4] = Math.floor(so / 1000000000000);
        if (isNaN(ViTri[4]))
            ViTri[4] = "0";
        so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
        ViTri[3] = Math.floor(so / 1000000000);
        if (isNaN(ViTri[3]))
            ViTri[3] = "0";
        so = so - parseFloat(ViTri[3].toString()) * 1000000000;
        ViTri[2] = parseInt(so / 1000000);
        if (isNaN(ViTri[2]))
            ViTri[2] = "0";
        ViTri[1] = parseInt((so % 1000000) / 1000);
        if (isNaN(ViTri[1]))
            ViTri[1] = "0";
        ViTri[0] = parseInt(so % 1000);
        if (isNaN(ViTri[0]))
            ViTri[0] = "0";
        if (ViTri[5] > 0) {
            lan = 5;
        }
        else if (ViTri[4] > 0) {
            lan = 4;
        }
        else if (ViTri[3] > 0) {
            lan = 3;
        }
        else if (ViTri[2] > 0) {
            lan = 2;
        }
        else if (ViTri[1] > 0) {
            lan = 1;
        }
        else {
            lan = 0;
        }
        for (i = lan; i >= 0; i--) {
            tmp = this.DocSo3ChuSo(ViTri[i]);
            KetQua += tmp;
            if (ViTri[i] > 0) KetQua += Tien[i];
            if ((i > 0) && (tmp.length > 0)) KetQua += ',';//&& (!string.IsNullOrEmpty(tmp))
        }
        if (KetQua.substring(KetQua.length - 1) == ',') {
            KetQua = KetQua.substring(0, KetQua.length - 1);
        }
        KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
        return KetQua;//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }
    render() {
        var { match, classes } = this.props;
        const { size, width, height, image, images, deleteimages,
            newimage, newimages, readprice } = this.state;
        console.log(newimage)
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Grid container
                    direction='row' justify={'space-around'}
                    style={{ paddingBlock: 15 }}>
                    <Grid container
                        direction='column'
                        alignItems='center'
                        justify='space-between'
                        item xs={5}>
                        <Box
                            border={0.1}
                            borderColor="text.primary"
                            borderRadius={10}
                            textAlign='center'
                            style={{ margin: 10, padding: 10, width: '100%', flexDirection: 'column' }}>
                            <Typography component="h1" variant="h5">
                                Ảnh minh họa sản phẩm
                            </Typography>
                            <img
                                style={{
                                    width: width / 4, height: width / 4,
                                    paddingTop: 10, paddingBottom: 25
                                }}
                                src={newimage != null ? newimage.url : image}
                            />
                            <Grid container item
                                direction='row' justify='space-around'>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="mainImg"
                                    hidden
                                    type="file"
                                    onChange={this.mainImageSelect}
                                />
                                <Grid item xs={6}>
                                    <label htmlFor="mainImg">
                                        <Button variant="contained" color="primary" component="span">
                                            Thay đổi ảnh
                                        </Button>
                                    </label>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                    disabled={newimage != null ? false : true}
                                    variant="contained" color="primary" component="span"
                                        onClick={() => { this.setState({ newimage: null }) }}>
                                        Hủy thay đổi
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            border={0.1}
                            borderColor="text.primary"
                            borderRadius={10}
                            textAlign='center'
                            style={{ margin: 10, padding: 10, width: '100%' }}>
                            <Typography component="h1" variant="h5">
                                Ảnh phụ
                            </Typography>
                            <GridList
                                className={classes.gridList} cols={2.5}>
                                {images.map((i, index) =>
                                    <GridListTile key={i}>
                                        <img src={i.Link} alt="Hình ảnh" />
                                        <GridListTileBar
                                            title={`Ảnh ${index}`}
                                            classes={{
                                                root: classes.titleBar,
                                                title: classes.title,
                                            }}
                                            actionIcon={
                                                <IconButton onClick={() => { }}>
                                                    <CancelIcon className={classes.title} />
                                                </IconButton>
                                            }
                                        />
                                    </GridListTile>
                                )}
                            </GridList>
                            <Button variant="contained" color="primary" component="span">
                                Hủy thay đổi
                            </Button>
                        </Box>
                    </Grid>
                    <Grid container item xs={5}>
                        <Box
                            textAlign='center'
                            style={{ margin: 10, padding: 10, width: '100%' }}>
                            <Typography component="h1" variant="h5"
                                style={{ width: '100%', textAlign: 'center', }}>
                                Thông tin sản phẩm
                            </Typography>
                            <div className={classes.paper}>
                                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                                    {/* Tên sản phẩm */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Tên sản phẩm"
                                        name="name"
                                        autoFocus
                                        onChange={this.onChange}
                                        value={this.state.name}
                                    />
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            {/* màu sắc */}
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="color"
                                                label="Màu sắc"
                                                autoComplete="current-password"
                                                onChange={this.onChange}
                                                value={this.state.color}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            {/* chất liệu */}
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="material"
                                                label="Chất liệu"
                                                autoComplete="current-password"
                                                onChange={this.onChange}
                                                value={this.state.material}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            {/* nguồn gốc */}
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="source"
                                                label="Nguồn gốc"
                                                onChange={this.onChange}
                                                value={this.state.source}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container item
                                        direction='row' alignItems='center'>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            style={{ width: '25%' }}
                                            name="price"
                                            label="Giá"
                                            autoComplete="current-password"
                                            onChange={this.onChange}
                                            value={this.state.price}
                                        />
                                        <Typography variant="subtitle1" component="h6"
                                            style={{ marginTop: 9, paddingInline: 10 }}>
                                            {readprice} VNĐ
                                        </Typography>
                                    </Grid>

                                    {/* Mô tả sp */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="description"
                                        label="Mô tả sản phẩm"
                                        id="password"
                                        multiline
                                        autoComplete="current-password"
                                        onChange={this.onChange}
                                        value={this.state.description}
                                    />
                                    {isNaN(parseInt(size))
                                        ? <Typography variant="subtitle1" component="h6" style={{ marginTop: 9 }}>
                                            Số lượng:
                                        </Typography>
                                        : null}
                                    {/* size áo */}
                                    {isNaN(parseInt(size))
                                        ? <Grid container spacing={3}>
                                            {size.map((item) =>
                                                <Grid item xs={3} key={item[0]}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name={item[0]}
                                                        label={item[0]}
                                                        autoComplete="current-password"
                                                        onChange={this.onChangeSize}
                                                        value={item[1]}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                        : <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="size"
                                            label="Số lượng"
                                            onChange={this.onChange}
                                            value={size} />
                                    }
                                    <Grid
                                        container item
                                        direction='row'>
                                        <Typography variant="subtitle1" component="h6" style={{ marginTop: 9, textAlign: 'left' }}>
                                            Thêm ảnh phụ:
                                        </Typography>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            id="icon-button-file"
                                            hidden
                                            multiple
                                            onChange={this.otherImageSelect}
                                            type="file" />
                                        <label htmlFor="icon-button-file">
                                            <IconButton color="default" aria-label="upload picture" component="span">
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                    </Grid>
                                    <GridList
                                        className={classes.gridList} cols={2.5}>
                                        {newimages.map((i, index) =>
                                            <GridListTile key={index}>
                                                <img src={i.url} alt="Hình ảnh" />
                                                <GridListTileBar
                                                    title={i.file.name}
                                                    classes={{
                                                        root: classes.titleBar,
                                                        title: classes.title,
                                                    }}
                                                    actionIcon={
                                                        <IconButton onClick={() => { this.deleteimages(i) }}>
                                                            <CancelIcon className={classes.title} />
                                                        </IconButton>
                                                    }
                                                />
                                            </GridListTile>
                                        )}
                                    </GridList>
                                    {/* nút xác nhận */}
                                    <Grid container item
                                        direction='row' justify='space-around'>
                                        <Grid item xs={5}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                startIcon={<SaveIcon />}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                startIcon={<BlockIcon />}
                                            >
                                                Hủy thay đổi
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        //Define default options
                        className: '',
                        style: {
                            margin: '40px',
                            background: '#00e676',
                            color: 'white',
                            zIndex: 1,
                        },
                        duration: 5000,
                        // Default options for specific types
                        success: {
                            duration: 3000,
                            // theme: {
                            //     primary: 'yellow',
                            //     secondary: 'yellow',
                            // },
                            style: {
                                margin: '100px',
                                background: '#00e676',
                                color: 'white',
                                zIndex: 1,
                            },
                        },
                        error: {
                            duration: 3000,
                            style: {
                                margin: '100px',
                                background: 'red',
                                color: 'white',
                                zIndex: 1,
                            },
                        },
                    }} />
            </Container>
        )
    }
}

DetailUpdate.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DetailUpdate);