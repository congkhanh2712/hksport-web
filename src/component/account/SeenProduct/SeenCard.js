import React, { Component } from 'react';
import fbApp from '../../../Firebase'
import { withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { green } from '@material-ui/core/colors';
import toast, { Toaster } from 'react-hot-toast';
import {
    BrowserRouter as Router,
    NavLink,
    Redirect
} from "react-router-dom";
import instance from '../../../AxiosConfig';

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

const styles = ({
    root: {
        //maxWidth: 345,
        maxWidth: 210,
    },
    media: {
        //height: 300,
        height: 200,
    },
    name: {
    },
});

class SeenCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sold: 0,
        }
    }

    handleClick = () => {
    }

    updateProduct = () => {

    }

    componentDidMount = () => {
        this.getData();
    }

    getData = () => {
        const { data } = this.props;
        instance.get('/products/' + data.key)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        sold: res.data.Sold
                    })
                }
            })
    }
    deleteSeen = () => {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
        };
        var body = {
            like: null,
            remove: null,
        }
        if (this.props.liked == false) {
            body.remove = true;
        } else {
            body.like = false;
        }
        instance.put('/seen/' + this.props.data.key, body)
            .then((res) => {
                if (res.status == 200 && res.data.succeed == true) {
                    toast.success("Xoá thành công")
                    this.props.refresh()
                }
            })
    }

    render() {
        const { classes, data } = this.props;
        const { sold } = this.state;
        return (
            <div>
                <Card className={classes.root} onClick={this.handleClick}>
                    <CardActionArea style={{ marginBottom: -25 }}>
                        <CardMedia
                            className={classes.media}
                            image={data.Image}
                            title={data.Name}
                        />
                        <Divider />
                        <CardContent >
                            <Typography align="center" gutterBottom variant="caption" component="h3" noWrap style={{ marginTop: -5, marginBottom: -30 }}>
                                {data.Name}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography align="center" gutterBottom variant="caption" component="h3" noWrap style={{ marginTop: -15, marginBottom: 0 }}>
                                Giá: {data.Price}(VNĐ)
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography align="center" gutterBottom variant="caption" component="h3" noWrap style={{ marginTop: -30, marginBottom: 0 }}>
                                Đã bán: {sold}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <ThemeProvider theme={theme}>
                            <Button onClick={this.deleteSeen} fullWidth variant="contained" color="primary" >
                                <div style={{ color: 'white', fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>Xoá khỏi danh sách</div>
                            </Button>
                        </ThemeProvider>
                    </CardActions>
                </Card>

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
            </div>


        );
    }
}

SeenCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SeenCard);
