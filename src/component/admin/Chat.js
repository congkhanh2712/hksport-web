import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import instance from '../../AxiosConfig';
import UserList from './Chat/UserList';
import fbApp from '../../Firebase';
import ChatScreen from './Chat/ChatScreen';
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
        this.getData();
        fbApp.database().ref('TblMessage').on('child_changed',val=>{
            this.getData();
        })
        fbApp.database().ref('TblMessage').on('child_added',val=>{
            this.getData();
        })
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
                        loading: false
                    })
                    if(this.state.chosing == ''){
                        this.setState({
                            chosing: list[0]
                        })
                    }
                }
            })
    }
    render() {
        const { width, height, data, chosing, loading } = this.state;
        return (
            <div style={{ width: width * 0.975, height: height * 0.77, marginBlock: 10 }}>
                <Grid container spacing={1}
                    style={{ height: '100%' }}
                    justify={'space-around'}>
                    <UserList data={data} onClick={this.MenuItemClick} loading={loading} />
                    <ChatScreen user={chosing.user} />
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