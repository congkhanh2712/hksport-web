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
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
import UserList from './Chat/UserList';
import UserInfo from './Chat/UserInfo';

const GREY = "#B6B6B6";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            data: [],
            chosing: '',
        }
    }
    componentDidMount = async () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.getData();
    }
    columnStyle = (width) => {
        var style = {
            borderRadius: 10,
            width: `${width}%`,
        }
        return style;
    }
    MenuItemClick = (key) => {
        this.state.data.forEach(e => {
            if (key == e.key) {
                this.setState({
                    chosing: e
                })
            }
        })
    }
    getData = () => {
        instance.get('/message/admin/list')
            .then(res => {
                if (res.status == 200) {
                    const { list } = res.data;
                    this.setState({
                        data: list,
                        chosing: list[list.length - 1]
                    })
                }
            })
    }
    render() {
        const { classes } = this.props;
        const { width, height, data, chosing } = this.state;
        return (
            <div style={{ width: width * 0.975, height: height * 0.77, marginBlock: 10 }}>
                <Grid container spacing={1}
                    style={{ height: '100%' }}
                    justify={'space-around'}>
                    <UserList data={data} onClick={this.MenuItemClick} />
                    <Grid item
                        style={this.columnStyle(52)}
                        className={classes.well}>
                        <Typography component="h1" variant="h5"
                            style={{ width: '100%', textAlign: 'center', backgroundColor: 'white' }}>
                            Chat screen
                        </Typography>
                    </Grid>
                    <UserInfo user={chosing.user} />
                </Grid>
            </div>
        );
    }
}

Chat.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Chat);