import React, { Component } from 'react';
import fbApp from '../../Firebase'
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import toast, { Toaster } from 'react-hot-toast';
import SeenCard from "./SeenProduct/SeenCard"
import Typography from '@material-ui/core/Typography';
import instance from '../../AxiosConfig';

const styles = theme => ({

});
const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

class LikedProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbLiked: [],
            sold: [],
            visible: 6,
        }
    }

    componentDidMount = async () => {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.isLogin(user);
        };
        this.getData();
    }

    showMore = () => {
        this.setState({
            visible: this.state.visible + 6
        })
    }

    getData = () => {
        instance.get('/seen/list/liked', {
            params: { page: 0 },
        }).then(res => {
            if(res.status == 200){
                this.setState({
                    fbLiked: res.data.list,
                })
            }
        })
    }
    render() {
        var { fbLiked, visible } = this.state
        const { classes } = this.props;
        return (
            <div style={{ marginLeft: 15, minHeight: 490 }}>
                <Typography variant="h6" gutterBottom align="center">
                    {fbLiked.length === 0 ? "Bạn chưa thích sản phẩm nào" : "Các sản phẩm đã thích"}
                </Typography>
                <Grid container spacing={3} style={{ marginTop: 5, }}>
                    {fbLiked.slice(0, visible).map((product, index) => {
                        return (
                            <Grid item xs={6} sm={2} key={index}>
                                <SeenCard data={product} liked={true} refresh={this.getData} />
                            </Grid>
                        )
                    })}
                </Grid>
                {fbLiked.length === 0 ? "" : <ThemeProvider theme={theme}>
                    <Button onClick={this.showMore} variant="contained" color="primary" style={{ marginTop: 15, marginLeft: "46%" }}>
                        <div style={{ color: 'white', fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>Xem thêm</div>
                    </Button>
                </ThemeProvider>}

            </div>
        )
    }
}

LikedProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(LikedProduct);