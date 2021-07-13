import React, { Component } from 'react';
import '../../App.css';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import instance from '../../AxiosConfig';
import { facebookProvider, auth } from '../../Firebase';
import FacebookIcon from '@material-ui/icons/Facebook';


const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      email: "",
      password: "",
      success: false,
      name: '',
      fbemail: '',
      avatar: '',
      redirect: null,
    }
  }
  componentDidMount = () => {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.setState({
        success: true,
      })
    }
  }

  onChange = async (event) => {
    var name = event.target.name;
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    await this.setState({
      [name]: value
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    var { email, password } = this.state;
    instance.post('/auth/login', {
      email, password
    }).then(res => {
      if (res.data.succeed == true) {
        localStorage.setItem('user', JSON.stringify({
          refreshToken: res.data.user.stsTokenManager.refreshToken,
          expired_time: res.data.user.stsTokenManager.expirationTime.toString(),
          token: res.data.user.stsTokenManager.accessToken,
        }));
        this.props.tokenCheck(1);
        toast.success(res.data.message);
        setTimeout(() => {
          this.setState({
            success: true,
          })
        }, 2000);
      } else {
        toast.error(res.data.message);
      }
    })
  }
  signInWithFaceBook = () => {
    auth.signInWithPopup(facebookProvider)
      .then((res) => {
        console.log(res)
        const profile = res.additionalUserInfo.profile;
        this.setState({
          name: profile.name,
          fbemail: profile.email,
          avatar: profile.picture.data.url,
        }, () => {
          if (res.additionalUserInfo.isNewUser == true) {
            this.setState({
              redirect: res.user.za
            })
          } else {
            localStorage.setItem('user', JSON.stringify({
              refreshToken: res.user.refreshToken,
              expired_time: (res.user.i.u + 3600000).toString(),
              token: res.user.za,
            }));
            this.props.tokenCheck(1);
            toast.success("Đăng nhập thành công");
            setTimeout(() => {
              this.setState({
                success: true,
              })
            }, 2000);
          }
        })
      }).catch(err => {
        console.log(err)
        if (err.code == 'auth/account-exists-with-different-credential') {
          toast.error('Tài khoản đã tồn tại trong hệ thống. Vui lòng nhập mật khẩu để đăng nhập')
          this.setState({
            email: err.email
          })
        }
      })
  }
  render() {
    const { success, redirect, name, avatar, fbemail } = this.state;
    const { classes } = this.props;
    if (success === true) {
      return <Redirect to="/" />
    }
    if (redirect != null) {
      return <Redirect to={{
        pathname: "/sign-up",
        state: {
          name,
          fbemail,
          avatar,
          credential: redirect
        }
      }} />
    }
    return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.email}
              onChange={this.onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.onChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={this.signInWithFaceBook}
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<FacebookIcon />}
            >
              Sign In With Facebook
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginBlock: 10 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/reset-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            //Define default options
            className: '',
            style: {
              margin: '40px',
              background: '#00e676',
              color: 'white',
              zIndex: 1,
            },
            duration: 5000,
            // Default options for specific types
            success: {
              duration: 3000,
              // theme: {
              //     primary: 'yellow',
              //     secondary: 'yellow',
              // },
              style: {
                margin: '100px',
                background: '#00e676',
                color: 'white',
                zIndex: 1,
              },
            },
            error: {
              duration: 3000,
              style: {
                margin: '100px',
                background: 'red',
                color: 'white',
                zIndex: 1,
              },
            },
          }} />
      </Container>
    )
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SignIn);