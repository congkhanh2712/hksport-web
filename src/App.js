import React, { Component } from 'react';
import './App.css';
import Navbar from './component/Navbar'
import Tooltip from '@material-ui/core/Tooltip';
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
import AddVoucher from './component/admin/voucher/AddVoucher';
import instance from './AxiosConfig';
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import { API_Key } from '../package.json';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { createBrowserHistory } from "history";
import ChatView from './component/account/ChatView';


const customHistory = createBrowserHistory();
const GREY = "#D4D4D4";
const styles = theme => ({
    header: {
        position: 'fixed',
        top: theme.spacing(0),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(5),
    },
    chatView: {
        position: 'fixed',
        right: theme.spacing(5),
        bottom: theme.spacing(0),
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});


class App extends Component {
    constructor(props) {
        super(props);
        this.refresh = null;
        this.state = {
            isLogin: false,
            role: "",
            search: "",
            key: "",
            chatView: false,
            ava: '',
        }
    }
    isLogin = (user) => {
        this.setState({
            isLogin: true,
        });
        instance.defaults.headers['x-access-token'] = user.token;
        instance.get('/auth/').then(res => {
            if (res.data.Role == 'Admin') {
                this.setState({
                    role: "admin",
                });
            } else {
                this.setState({
                    role: "user",
                    ava: res.data.Avatar,
                })
            }
        }).catch(err => {
            this.setState({
                role: "",
            })
        })
    }
    refreshToken = (user) => {
        instance.post('/auth/refresh-token', {
            token: user.refreshToken
        }).then((res) => {
            if (res.status == 200 && res.data.succeed == true) {
                console.log(res.data)
                localStorage.setItem('user', JSON.stringify({
                    refreshToken: user.refreshToken,
                    expired_time: (Date.now() + 3600000).toString(),
                    token: res.data.access_token,
                }));
            }
        })
    }
    componentDidMount() {
        if (localStorage && localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem("user"));
            this.isLogin(user);
            if (parseInt(user.expired_time) - Date.now() < 300000) {
                this.tokenCheck(0);
            } else {
                this.tokenCheck(1);
            }
        };
    }
    tokenCheck = (type) => {
        var user = JSON.parse(localStorage.getItem("user"));
        console.log(user.expired_time)
        if (parseInt(user.expired_time) > 0 && parseInt(user.expired_time) - Date.now() > 0) {
            if (type == 0) {
                this.refreshToken(user);
            }
            this.refresh = setInterval(async () => {
                this.refreshToken(user);
            }, 3480000)
        } else {
            clearInterval(this.refresh);
        }
    }
    isLogout = (type) => {
        if (this.state.isLogin == true) {
            if (type == 1) {
                instance.post('/auth/logout')
            }
            localStorage.removeItem("user");
            clearInterval(this.refresh);
            this.setState({
                isLogin: false,
                role: "",
                ava: '',
            })
            window.location.pathname = '';
        }
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
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
        str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
        str = str.replace(/??|??|???|???|??/g, "i");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
        str = str.replace(/???|??|???|???|???/g, "y");
        str = str.replace(/??/g, "d");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
        str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
        str = str.replace(/??|??|???|???|??/g, "I");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
        str = str.replace(/???|??|???|???|???/g, "Y");
        str = str.replace(/??/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
        // Remove extra spaces
        // B??? c??c kho???ng tr???ng li???n nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // B??? d???u c??u, k?? t??? ?????c bi???t
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }
    render() {
        var { search } = this.state;
        if (search !== "") {
            search = this.removeVietnameseTones(search);
        }
        const { classes } = this.props;
        const { role, chatView, ava } = this.state;
        return (
            <Router>
                <Navbar
                    avatar={ava}
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
                    {role == 'admin'
                        ? <Route path='/admin/add-voucher'>
                            {({ match }) =>
                                <AddVoucher isLogin={this.isLogin}
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
                        <SignIn tokenCheck={this.tokenCheck} />
                    </Route>
                    <Route path='/sign-up'>
                        {({ location }) => <SignUp location={location} />}
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
                    ? chatView == true
                        ? <ChatView
                            close={() => { this.setState({ chatView: false }) }}
                            login={this.isLogin}
                            isAdmin={this.state.role} />
                        :
                        <Tooltip title="Nh???n tin cho shop" placement="top">
                            <Fab color="primary"
                                aria-label="add"
                                className={classes.fab}
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={() => { this.setState({ chatView: true }) }}>
                                <ChatIcon />
                            </Fab>
                        </Tooltip>
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