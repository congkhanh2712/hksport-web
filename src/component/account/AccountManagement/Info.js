import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { ProgressBar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { storage } from "../../../Firebase";


const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    sizeAva: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    button: {
        margin: theme.spacing(1),
    },
    roott: {
        width: "90%",
    },
});

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            file: null,
        }
    }
    componentDidMount = () => {
    }
    handleChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                file: e.target.files[0]
            })
            this.props.onChange(e)
        }
    }
    uploadImage = () => {
        const imgRef = storage.ref(`images/avatar/${Date.now()}.jpg`);
        imgRef.put(this.state.file)
            .then(async () => {
                const url = await imgRef.getDownloadURL();
                this.props.updateInfo(url)
            })
    }
    onClick = () => {
        document.getElementById('avatar').click();
    }
    render() {
        var { classes,
            createDate,
            email,
            name,
            onChange,
            phone,
            disabled,
            role,
            point,
            pointAvailable,
            pointNeed,
            nextLv,
            avatar } = this.props;
        const { file } = this.state;
        return (
            <Grid item xs={6}>
                <div
                    className={classes.well}
                    style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: 214 }}
                >
                    <Grid container spacing={0}>
                        <Grid container item xs={3} alignItems='center' justify='center'>
                            <Avatar className={classes.sizeAva} alt="Avatar"
                                style={{ marginBlock: 10 }}
                                src={file != null ? URL.createObjectURL(file) : avatar} />
                            <input
                                accept="image/*"
                                id="avatar"
                                className={classes.input}
                                name="avatar"
                                type="file"
                                hidden
                                onChange={this.handleChange}
                            />
                            <Button
                                variant="success"
                                color="primary"
                                component="span"
                                onClick={this.onClick}>
                                Chọn hình ảnh
                            </Button>
                            <Typography variant="subtitle1" gutterBottom>
                                Ngày tham gia
                                    </Typography>
                            <Typography variant="subtitle1" gutterBottom style={{ marginTop: -10, marginLeft: 8 }}>
                                {createDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} style={{ borderLeft: `2px solid #f0f0f0`, marginLeft: -10 }}>
                            <div style={{ marginLeft: 10 }}>
                                <Typography variant="subtitle1" gutterBottom style={{ marginTop: 8, wordWrap: "break-word" }}>
                                    Email: {email}
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={1} style={{ marginTop: 8 }}>
                                        <Typography variant="subtitle1">
                                            Tên:
                                                </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            style={{ width: "93%", marginLeft: 10 }}
                                            value={name}
                                            size="small"
                                            variant="outlined"
                                            name="name"
                                            onChange={onChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} >
                                    <Grid item xs style={{ marginTop: 8 }}>
                                        <Typography variant="subtitle1">
                                            Số điện thoại:
                                            </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            style={{ width: "120%", marginLeft: -25 }}
                                            value={phone}
                                            size="small"
                                            variant="outlined"
                                            name="phone"
                                            onChange={onChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    onClick={() => { this.uploadImage() }}
                                    variant="success"
                                    disabled={disabled}
                                    style={{
                                        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                                        width: "98%",
                                        marginTop: 10,
                                        marginBottom: 5
                                    }}>
                                    Lưu thay đổi
                                        </Button>
                            </div>
                        </Grid>

                        <Grid item xs={5} style={{ borderLeft: `2px solid #f0f0f0` }}>
                            <div style={{ marginLeft: 10 }}>
                                <Typography variant="subtitle1" gutterBottom style={{ marginTop: 8 }}>
                                    Loại tài khoản: {role}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom style={{ marginTop: 8 }}>
                                    Tổng điểm tích luỹ: {point} điểm
                                        </Typography>
                                <Typography variant="subtitle1" gutterBottom style={{ marginTop: 8 }}>
                                    Điểm khả dụng: {pointAvailable} điểm
                                        </Typography>
                                <ProgressBar variant="success" now={point / 25000 * 100} />
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" gutterBottom>
                                            0
                                                </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" gutterBottom style={{ marginLeft: -13 }}>
                                            10000
                                                </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" gutterBottom style={{ marginLeft: 40 }}>
                                            25000
                                                </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="caption" gutterBottom style={{ marginLeft: 35, paddingTop: 20 }}>
                                    {pointNeed > 0 ? `(Còn ${pointNeed} điểm để lên ${nextLv})` : ""}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        )
    }
}

Info.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Info);