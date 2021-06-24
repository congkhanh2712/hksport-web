import React, { Component } from 'react';
import './App.css';
import Navbar from './component/Navbar'
import Grid from '@material-ui/core/Grid';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Services from './component/pages/Services';
import Products from './component/pages/Products';
import ContactUs from './component/pages/ContactUs';
import SignIn from './component/account/SignIn';
import SignUp from './component/account/SignUp';
import ChangePassword from './component/account/ChangePassword';
import ForgetPassword from './component/account/ForgetPassword';
import Marketing from './component/pages/Marketing';
import Consulting from './component/pages/Consulting';
import Home from './component/pages/Home';
import HomeAd from './component/admin/HomeAd';
import DetailUpdate from './component/admin/DetailUpdate';
import AddProduct from './component/admin/AddProduct';
import SeenProduct from './component/account/SeenProduct/SeenProduct'
import LikedProduct from './component/account/LikedProduct'
import AccountManagement from './component/account/AccountManagement/AccountManagement';
import UseableVoucher from "./component/account/UseableVoucher/UseableVoucher"
import DetailVoucher from "./component/account/UseableVoucher/DetailVoucher"
import DetailOrder from "./component/account/ManageOrder/DetailOrder/DetailOrder"
import RatingOrder from "./component/account/ManageOrder/RatingOrder/RatingOrder"
import { FooterContainer } from './container/footer'
import ShipAddress from './component/account/ShipAddress';
import Cart from './component/account/Cart/Cart';
import ManageOrder from './component/account/ManageOrder/ManageOrder'
import SearchProduct from './component/pages/SearchProduct/SearchProduct'
import DetailProduct from "./component/pages/DetailProduct/DetailProduct"
import instance from './AxiosConfig';
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import { API_Key } from '../package.json';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { createBrowserHistory } from "history";


const customHistory = createBrowserHistory();
const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(5),
    },
});


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            role: "",
            search: "",
            key: "",
        }
    }
    isLogin = (user) => {
        this.setState({
            isLogin: true,
        });
        // var refresh;
        // if (parseInt(user.expired_time) != 0) {
        //     refresh = setTimeout(async () => {
        //         const data = new URLSearchParams();
        //         data.append('refreshToken', user.refreshToken);
        //         data.append('grant_type', "refresh_token");
        //         axios({
        //             method: 'POST',
        //             headers:{
        //                 'content-type': 'application/x-www-form-urlencoded',
        //             },
        //             url: 'https://securetoken.googleapis.com/v1/token',
        //             params: {
        //                 key: API_Key
        //             },
        //             data
        //         }).then(async res => {
        //             console.log(res)
        //             if (res.data != null) {
        //                 localStorage.setItem('user', JSON.stringify({
        //                     expired_time: (Date.now() + res.data.expires_in * 1000).toString(),
        //                     token: res.data.access_token,
        //                 }));
        //                 console.log(res.data)
        //             }
        //             clearTimeout(refresh);
        //         }).catch((err) => console.log(err))
        //     }, parseInt(user.expired_time) - Date.now() - 3480000)
        // } else {
        //     clearTimeout(refresh);
        // }
        instance.defaults.headers['x-access-token'] = user.token;
        instance.get('/auth/').then(res => {
            if (res.data.Role == 'Admin') {
                this.setState({
                    role: "admin",
                });
            } else {
                this.setState({
                    role: "user",
                })
            }
        }).catch(err => {
            this.setState({
                role: "",
            })
        })
    }
    componentDidMount() {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.isLogin(user);
        };
    }
    isLogout = () => {
        this.setState({
            isLogin: false,
            role: "",
        })
    }

    searchProduct = async (key) => {
        this.setState({
            search: key,
            key: '',
        })
    }
    keyProductType = async (key) => {
        this.setState({
            key: key,
        })
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
    render() {
        var { search } = this.state;
        if (search !== "") {
            search = this.removeVietnameseTones(search);
        }
        const { classes } = this.props;
        const { role } = this.state;
        return (
            <Router>
                <Navbar
                    isLogin={this.state.isLogin}
                    isLogout={this.isLogout}
                    login={this.isLogin}
                    isAdmin={this.state.role}
                    searchProduct={this.searchProduct}
                />
                <Switch>
                    {role == 'admin'
                        ? <Route path='/admin' exact>
                            {({ location }) => <HomeAd isLogin={this.isLogin} location={location} />}
                        </Route>
                        : null
                    }
                    {role == 'admin'
                        ? <Route path="/admin/detail-order/:slug" exact>
                            {({ match }) => <DetailOrder isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                    {role == 'admin'
                        ? <Route path='/admin/update/:slug'>
                            {({ match }) => <DetailUpdate isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                    {role == 'admin'
                        ? <Route path='/admin/add-product'>
                            {({ match }) =>
                                <AddProduct isLogin={this.isLogin}
                                    match={match}
                                />}
                        </Route>
                        : null
                    }
                    <Route path='/' exact>
                        <Home isLogin={this.isLogin} searchProduct={this.searchProduct} keyProductType={this.keyProductType} />
                    </Route>
                    <Route path='/services' component={Services} />
                    <Route path='/products' component={Products} />
                    <Route path='/contact-us'>
                        <ContactUs isLogin={this.isLogin} />
                    </Route>
                    <Route path='/sign-in'>
                        <SignIn />
                    </Route>
                    <Route path='/sign-up'>
                        <SignUp />
                    </Route>
                    <Route path="/detail-product/:slug" exact>
                        {({ match }) => <DetailProduct isLogin={this.isLogin} match={match} />}
                    </Route>
                    <Route path="/search-product/:slug" exact>
                        {({ match }) => <SearchProduct
                            keyProductType={this.state.key}
                            props={this.state.search}
                            isLogin={this.isLogin}
                            match={match} />}
                    </Route>
                    <Route path='/marketing' component={Marketing} />
                    <Route path='/consulting' component={Consulting} />
                    <Route path="/reset-password" component={ForgetPassword} />
                    {role == 'user'
                        ? <Route path="/account" exact>
                            <AccountManagement isLogin={this.isLogin} />
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/change-password" >
                            <ChangePassword isLogin={this.isLogin} />
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/change-shipaddress" >
                            <ShipAddress isLogin={this.isLogin} />
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/seen-product" >
                            <SeenProduct isLogin={this.isLogin} />
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/liked-product" >
                            <LikedProduct isLogin={this.isLogin} />
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/useable-voucher" exact>
                            <UseableVoucher isLogin={this.isLogin} />
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/manage-order/:slug" exact>
                            {({ match }) => <ManageOrder isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/manage-order/detail-order/:slug" exact>
                            {({ match }) => <DetailOrder isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path="/account/manage-order/rating-order/:slug" exact>
                            {({ match }) => <RatingOrder isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path='/account/useable-voucher/:slug'>
                            {({ match }) => <DetailVoucher isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                    {role == 'user'
                        ? <Route path='/cart'>
                            {({ match }) => <Cart isLogin={this.isLogin} match={match} />}
                        </Route>
                        : null
                    }
                </Switch>
                {role == 'user'
                    ? <Fab color="primary"
                        aria-label="add"
                        className={classes.fab}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={() => console.log('Chat click')}>
                        <ChatIcon />
                    </Fab>
                    : null
                }
                {role === "admin" ? "" : <FooterContainer />}
                {search !== "" ? <Redirect to={`/search-product/${search}`} /> : ""}
            </Router>
        )
    };
};
App.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);