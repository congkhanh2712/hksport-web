import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import fbApp from '../../../Firebase';
import instance from '../../../AxiosConfig';
import avatar from '../../../images/ic_avatar.png';


const GREY = "#B6B6B6";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
    input: {
        width: '85%',
        height: '100%',
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        paddingInline: 20,
    }
});

class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.listContainer = null;
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            loading: false,
            user: null,
            messageList: [],
            message: '',
            newmessage: false,
            page: 1,
            mesLength: -1,
        }
    }
    componentDidMount() {
        this.setState({
            user: this.props.user,
            loading: true,
        })
        this.getData(true);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user != this.props.user && this.props.user != undefined) {
            this.setState({
                user: this.props.user,
                messageList: [],
                mesLength: -1,
                loading: true,
                page: 1,
            }, () => {
                fbApp.database().ref('TblMessage').child(this.props.user.uid)
                    .on('value', val => {
                        console.log(val.numChildren() + ' - ' + this.state.mesLength);
                        if (this.state.mesLength != -1
                            && val.numChildren() > this.state.mesLength) {
                            this.setState({
                                mesLength: val.numChildren(),
                            }, () => {
                                var position = parseInt(this.listContainer.scrollTop + this.listContainer.clientHeight);
                                if (position != this.listContainer.scrollHeight) {
                                    this.setState({
                                        newmessage: true
                                    })
                                } else {
                                    this.getData(true);
                                }
                            })
                        }
                    })
            })
            this.getData(true);
        }
    }
    getData = (scroll) => {
        if (this.props.user != undefined) {
            instance.get('/message/' + this.props.user.uid, {
                params: { page: this.state.page }
            }).then(res => {
                if (res.status == 200 && res.data.succeed == true) {
                    this.setState({
                        messageList: res.data.list.reverse(),
                        loading: false,
                        mesLength: res.data.length
                    }, () => console.log(this.state.messageList[res.data.list.length - 1]))
                    if (scroll == true) {
                        this.scrollToBottom();
                    }
                }
            })
            instance.put('/message/admin', {
                uid: this.props.user.uid
            })
        }
    }
    loadMessages = (event) => {
        if (event.target.scrollTop == 0 && this.state.page * 15 <= this.state.mesLength) {
            this.setState({
                page: this.state.page + 1,
                loading: true,
            }, () => this.getData(false));
        }
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    scrollToBottom = () => {
        if (this.listContainer != null) {
            this.listContainer.scrollTop = this.listContainer.scrollHeight;
        }
        this.setState({
            newmessage: false
        })
    }
    sendMessage = () => {
        const { message } = this.state;
        instance.post('/message/admin', {
            message: message.trim(),
            uid: this.props.user.uid
        }).then(res => {
            this.scrollToBottom();
            this.setState({
                message: ''
            })
        })
    }
    render() {
        const { classes, user } = this.props;
        const { messageList, loading, message, height, width, newmessage } = this.state;
        return (
            <Grid container item
                justify={'space-between'}
                alignItems='center'
                direction='column'
                style={{
                    borderRadius: 10,
                    width: '52%',
                    paddingBlock: 7,
                }}
                className={classes.well}>
                {newmessage == true
                    ? <Grid container direction='column' alignItems='center'
                        style={{ position: 'absolute', zIndex: 2000 }}>
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: '#007CFC', cursor: 'pointer',
                            paddingBlock: 5, paddingInline: 10,
                            border: `1px solid #007CFC`,
                            borderRadius: 20
                        }}
                            onClick={() => { this.getData(true) }}>Tin nhắn mới</div>
                    </Grid>
                    : null
                }
                {loading == true && messageList.length == 0
                    ? <CircularProgress />
                    : <List style={{
                        height: height * 0.69, maxHeight: height * 0.69,
                        width: '100%',
                        position: 'relative',
                        overflow: 'auto',
                    }}
                        onScroll={this.loadMessages}
                        ref={(element) => { this.listContainer = element; }}>
                        {loading == true
                            ? <Grid container direction='column' alignItems='center'>
                                <CircularProgress size={20} />
                            </Grid>
                            : null}
                        {messageList.map((item, index) =>
                            <Grid container item
                                key={item.key}
                                direction='column'>
                                <ListItem style={item.isMe == false ? { justifyContent: 'flex-end' } : null}>
                                    {item.isMe == true
                                        ? <ListItemIcon>
                                            <Avatar src={user.Avatar != '' ? user.Avatar : avatar} />
                                        </ListItemIcon>
                                        : null
                                    }
                                    {item.Message != ''
                                        ? <div style={{
                                            fontFamily: `Arial, Helvetica, sans-serif`,
                                            backgroundColor: '#25A6FD', maxWidth: width * 0.4,
                                            alignSelf: 'center', borderRadius: 15,
                                            color: 'white', paddingInline: 10, paddingBlock: 5
                                        }}>
                                            {item.Message}
                                        </div>
                                        : <ThumbUpIcon fontSize='large' htmlColor='#25A6FD' />
                                    }
                                </ListItem>
                                {index == messageList.length - 1 && item.isMe == false && item.Seen == true
                                    ? <Grid container item direction='row'
                                        justify='flex-end' style={{ width: '97%' }}>
                                        <div style={{
                                            fontFamily: `Arial, Helvetica, sans-serif`,
                                            fontSize: 12
                                        }}>Đã xem</div>
                                    </Grid>
                                    : null
                                }
                            </Grid>
                        )}
                    </List>
                }
                <Grid container item
                    direction='row'
                    alignItems='center'
                    justify='space-between'
                    style={{ height: '10%' }}>
                    <IconButton
                        disabled={loading}
                        color="primary" size='medium'>
                        <AddCircleOutlineIcon fontSize='large' />
                    </IconButton>
                    <Grid container item xs={10}
                        direction='row' justify='center' alignItems='center'
                        style={{ borderRadius: 30, backgroundColor: '#e8e8e8', height: '90%' }}>
                        <TextField
                            value={message}
                            id="message"
                            disabled={loading}
                            name="message"
                            style={{ width: '93%' }}
                            variant="standard"
                            onChange={this.onChange}
                            placeholder='Nhập tin nhắn...' />
                    </Grid>
                    <IconButton
                        disabled={loading}
                        onClick={this.sendMessage}
                        color="primary" size='medium'>
                        {message.trim() != ''
                            ? <SendIcon fontSize='large' />
                            : <ThumbUpIcon fontSize='large' />
                        }
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}
ChatScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ChatScreen);