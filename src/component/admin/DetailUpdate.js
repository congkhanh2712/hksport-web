import React, { Component } from 'react';
import fbApp from '../../Firebase';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import toast, { Toaster } from 'react-hot-toast';
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
            size: [],
        }
    }
    componentDidMount = async () => {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };

        var { match, } = this.props;
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
                })
                var items = [];
                Object.entries(response.data.Size).forEach(([key, value]) => {
                    var item = [];
                    item.push(key, value);
                    items.push(item);
                });
                this.setState({
                    size: items,
                })
            })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
        console.log(this.state)
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
    onSubmit = (event) => {
        event.preventDefault(); //k cho trình duyệt reload lại khi bấm submit
        instance.put('/products/' + this.state.key, {
            Color: this.state.color,
            Description: this.state.description,
            Image: this.state.image,
            Material: this.state.material,
            Name: this.state.name,
            Price: parseInt(this.state.price),
            Source: this.state.source,
            Size: Object.fromEntries(this.state.size),
        }).then((response) => {
            if (response.status == 200) {
                toast.success("Cập nhật sản phẩm thành công");
            } else {
                toast.error("Cập nhật sản phẩm thất bại");
            }
        })
    }

    render() {
        var { match, classes } = this.props;
        const { size } = this.state;
        return (
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
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

                        {/* link hình ảnh */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="image"
                            label="Link hình ảnh"
                            autoComplete="current-password"
                            onChange={this.onChange}
                            value={this.state.image}
                        />
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
                        <Typography variant="subtitle1" component="h6" style={{ marginTop: 9 }}>
                            Số lượng từng size:
                        </Typography>
                        {/* size áo */}
                        <Grid container spacing={3}>
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
                        </Grid> : ""
                        {/* nút xác nhận */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Xác nhận
                        </Button>
                    </form>
                </div>
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