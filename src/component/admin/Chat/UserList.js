import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import avatar from '../../../images/ic_avatar.png';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';


const GREY = "#B6B6B6";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            search: '',
            data: null,
        }
    }
    componentDidMount = async () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
        this.setState({
            data: this.props.data,
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data != this.props.data) {
            this.setState({
                data: this.props.data,
            })
        }
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value
        });
        // console.log(this.state)
    }
    convertDay(time) {
        let d = new Date(time);
        let c = new Date();
        let result = '';
        if (c.getDate !== d.getDate()) {
            result = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
        }
        return result;
    }
    convertTime(time) {
        let d = new Date(time);
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        return result;
    }
    render() {
        const { classes } = this.props;
        const { data } = this.state;
        return (
            <Grid container item
                className={classes.well}
                justify='center'
                style={{
                    borderRadius: 10,
                    width: '25%',
                }}>
                <Grid container item
                    style={{ width: '95%', height: '12%' }}
                    direction={'row'}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="search"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        label="Nhập tên khách hàng cần tìm"
                        onChange={this.onChange}
                        value={this.state.search}
                    />
                </Grid>
                <MenuList
                    style={{
                        height: '88%', width: '100%',
                        justifyContent: 'flex-start', borderTopColor: 'black', borderTop: 1
                    }}>
                    {data != null
                        ? data.map((item) =>
                            <MenuItem key={item.key}
                                onClick={() => { this.props.onClick(item.key) }}
                                style={{ width: '100%' }}>
                                <ListItemIcon>
                                    <img
                                        src={item.user.Avatar != '' ? item.user.Avatar : avatar}
                                        style={{ width: 55, borderRadius: 55, height: 55 }}
                                    />
                                </ListItemIcon>
                                <Grid item
                                    style={{ width: '65%', paddingInline: 10 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {item.user.Name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {item.lastmessage.Message}
                                    </Typography>
                                </Grid>
                                <Grid container item
                                    justify={'flex-end'}
                                    style={{ width: '20%' }}>
                                    <Typography variant="body2" gutterBottom>
                                        {this.convertDay(item.lastmessage.Time)}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {this.convertTime(item.lastmessage.Time)}
                                    </Typography>
                                </Grid>
                            </MenuItem>
                        )
                        : null
                    }
                    
                </MenuList>
            </Grid>
        );
    }
}
UserList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UserList);