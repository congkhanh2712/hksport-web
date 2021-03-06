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
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';



const GREY = "#D4D4D4";
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
            seen: false,
            reply: false,
            data: null,
            loading: true,
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
            loading: this.props.loading
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data != this.props.data) {
            console.log(this.props.data)
            this.setState({
                data: this.props.data,
            })
        }
        if (prevProps.loading != this.props.loading) {
            this.setState({
                loading: this.props.loading
            })
        }
        if (this.state.search != prevState.search
            || this.state.reply != prevState.reply
            || this.state.seen != prevState.seen) {
            this.Filter();
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
    searchByName(keyword, str) {
        let arr = []; //L??u c??c t??? ???????c t??ch ra t??? keyword
        let index = []; //l??u v??? tr?? d???u c??ch
        let d = 0;

        keyword = keyword.trim(); //X??a c??c d???u c??ch th???a ??? ?????u ho???c ??? cu???i c???a keyword
        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i] === " ") {
                index.push(i);
            }
        }

        if (index.length === 0) {
            arr.push(keyword);
        } else {
            for (let i = 0; i < index.length; i++) {  //????a t???ng t??? v??o arr[]
                if (i === 0) {
                    arr.push(keyword.slice(0, index[i]));
                }
                if (i != (index.length - 1) && i != 0) {
                    arr.push(keyword.slice(index[i - 1] + 1, index[i]));
                }
                if (i === index.length - 1) {
                    arr.push(keyword.slice(index[i - 1] + 1, index[i]));
                    arr.push(keyword.slice(index[i] + 1, keyword.length));
                }
            }
        }
        for (var x of arr) {
            if (str.indexOf(x) !== -1) d++;
        }
        if (d === arr.length) return true;
        else return false;
    }
    Filter = () => {
        var items = this.props.data;
        const { search, reply, seen } = this.state;
        items = items.filter(item => this.searchByName(search.toLowerCase(), item.user.Name.toLowerCase()) == true)
        if (reply == true) {
            items = items.filter(item => item.lastmessage.isMe == true)
        }
        if (seen == true) {
            items = items.filter(item => item.lastmessage.isMe == true && item.lastmessage.Seen == false)
        }
        this.setState({
            data: items
        })
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
        const { data, height, loading, seen, reply, width } = this.state;
        return (
            <Grid container item
                className={classes.well}
                justify='center'
                style={{
                    borderRadius: 10,
                    width: '25%',
                }}>
                <Grid container item
                    alignItems='flex-start' justify='center'
                    style={{ width: '95%', height: '20%' }} >
                    <TextField
                        variant="outlined"
                        name="search"
                        margin='normal'
                        disabled={loading}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        label="T??n kh??ch h??ng"
                        placeholder="Nh???p t??n kh??ch h??ng c???n t??m..."
                        onChange={this.onChange}
                        value={this.state.search}
                    />
                    <Grid container item
                        direction='row' justify='space-around'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={reply}
                                    checked={seen}
                                    onChange={this.onChange}
                                    name="seen"
                                    color="primary"
                                />
                            }
                            label="Ch??a xem"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={seen}
                                    checked={reply}
                                    onChange={this.onChange}
                                    name="reply"
                                    color="primary"
                                />
                            }
                            label="Ch??a tr??? l???i"
                        />
                    </Grid>
                </Grid>
                {loading == false
                    ? <MenuList
                        disablePadding={true}
                        style={{
                            width: '100%', maxHeight: height * 0.6,
                            height: height * 0.6,
                            justifyContent: 'flex-start',
                            position: 'relative',
                            overflow: 'auto'
                        }}>
                        {data.map((item) =>
                            <Grid key={item.key}>
                                <MenuItem
                                    onClick={() => { this.props.onClick(item.key) }}
                                    style={{ width: '100%' }}>
                                    <ListItemIcon>
                                        <img
                                            src={item.user.Avatar != '' ? item.user.Avatar : avatar}
                                            style={{ width: 55, borderRadius: 55, height: 55 }}
                                        />
                                    </ListItemIcon>
                                    <Grid item
                                        style={{ width: width * 0.14, paddingInline: 10, maxWidth: width * 0.14 }}>
                                        <Box
                                            overflow="hidden"
                                            component="div" textOverflow="ellipsis"
                                            fontFamily={`Arial, Helvetica, sans-serif`}
                                            fontWeight={item.lastmessage.isMe == true && item.lastmessage.Seen == false
                                                ? 'bold' : null}>
                                            {item.user.Name}
                                        </Box>
                                        <Box
                                            overflow="hidden"
                                            component="div" textOverflow="ellipsis"
                                            fontFamily={`Arial, Helvetica, sans-serif`}
                                            fontWeight={item.lastmessage.isMe == true && item.lastmessage.Seen == false
                                                ? 'bold' : null}>
                                            {item.lastmessage.isMe == false ? 'B???n: ' : ''}
                                            {item.lastmessage.Message == ''
                                                ? <ThumbUpIcon color='action' />
                                                : item.lastmessage.Message}
                                        </Box>
                                    </Grid>
                                    <Grid container item
                                        justify={'flex-end'}
                                        style={{ width: '20%' }}>
                                        <Typography variant="body2" gutterBottom
                                            style={item.lastmessage.isMe == true && item.lastmessage.Seen == false
                                                ? { fontWeight: 'bold' } : null}>
                                            {this.convertDay(item.lastmessage.Time)}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom
                                            style={item.lastmessage.isMe == true && item.lastmessage.Seen == false
                                                ? { fontWeight: 'bold' } : null}>
                                            {this.convertTime(item.lastmessage.Time)}
                                        </Typography>
                                    </Grid>
                                </MenuItem>
                            </Grid>
                        )}
                    </MenuList>
                    : <CircularProgress />
                }

            </Grid>
        );
    }
}
UserList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UserList);