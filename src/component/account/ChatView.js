import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import fbApp from '../../Firebase';
import SendIcon from '@material-ui/icons/Send';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { createBrowserHistory } from "history";
import CloseIcon from '@material-ui/icons/Close';
import instance from '../../AxiosConfig';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const customHistory = createBrowserHistory();
const GREY = "#D4D4D4";
const styles = theme => ({
    chatView: {
        position: 'fixed',
        right: theme.spacing(5),
        bottom: theme.spacing(0),
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});
const chatWidth = window.innerWidth * 0.21;
const chatHeight = window.innerHeight * 0.55;


class ChatView extends Component {
    constructor(props) {
        super(props);
        this.listContainer = null;
        this.state = {
            loading: true,
            message: '',
            messageList: [],
            mesLength: -1,
            page: 1,
            newmessage: false,
        }
    }
    componentDidMount() {
        var user;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.login(user);
        };
        this.getData(true);
        this.addListener();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isAdmin != this.props.isAdmin) {
            if (this.props.isAdmin == "") {
                fbApp.database().ref('TblMessage').off();
            } else {
                this.addListener();
            }
        }
    }
    addListener = () => {
        instance.get('/auth/').then(res => {
            if (res.status == 200) {
                fbApp.database().ref('TblMessage').child(res.data.uid)
                    .on('value', val => {
                        console.log(val.val())
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
                        } else {
                            this.getData(false);
                        }
                    })
            }
        }).catch(err => console.log(err))
    }
    sendMessage = () => {
        const { message } = this.state;
        instance.post('/message/user', {
            message: message.trim(),
        }).then(res => {
            this.scrollToBottom();
            this.setState({
                message: ''
            })
        })
    }
    getData = (scroll) => {
        instance.get('/message', {
            params: { page: this.state.page }
        }).then(res => {
            console.log(res)
            if (res.status == 200 && res.data.succeed == true) {
                this.setState({
                    messageList: res.data.list.reverse(),
                    loading: false,
                    mesLength: res.data.length
                })
                if (scroll == true) {
                    this.scrollToBottom();
                }
            }
        }).catch(err => console.log(err))
        instance.put('/message/user')
    }
    loadMessages = (event) => {
        if (event.target.scrollTop == 0 && this.state.page * 15 <= this.state.mesLength) {
            this.setState({
                page: this.state.page + 1,
                loading: true,
            }, () => this.getData(false));
        }
    }
    scrollToBottom = () => {
        if (this.listContainer != null) {
            this.listContainer.scrollTop = this.listContainer.scrollHeight;
        }
        this.setState({
            newmessage: false
        })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    close = () => {
        fbApp.database().ref('TblMessage').off();
        this.props.close();
    }
    render() {
        const { classes } = this.props;
        const { message, loading, messageList, newmessage } = this.state;
        return (
            <Box
                width={chatWidth}
                style={{ backgroundColor: 'white' }}
                className={classes.chatView}>
                {/* CHAT HEADER */}
                <Grid item xs={12}
                    container direction='row'
                    alignItems='center'
                    justify='space-between'
                    style={{
                        backgroundColor: '#17BEFF',
                    }}>
                    <IconButton aria-label="close chat view">
                        <MoreVertIcon htmlColor='white' fontSize={'small'} />
                    </IconButton>
                    <Typography variant="h6" style={{ color: 'white' }}>
                        HK SPORT
                    </Typography>
                    <IconButton
                        onClick={this.close}
                        aria-label="close chat view">
                        <CloseIcon htmlColor='white' fontSize={'small'} />
                    </IconButton>
                </Grid>
                {/* BODY */}
                {newmessage == true
                    ? <Grid container direction='column' alignItems='center'
                        style={{ position: 'absolute', zIndex: 2000 }}>
                        <div style={{
                            fontFamily: `Arial, Helvetica, sans-serif`,
                            color: '#007CFC', cursor: 'pointer',
                            paddingBlock: 5, paddingInline: 10,
                            border: `1px solid #007CFC`,
                            borderRadius: 20, marginTop: 10
                        }}
                            onClick={() => { this.getData(true) }}>Tin nhắn mới</div>
                    </Grid>
                    : null
                }
                {loading == true && messageList.length == 0
                    ? <Grid container
                        alignItems='center' justify='center'
                        style={{ height: chatHeight * 0.85 }}>
                        <CircularProgress />
                    </Grid>
                    : <List style={{
                        maxHeight: chatHeight * 0.85,
                        height: chatHeight * 0.85,
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
                                <ListItem style={item.isMe == true ? { justifyContent: 'flex-end' } : null}>
                                    {item.isMe == false
                                        ? index != 0 && !messageList[index - 1].isMe
                                            ? <Grid container
                                                justify='center' alignItems='center'
                                                style={{
                                                    width: 35, height: 35, marginRight: 5,
                                                }}>
                                            </Grid>
                                            : <Grid container
                                                justify='center' alignItems='center'
                                                style={{
                                                    width: 35, height: 35, borderRadius: 35,
                                                    backgroundColor: '#34B089', marginRight: 5,
                                                }}>
                                                <Typography variant="body2"
                                                    style={{ color: 'white', fontWeight: 'bold' }}>
                                                    HK
                                                </Typography>
                                            </Grid>
                                        : null
                                    }
                                    {item.Message != ''
                                        ? <div style={{
                                            fontFamily: `Arial, Helvetica, sans-serif`,
                                            backgroundColor: '#25A6FD', maxWidth: chatWidth * 0.4,
                                            alignSelf: 'center', borderRadius: 15,
                                            color: 'white', paddingInline: 10, paddingBlock: 5
                                        }}>
                                            {item.Message}
                                        </div>
                                        : <ThumbUpIcon fontSize='large' htmlColor='#25A6FD' />
                                    }
                                </ListItem>
                                {index == messageList.length - 1 && item.isMe == true && item.Seen == true
                                    ? <Grid container item direction='row'
                                        justify='flex-end' style={{ width: '92%' }}>
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
                {/* SEND MESSAGE AREA */}
                <Grid container item xs={12}
                    direction='row' justify='space-between'
                    style={{ paddingInline: 5, marginBottom: 5 }}>
                    <Grid container item xs={10}
                        direction='row' justify='center' alignItems='center'
                        style={{ borderRadius: 20, backgroundColor: '#e8e8e8', height: chatHeight * 0.11 }}>
                        <TextField
                            value={message}
                            id="message"
                            disabled={loading}
                            name="message"
                            style={{ width: '88%' }}
                            variant="standard"
                            onChange={this.onChange}
                            placeholder='Nhập tin nhắn...' />
                    </Grid>
                    <IconButton
                        disabled={loading}
                        onClick={this.sendMessage}
                        color="primary" size='medium'>
                        {message.trim() != ''
                            ? <SendIcon />
                            : <ThumbUpIcon />
                        }
                    </IconButton>
                </Grid>
            </Box>
        )
    };
};
ChatView.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ChatView);