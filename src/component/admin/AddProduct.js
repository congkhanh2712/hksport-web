import React, { Component } from 'react';
import { storage } from "../../Firebase";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import toast, { Toaster } from 'react-hot-toast';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import AddImg from '../../images/add_image.png';
import DialogActions from '@material-ui/core/DialogActions';
import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import instance from '../../AxiosConfig';

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
});

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbCategory: [], //lưu mảng TblCategory từ fb
            fbType: [], //lưu mảng TblProductType từ fb
            fbCompetition: [], //lưu mảng TblCompetition từ fb
            fbBrand: [],//mảng tblBrand từ fb
            //các thuộc tính khi thêm sản phẩm
            name: "",
            description: "",
            color: "",
            images: [],
            material: "",
            width: window.innerWidth,
            height: window.innerHeight,
            price: 0,
            source: "",// có thể có hoặc không
            size: [],
            checkSize: false,
            sizeNumber: 0,
            //lưu các id của fb để kết bảng:
            type: "", // id của product type(áo: áo 2020, áo 2021 - giày: addidas, nike ...)
            category: "", //id của category(loại sản phẩm: áo, giày...)
            competition: "",    //id của giải đấu(dành riêng cho áo bóng đá)
            brand: "",//nhãn hiệu
            anchorEl: null, //thuộc tính của component menu
            //state của dialog thêm sản phẩm mới(giày, dép, quần, áo...)
            openDialogCategory: false, //đóng mở form
            iconDialogCategory: "",
            imageDialogCategory: "",
            nameDialogCategory: "",
            smallImageDialogCategory: "",
            //state của dialog thêm danh mục sản phẩm mới(áo bóng đá có các danh mục như áo 2020, áo 2021,...)
            openDialogProductType: false, //đóng mở form
            categoryIDDialogProductType: "",
            linkDialogProductType: "",
            nameDialogProductType: "",
        }
    }

    componentDidMount = async () => {
        this.getCategories();
        this.getCompetitions();
        this.getBrands();
        this.getProductTypes();
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })

        //console.log(this.state)
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.category != this.state.category) {
            this.getProductTypes();
            this.setState({
                type: ''
            })
        }
        if (prevState.brand != this.state.brand) {
            this.getProductTypes();
            this.setState({
                type: ''
            })
        }
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (name == 'checkSize' && value == true && this.state.size.length == 0) {
            var items = [['size1', 0], ['size2', 0], ['size3', 0], ['size4', 0]]
            this.setState({
                size: items
            })
        }
        if (name == 'sizeNumber' || name == 'price') {
            if (isNaN(parseInt(value))) {
                value = 0;
            } else {
                value = parseInt(value);
            }
        }
        await this.setState({
            [name]: value
        });
        // console.log(this.state)
    }
    postImg = (pid) => {
        const { images } = this.state;
        for (let i = 1; i < images.length; i++) {
            const imgRef = storage.ref('images')
                .child('products').child(`${pid}_${i}.png`)
            imgRef.put(images[i].file).then(async () => {
                var url = await imgRef.getDownloadURL();
                instance.post('/image', { url, pid })
                if (i == images.length - 1) {
                    toast.success("Thêm sản phẩm thành công");
                    this.setState({
                        name: "",
                        description: "",
                        color: "",
                        images: [],
                        material: "",
                        type: "", // id của product type(áo: áo 2020, áo 2021 - giày: addidas, nike ...)
                        category: "", //id của category(loại sản phẩm: áo, giày...)
                        competition: "",    //id của giải đấu(dành riêng cho áo bóng đá)
                        brand: "",//nhãn hiệu
                        price: 0,
                        source: "",// có thể có hoặc không
                        size: [],
                        checkSize: false,
                        sizeNumber: 0,
                    })
                }
            }).catch(err => console.log(err))
        }
    }
    postData = () => {
        const { color, competition, category, description,
            material, name, price, images,
            type, source, brand, checkSize, sizeNumber, size } = this.state;
        const imgRef = storage.ref('images')
            .child('products').child(`${Date.now()}.png`)
        imgRef.put(images[0].file).then(async () => {
            var url = await imgRef.getDownloadURL();
            var sizeItem;
            if (checkSize) {
                sizeItem = Object.fromEntries(size);
            } else {
                sizeItem = sizeNumber;
            }
            instance.post('/products', {
                color, competition, category, description,
                material, name, price,
                type, source, brand,
                size: sizeItem,
                image: url,
            }).then(res => {
                if (res.status == 200) {
                    this.postImg(res.data.key);
                } else {
                    toast.error("Thêm sản phẩm thất bại");
                }
            })
        }).catch(err => console.log(err))
    }
    onSubmit = (event) => {
        event.preventDefault(); //k cho trình duyệt reload lại khi bấm submit
        const { color, category,
            images, material, name, price,
            type, source, checkSize, size } = this.state;
        var dem = 0;
        size.forEach(e => {
            if (e[0].trim() == '') {
                dem = dem + 1;
            }
        })
        if (color.trim() == '' || category.trim() == '' || material.trim() == ''
            || name.trim() == '' || price == 0 || type.trim() == ''
            || source.trim() == '') {
            toast.error("Vui lòng nhập đầy dủ thông tin sản phẩm");
        } else if (images.length == 0) {
            toast.error("Bạn chưa chọn ảnh minh họa cho sản phẩm");
        } else if (checkSize && dem != 0) {
            toast.error("Vui lòng nhập đầy dủ tên size");
        } else {
            this.postData();
        }
    }

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
        })
    }
    handleClose = (event) => {
        this.setState({
            anchorEl: null,
        })
    }
    dialogCategory = () => { // thêm loại sp mới(giày dép áo quần bla bla)
        instance.post('/category', {
            Icon: this.state.iconDialogCategory,
            Image: this.state.imageDialogCategory,
            Name: this.state.nameDialogCategory,
            SmallImage: this.state.smallImageDialogCategory,
        }).then((res) => {
            if (res.status == 200) {
                toast.success("Thêm loại sản phẩm mới thành công");
                this.setState({ openDialogCategory: false })
                this.getCategories();
            } else {
                toast.error("Thêm loại sản phẩm mới thất bại");
            }
        })
    }
    dialogProductType = () => { //thêm danh mục sp của từng loại sp(áo có nhiều loại áo, giày có nhiều loại giày)
        instance.post('/producttype', {
            CategoryID: this.state.categoryIDDialogProductType,
            Link: this.state.linkDialogProductType,
            Name: this.state.nameDialogProductType,
        }).then((res) => {
            if (res.status == 200) {
                toast.success("Thêm danh mục mới thành công");
                this.setState({ openDialogProductType: false })
                this.getProductTypes();
            } else {
                toast.error("Thêm danh mục mới thất bại");
            }
        })
    }
    getCategories = async () => {
        instance.get('/category')
            .then((response) => {
                this.setState({
                    fbCategory: response.data,
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
            console.log(response)
            this.setState({
                fbType: response.data.list,
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
    onClick = (name) => {
        document.getElementById(name).click();
    }
    mainImageSelect = () => {
        var images = this.state.images;
        var image = document.getElementById("mainImg").files;
        images.shift();
        images.unshift({
            name: Date.now(),
            url: URL.createObjectURL(image[0]),
            file: image[0]
        })
        this.setState({
            images: images,
        })
    }
    otherImageSelect = () => {
        var images = this.state.images;
        var image = document.getElementById("otherImg").files;
        for (var i = 0; i < image.length; i++) {
            images.forEach((e, index) => {
                if (e.file.name === image[i].name && e.file.size == image[i].size) {
                    images.splice(index, 1);
                }
            })
            images.push({
                name: Date.now(),
                url: URL.createObjectURL(image[i]),
                file: image[i]
            })
        }
        this.setState({
            images: images,
        })
    }
    onChangeSizeName = (event, index) => {
        var value = event.target.value;
        var items = this.state.size;
        items.forEach((e, i) => {
            if (i == index) {
                e[0] = value;
            }
        })
        this.setState({ size: items });
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
    render() {
        const { fbCategory, fbType, fbCompetition, fbBrand, width, images, size } = this.state;
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="md" fixed={true}>
                <CssBaseline />
                <div className={classes.paper} >
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        <Grid container spacing={5} direction={'row'} justify={'space-between'}>
                            <Grid container item xs={6}
                                style={{ marginBlock: 15, alignSelf: 'flex-start' }}>
                                <Typography component="h1" variant="h5"
                                    style={{ width: '100%', textAlign: 'center', }}>
                                    Ảnh minh họa sản phẩm
                                </Typography>
                                <input
                                    accept="image/*"
                                    id="mainImg"
                                    className={classes.input}
                                    name="mainImg"
                                    type="file"
                                    hidden
                                    onChange={this.mainImageSelect}
                                />
                                <Button
                                    style={{ marginBlock: 25, width: width / 4, height: width / 4, borderRadius: 25, backgroundColor: '#EEEEEE' }}
                                    onClick={() => { this.onClick("mainImg") }}
                                >
                                    <img
                                        style={images.length != 0 ? { width: width / 4, height: width / 4 } : { width: width / 8, height: width / 8 }}
                                        src={images.length != 0 ? images[0].url : AddImg}
                                    />
                                </Button>
                                <input
                                    accept="image/*"
                                    id="otherImg"
                                    className={classes.input}
                                    name="otherImg"
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={this.otherImageSelect}
                                />
                                {images.map((i, index) => {
                                    if (index != 0) {
                                        return <img
                                            key={index}
                                            style={{
                                                width: width / 15, height: width / 15,
                                                borderRadius: 5, backgroundColor: '#EEEEEE',
                                                marginBlock: 5, marginInline: 10
                                            }}
                                            src={i.url}
                                        />
                                    }
                                })}
                                <Button
                                    style={{
                                        width: width / 15, height: width / 15,
                                        borderRadius: 5, marginBottom: 10, backgroundColor: '#EEEEEE',
                                        marginBlock: 5, marginInline: 10
                                    }}
                                    onClick={() => { this.onClick("otherImg") }}>
                                    <img
                                        style={{ width: width / 25, height: width / 25 }}
                                        src={AddImg}
                                    />
                                </Button>
                            </Grid>
                            <Grid container item xs={6}
                                justify={'center'}
                                style={{ marginBlock: 15, alignSelf: 'flex-start' }}>
                                <Typography component="h1" variant="h5"
                                    style={{ width: '100%', textAlign: 'center' }}>
                                    Thông tin sản phẩm
                                </Typography>
                                <Grid container item style={{ marginBlock: 10 }}>
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
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
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
                                        <Grid item xs={6}>
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
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            {/* loại sp(quần áo giày...) */}
                                            <FormControl className={classes.formControl}>
                                                <InputLabel >Loại sản phẩm</InputLabel>
                                                <NativeSelect
                                                    value={this.state.category}
                                                    defaultValue={this.state.category}
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
                                        </Grid>
                                        <Grid item xs={6}>
                                            {/* nhãn hiệu */}
                                            <FormControl className={classes.formControl}>
                                                <InputLabel >Nhãn hiệu</InputLabel>
                                                <NativeSelect
                                                    value={this.state.brand}
                                                    defaultValue={this.state.brand}
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
                                        </Grid>
                                    </Grid>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel >Giải đấu</InputLabel>
                                        <NativeSelect
                                            value={this.state.competition}
                                            defaultValue={this.state.competition}
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
                                    {/* danh mục sp */}
                                    <FormControl className={classes.formControl}>
                                        <InputLabel >Danh mục</InputLabel>
                                        <NativeSelect
                                            value={this.state.type}
                                            defaultValue={this.state.type}
                                            inputProps={{
                                                name: 'type',
                                            }}
                                            onChange={this.onChange}
                                        >
                                            <option aria-label="None" value="" />
                                            {fbType.map((x, index) => {
                                                return <option key={index} value={x.key}>{x.Name}</option>
                                            })}
                                        </NativeSelect>
                                    </FormControl>
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
                                    {/* Giá sp */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="price"
                                        label="Giá"
                                        autoComplete="current-password"
                                        onChange={this.onChange}
                                        value={this.state.price}
                                    />
                                    <Grid container item direction={'row'} justify={'space-between'} align={'center'}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            disabled={this.state.checkSize}
                                            style={{ width: '70%' }}
                                            name="sizeNumber"
                                            label="Số lượng"
                                            onChange={this.onChange}
                                            value={this.state.sizeNumber}
                                        />
                                        <FormControlLabel
                                            style={{ height: '100%' }}
                                            control={
                                                <Checkbox
                                                    checked={this.state.checkSize}
                                                    onChange={this.onChange}
                                                    name="checkSize"
                                                    color="primary"
                                                />
                                            }
                                            label="Theo size"
                                        />
                                    </Grid>
                                    {/* checkSize == true */}
                                    {this.state.checkSize == true ?
                                        <Grid container justify='space-between'>
                                            {size.map((item, index) =>
                                                <Box
                                                    border={0.1}
                                                    borderColor="text.primary"
                                                    borderRadius={10}
                                                    style={{ width: '49%', marginTop: 15 }}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        id="size_name"
                                                        name={item[0]}
                                                        style={{ width: '40%', marginInline: width * 0.01 }}
                                                        label='Tên size'
                                                        placeholder={'vd: S,M,L,XL'}
                                                        onChange={(e) => {
                                                            this.onChangeSizeName(e, index)
                                                        }}
                                                        value={item[0]}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        name={item[0]}
                                                        style={{ width: '40%' }}
                                                        label='Số lượng'
                                                        onChange={this.onChangeSize}
                                                        value={item[1]}
                                                    />
                                                </Box>
                                            )}
                                        </Grid>
                                        : ""
                                    }
                                </Grid>
                                {/* nút xác nhận */}
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    className={classes.submit}
                                >
                                    Xác nhận
                                </Button>
                            </Grid>
                        </Grid>
                        {/* nút thêm các sp mới, danh mục,giải đấu... */}
                        <Fab color="primary" aria-label="add" className={classes.fab} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                            <AddIcon />
                        </Fab>
                        <Menu
                            id="simple-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            {/* thêm sp mới như áo, dép, giày... */}
                            <MenuItem onClick={() => { this.setState({ openDialogCategory: true }) }}>Thêm loại sản phẩm mới</MenuItem>
                            <Dialog open={this.state.openDialogCategory} onClose={() => { this.setState({ openDialogCategory: false }) }} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Thêm loại sản phẩm mới</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Name"
                                        fullWidth
                                        name="nameDialogCategory"
                                        onChange={this.onChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Image"
                                        fullWidth
                                        name="imageDialogCategory"
                                        onChange={this.onChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Icon"
                                        fullWidth
                                        name="iconDialogCategory"
                                        onChange={this.onChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Small Image"
                                        fullWidth
                                        name="smallImageDialogCategory"
                                        onChange={this.onChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => { this.setState({ openDialogCategory: false }) }} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={this.dialogCategory} color="primary">
                                        Xác nhận
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {/* thêm danh mục mới */}
                            <MenuItem onClick={() => { this.setState({ openDialogProductType: true }) }}>Thêm danh mục sản phẩm</MenuItem>
                            <Dialog open={this.state.openDialogProductType} onClose={() => { this.setState({ openDialogProductType: false }) }} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Thêm danh mục sản phẩm mới</DialogTitle>
                                <DialogContent>
                                    <FormControl className={classes.formControl} >
                                        <InputLabel >Loại sản phẩm</InputLabel>
                                        <NativeSelect
                                            value={this.state.categoryIDDialogProductType}
                                            defaultValue={this.state.categoryIDDialogProductType}
                                            inputProps={{
                                                name: 'categoryIDDialogProductType',
                                            }}
                                            onChange={this.onChange}
                                        >
                                            <option aria-label="None" value="" />
                                            {fbCategory.map((x, index) => {
                                                return <option key={index} value={x.key}>{x.Name}</option>
                                            })}
                                        </NativeSelect>
                                    </FormControl>
                                    <TextField

                                        margin="dense"
                                        label="Name"
                                        fullWidth
                                        name="nameDialogProductType"
                                        onChange={this.onChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Link"
                                        fullWidth
                                        name="linkDialogProductType"
                                        onChange={this.onChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => { this.setState({ openDialogProductType: false }) }} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={this.dialogProductType} color="primary">
                                        Xác nhận
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                        </Menu>
                    </form>
                </div>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        //Define default options
                        className: '',
                        // style: {
                        //     margin: '40px',
                        //     background: '#00e676',
                        //     color: 'white',
                        //     zIndex: 1,
                        // },
                        // duration: 5000,
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

AddProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AddProduct);