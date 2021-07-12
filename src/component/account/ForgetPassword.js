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
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Redirect, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import fbApp from '../../Firebase'
import instance from '../../AxiosConfig';

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
    minHeight: 310,
  },
  submit: {
    margin: theme.spacing(3, 0, -1),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      email: "",
      success: false
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
    var { email } = this.state;
    instance.post('/auth/forget-password',{ email })
      .then(res => {
        if (res.data.succeed == true) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
  }

  render() {
    const { success } = this.state;
    const { classes } = this.props;
    if (success === true) {
      return <Redirect to="/" />
    }
    return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
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
              onChange={this.onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Send email to reset password
            </Button>
            <Link to="/sign-in" variant="body2">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Go to Login page
              </Button>
            </Link>

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

ForgetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ForgetPassword);