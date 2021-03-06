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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
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
    gridList: {
        flexWrap: 'nowrap',
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

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbCategory: [], //l??u m???ng TblCategory t??? fb
            fbType: [], //l??u m???ng TblProductType t??? fb
            fbCompetition: [], //l??u m???ng TblCompetition t??? fb
            fbBrand: [],//m???ng tblBrand t??? fb
            //c??c thu???c t??nh khi th??m s???n ph???m
            name: "",
            description: "",
            color: "",
            images: [],
            material: "",
            width: window.innerWidth,
            height: window.innerHeight,
            price: 0,
            source: "",// c?? th??? c?? ho???c kh??ng
            size: [],
            checkSize: false,
            sizeNumber: 0,
            //l??u c??c id c???a fb ????? k???t b???ng:
            type: "", // id c???a product type(??o: ??o 2020, ??o 2021 - gi??y: addidas, nike ...)
            category: "", //id c???a category(lo???i s???n ph???m: ??o, gi??y...)
            competition: "",    //id c???a gi???i ?????u(d??nh ri??ng cho ??o b??ng ????)
            brand: "",//nh??n hi???u
            anchorEl: null, //thu???c t??nh c???a component menu
            //state c???a dialog th??m s???n ph???m m???i(gi??y, d??p, qu???n, ??o...)
            openDialogCategory: false, //????ng m??? form
            iconDialogCategory: "",
            imageDialogCategory: "",
            nameDialogCategory: "",
            smallImageDialogCategory: "",
            //state c???a dialog th??m danh m???c s???n ph???m m???i(??o b??ng ???? c?? c??c danh m???c nh?? ??o 2020, ??o 2021,...)
            openDialogProductType: false, //????ng m??? form
            categoryIDDialogProductType: "",
            linkDialogProductType: "",
            nameDialogProductType: "",
        }
    }

    componentDidMount = async () => {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
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
                    toast.success("Th??m s???n ph???m th??nh c??ng");
                    this.setState({
                        name: "",
                        description: "",
                        color: "",
                        images: [],
                        material: "",
                        type: "", // id c???a product type(??o: ??o 2020, ??o 2021 - gi??y: addidas, nike ...)
                        category: "", //id c???a category(lo???i s???n ph???m: ??o, gi??y...)
                        competition: "",    //id c???a gi???i ?????u(d??nh ri??ng cho ??o b??ng ????)
                        brand: "",//nh??n hi???u
                        price: 0,
                        source: "",// c?? th??? c?? ho???c kh??ng
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
                    toast.error("Th??m s???n ph???m th???t b???i");
                }
            })
        }).catch(err => console.log(err))
    }
    onSubmit = (event) => {
        event.preventDefault(); //k cho tr??nh duy???t reload l???i khi b???m submit
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
            toast.error("Vui l??ng nh???p ?????y d??? th??ng tin s???n ph???m");
        } else if (images.length == 0) {
            toast.error("B???n ch??a ch???n ???nh minh h???a cho s???n ph???m");
        } else if (checkSize && dem != 0) {
            toast.error("Vui l??ng nh???p ?????y d??? t??n size");
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
    dialogCategory = () => { // th??m lo???i sp m???i(gi??y d??p ??o qu???n bla bla)
        instance.post('/category', {
            Icon: this.state.iconDialogCategory,
            Image: this.state.imageDialogCategory,
            Name: this.state.nameDialogCategory,
            SmallImage: this.state.smallImageDialogCategory,
        }).then((res) => {
            if (res.status == 200) {
                toast.success("Th??m lo???i s???n ph???m m???i th??nh c??ng");
                this.setState({ openDialogCategory: false })
                this.getCategories();
            } else {
                toast.error("Th??m lo???i s???n ph???m m???i th???t b???i");
            }
        })
    }
    dialogProductType = () => { //th??m danh m???c sp c???a t???ng lo???i sp(??o c?? nhi???u lo???i ??o, gi??y c?? nhi???u lo???i gi??y)
        instance.post('/producttype', {
            CategoryID: this.state.categoryIDDialogProductType,
            Link: this.state.linkDialogProductType,
            Name: this.state.nameDialogProductType,
        }).then((res) => {
            if (res.status == 200) {
                toast.success("Th??m danh m???c m???i th??nh c??ng");
                this.setState({ openDialogProductType: false })
                this.getProductTypes();
            } else {
                toast.error("Th??m danh m???c m???i th???t b???i");
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
        images = images.filter(e => e.file.name != image[0].name && e.file.size != image[0].size)
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
        for (let i of image) {
            images = images.filter(e => e.file.name != i.name && e.file.size != i.size)
            images.push({
                name: Date.now(),
                url: URL.createObjectURL(i),
                file: i
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
    deleteImages = (i) => {
        var images = this.state.images;
        images = images.filter(e => e != i)
        this.setState({ images })
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
                                    ???nh minh h???a s???n ph???m
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
                                    style={{ marginBlock: 25, width: width / 4, height: width / 4, borderRadius: 15, backgroundColor: '#EEEEEE' }}
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
                                <GridList
                                    style={{ width: '100%' }}
                                    className={classes.gridList} cols={2.5}>
                                    {images.map((i, index) => {
                                        if (index != 0) {
                                            return <GridListTile key={i}>
                                                <img src={i.url} alt="H??nh ???nh" />
                                                <GridListTileBar
                                                    title={i.file.name}
                                                    classes={{
                                                        root: classes.titleBar,
                                                        title: classes.title,
                                                    }}
                                                    actionIcon={
                                                        <IconButton onClick={() => { this.deleteImages(i) }}>
                                                            <CancelIcon className={classes.title} />
                                                        </IconButton>
                                                    }
                                                />
                                            </GridListTile>
                                        }
                                    })}
                                </GridList>
                                <Button
                                    style={{
                                        width: width / 15, height: width / 15,
                                        borderRadius: 5, backgroundColor: '#EEEEEE',
                                        marginBlock: 15
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
                                    Th??ng tin s???n ph???m
                                </Typography>
                                <Grid container item style={{ marginBlock: 10 }}>
                                    {/* T??n s???n ph???m */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="T??n s???n ph???m"
                                        name="name"
                                        autoFocus
                                        onChange={this.onChange}
                                        value={this.state.name}
                                    />
                                    {/* M?? t??? sp */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="description"
                                        label="M?? t??? s???n ph???m"
                                        id="password"
                                        multiline
                                        autoComplete="current-password"
                                        onChange={this.onChange}
                                        value={this.state.description}
                                    />
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            {/* m??u s???c */}
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="color"
                                                label="M??u s???c"
                                                autoComplete="current-password"
                                                onChange={this.onChange}
                                                value={this.state.color}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {/* ch???t li???u */}
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="material"
                                                label="Ch???t li???u"
                                                autoComplete="current-password"
                                                onChange={this.onChange}
                                                value={this.state.material}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            {/* lo???i sp(qu???n ??o gi??y...) */}
                                            <FormControl className={classes.formControl}>
                                                <InputLabel >Lo???i s???n ph???m</InputLabel>
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
                                            {/* nh??n hi???u */}
                                            <FormControl className={classes.formControl}>
                                                <InputLabel >Nh??n hi???u</InputLabel>
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
                                        <InputLabel >Gi???i ?????u</InputLabel>
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
                                    {/* danh m???c sp */}
                                    <FormControl className={classes.formControl}>
                                        <InputLabel >Danh m???c</InputLabel>
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
                                    {/* ngu???n g???c */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="source"
                                        label="Ngu???n g???c"
                                        onChange={this.onChange}
                                        value={this.state.source}
                                    />
                                    {/* Gi?? sp */}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="price"
                                        label="Gi??"
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
                                            label="S??? l?????ng"
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
                                                        label='T??n size'
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
                                                        label='S??? l?????ng'
                                                        onChange={this.onChangeSize}
                                                        value={item[1]}
                                                    />
                                                </Box>
                                            )}
                                        </Grid>
                                        : ""
                                    }
                                </Grid>
                                {/* n??t x??c nh???n */}
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    className={classes.submit}
                                >
                                    X??c nh???n
                                </Button>
                            </Grid>
                        </Grid>
                        {/* n??t th??m c??c sp m???i, danh m???c,gi???i ?????u... */}
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
                            {/* th??m sp m???i nh?? ??o, d??p, gi??y... */}
                            <MenuItem onClick={() => { this.setState({ openDialogCategory: true }) }}>Th??m lo???i s???n ph???m m???i</MenuItem>
                            <Dialog open={this.state.openDialogCategory} onClose={() => { this.setState({ openDialogCategory: false }) }} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Th??m lo???i s???n ph???m m???i</DialogTitle>
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
                                        X??c nh???n
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {/* th??m danh m???c m???i */}
                            <MenuItem onClick={() => { this.setState({ openDialogProductType: true }) }}>Th??m danh m???c s???n ph???m</MenuItem>
                            <Dialog open={this.state.openDialogProductType} onClose={() => { this.setState({ openDialogProductType: false }) }} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Th??m danh m???c s???n ph???m m???i</DialogTitle>
                                <DialogContent>
                                    <FormControl className={classes.formControl} >
                                        <InputLabel >Lo???i s???n ph???m</InputLabel>
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
                                        X??c nh???n
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
            </Container >
        )
    }
}

AddProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AddProduct);