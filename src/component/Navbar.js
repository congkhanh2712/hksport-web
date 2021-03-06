import { Component } from "react";
import React from 'react';
import LoginButton from './Button';
import './Navbar.css'
import Tooltip from '@material-ui/core/Tooltip';
import Dropdown from './Dropdown';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { Redirect, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import fbApp from '../Firebase';
import instance from "../AxiosConfig";
import avatar from '../images/ic_avatar.png';
import AvaDropdown from './AvaDropdown';



export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            dropdown: false,
            search: "",
            redirectSearch: false,
            cartLength: 0,
            cartItems: [],
            loading: true,
            avadropdown: false,
        }
    }
    componentDidMount = () => {
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.login(user)
            this.addListener();
        };
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.isAdmin != this.props.isAdmin) {
            if (this.props.isAdmin == "") {
                fbApp.database().ref('TblCart').off();
                this.setState({
                    cartLength: 0,
                    cartItems: [],
                })
            } else {
                this.addListener();
            }
        }
    }
    getCart = () => {
        instance.get('/cart')
            .then(res => {
                this.setState({
                    cartItems: res.data,
                    loading: false,
                });
            })
    }
    addListener = () => {
        var user = null;
        user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            instance.get('/auth/').then(res => {
                if (res.status == 200) {
                    fbApp.database().ref('TblCart').child(res.data.uid)
                        .on('value', snap => {
                            if (snap.numChildren() <= 1) {
                                this.setState({
                                    cartLength: 0
                                })
                            } else {
                                this.setState({
                                    cartLength: snap.numChildren() - 1
                                })
                            }
                            this.getCart();
                        })
                }
            }).catch(err => console.log(err))
        }

    }
    handleClick = () => {
        this.setState({
            click: !this.state.click
        })
    }
    closeMobileMenu = () => {
        this.setState({
            click: false
        })
    }
    onMouseEnter = () => {
        if (window.innerWidth < 960) {
            this.setState({
                dropdown: false,
            })
        } else {
            this.setState({
                dropdown: true,
            })
        }
    }
    onAvaMouseEnter = () => {
        if (window.innerWidth < 960) {
            this.setState({
                avadropdown: false,
            })
        } else {
            this.setState({
                avadropdown: true,
            })
        }
    }
    onMouseLeave = () => {
        this.setState({
            dropdown: false,
        })
    }
    onAvaMouseLeave = () => {
        this.setState({
            avadropdown: false,
        })
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.search !== "") {
            this.props.searchProduct(this.state.search)
            localStorage.setItem('search', JSON.stringify({
                keyword: this.state.search,
            }));
            localStorage.setItem('from', JSON.stringify({
                from: "search",
            }));
            this.setState({
                search: "",
            })
        }
    }
    render() {
        const { click, dropdown, cartItems, loading, avadropdown } = this.state;
        return (
            <div>
                <nav className="navbarh">
                    <Link to={'/'} className="navbar-logo" style={{ textDecoration: 'none' }}>
                        <i class="fas fa-futbol"></i> HKSport</Link>
                    <form
                        noValidate
                        style={{ justifyContent: "start", width: "25%", marginLeft: 40, marginTop: 10 }}
                        onSubmit={this.onSubmit}
                    >
                        <Grid >
                            <TextField
                                color="primary"
                                label="B???n mu???n mua g???"
                                size="small"
                                name="search"
                                variant="outlined"
                                style={{ width: "100%", backgroundColor: "white", borderRadius: "5px" }}
                                value={this.state.search}
                                onChange={this.onChange}
                            />
                            <IconButton
                                color="green"
                                style={{ marginLeft: -50, marginTop: -2 }}
                                type="submit"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                    </form>

                    <div className="menu-icon" onClick={this.handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>

                    <ul className={click ? "nav-menu active" : "nav-menu"}>

                        {this.props.isAdmin === "user" ? <li className="nav-itemh">
                            <Link to="/account" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                T??i kho???n
                            </Link>
                        </li> : this.props.isAdmin === "admin"
                            ? <li className="nav-itemh">
                                <Link to="/admin" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Trang Qu???n l??
                                </Link>
                            </li>
                            : <li className="nav-itemh">
                                <Link to={'/'} className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Home
                                </Link>
                            </li>
                        }

                        <li className="nav-itemh">
                            <Link to="/contact-us" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                Li??n h???
                            </Link>
                        </li>

                        <li className="nav-itemh">
                            <Link to="/sign-in" className="nav-links-mobile" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </li>
                    </ul>
                    {this.props.isAdmin === "user"
                        ? <div style={{ marginRight: 30 }}>
                            {loading == false
                                ? <Tooltip title="??i ?????n gi??? h??ng c???a b???n" placement="bottom">
                                    <Link to="/cart">
                                        <IconButton
                                            onMouseEnter={this.onMouseEnter}
                                            onMouseLeave={this.onMouseLeave}
                                            aria-label="add to shopping cart">
                                            <Badge badgeContent={this.state.cartLength} color="error">
                                                <ShoppingCartIcon htmlColor='white' />
                                            </Badge>
                                            {dropdown && <Dropdown cartItems={cartItems} />}
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                                : <CircularProgress style={{ color: 'white' }} size={20} />
                            }
                        </div>
                        : null
                    }
                    {this.props.isAdmin === "user"
                        ? <IconButton onMouseEnter={this.onAvaMouseEnter}
                            onMouseLeave={this.onAvaMouseLeave}>
                            <Avatar src={this.props.avatar != '' ? this.props.avatar : avatar} />
                            {avadropdown && <AvaDropdown isLogout={this.props.isLogout} />}
                        </IconButton>
                        : <LoginButton
                            isAdmin={this.props.isAdmin}
                            isLogin={this.props.isLogin}
                            isLogout={this.props.isLogout}
                        />
                    }
                </nav>
            </div>
        )
    };
};
