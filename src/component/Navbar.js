import { Component } from "react";
import React from 'react';
import Button from './Button';
import './Navbar.css'
import Dropdown from './Dropdown';
import AddShoppingCartRoundedIcon from '@material-ui/icons/AddShoppingCartRounded';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { Redirect,Link } from 'react-router-dom';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            dropdown: false,
            search: "",
            redirectSearch: false
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
    onMouseLeave = () => {
        if (window.innerWidth < 960) {
            this.setState({
                dropdown: false,
            })
        } else {
            this.setState({
                dropdown: false,
            })
        }
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
        if(this.state.search !== ""){
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
        var elmNavbar = <div>
            <li className="nav-itemh"
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <Link to="/services" className="nav-links" onClick={this.closeMobileMenu}>
                    Services <i class="fas fa-caret-down"></i>
                </Link>
                {dropdown && <Dropdown />}
            </li>
            <li className="nav-itemh">
                <Link to="/contact-us" className="nav-links" onClick={this.closeMobileMenu}>
                    Contact Us
                            </Link>
            </li>
        </div>;
        var { click, dropdown } = this.state;
        var home = this.props.isAdmin === "admin" ? "/admin" : "/"
        return (
            <div>
                <nav className="navbarh">
                    <Link to={home} className="navbar-logo" style={{ textDecoration: 'none' }}><i class="fas fa-futbol"></i> HKSport</Link>
                    <form
                        noValidate
                        style={{ justifyContent: "start", width: "25%", marginLeft: 40, marginTop: 10 }}
                        onSubmit={this.onSubmit}
                    >
                        <Grid >
                            <TextField
                                color="primary"
                                label="Bạn muốn mua gì?"
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

                        <li className="nav-itemh">
                            <Link to={home} className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                {this.props.isAdmin === "admin" ? "Admin" : "Home"}
                            </Link>
                        </li>
                        {this.props.isAdmin === "admin" ? "" :
                            <li className="nav-itemh"
                                onMouseEnter={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                            >
                                <Link to="/services" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Services <i class="fas fa-caret-down"></i>
                                </Link>
                                {dropdown && <Dropdown />}
                            </li>
                        }

                        {this.props.isAdmin === "admin" ? "" :
                            <li className="nav-itemh">
                                <Link to="/contact-us" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Liên hệ
                            </Link>
                            </li>
                        }

                        {this.props.isAdmin === "user" ? <li className="nav-itemh">
                                <Link to="/account" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Tài khoản
                                </Link>
                                </li> : ""
                        }

                        <li className="nav-itemh">
                            <Link to="/sign-in" className="nav-links-mobile" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </li>
                    </ul>
                    <Button isLogin={this.props.isLogin}
                        isLogout={this.props.isLogout}
                    />

                    <div style={{ marginLeft: 70 }}>
                        <Badge badgeContent={4} color="error">
                            <AddShoppingCartRoundedIcon />
                        </Badge>
                    </div>
                </nav>
            </div>
        )
    };
};