import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import SeenCard from "./SeenCard"
import Typography from '@material-ui/core/Typography';
import instance from '../../../AxiosConfig';

const styles = theme => ({

});
const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

class SeenProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbSeen: [],
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
    getData = () => {
        instance.get('/seen/list/seen', {
            params: { page: 0 },
        }).then(res => {
            if (res.status == 200) {
                this.setState({
                    fbSeen: res.data.list,
                })
            }
        })
    }
    showMore = () => {
        this.setState({
            visible: this.state.visible + 6
        })
    }

    render() {
        var { fbSeen, visible, } = this.state
        const { classes } = this.props;
        return (
            <div style={{ marginLeft: 15, minHeight: 490 }}>
                <Typography variant="h6" gutterBottom align="center">
                    {fbSeen.length === 0 ? "Bạn chưa xem sản phẩm nào" : "Các sản phẩm đã xem"}
                </Typography>
                <Grid container spacing={3} style={{ marginTop: 5, }}>
                    {fbSeen.slice(0, visible).map((product, index) => {
                        return (
                            <Grid item xs={6} sm={2} key={index}>
                                <SeenCard data={product} liked={false} refresh={this.getData} />
                            </Grid>
                        )
                    })}
                </Grid>
                {fbSeen.length === 0 ? "" : <ThemeProvider theme={theme}>
                    <Button onClick={this.showMore} variant="contained" color="primary" style={{ marginTop: 15, marginLeft: "46%" }}>
                        <div style={{ color: 'white', fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif` }}>Xem thêm</div>
                    </Button>
                </ThemeProvider>}

            </div>
        )
    }
}

SeenProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SeenProduct);