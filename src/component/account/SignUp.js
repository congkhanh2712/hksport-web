import React, { Component } from 'react';
import '../../App.css';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import BootstrapButton from 'react-bootstrap/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import vn from './vn.json';
import instance from '../../AxiosConfig';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { storage } from "../../Firebase";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(-2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      email: "",
      password: "",
      repassword: "",
      success: false,
      tinhTP: "",
      quanHuyen: "",
      phuongXa: "",
      hoTen: "",
      sdt: "",
      address: "",
      location: "",
      width: window.innerWidth,
      file: null,
      openDialog: false,
      verify: '',
      verifycode: '',
      avatar: 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg'
    }
  }
  componentDidMount() {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.setState({
        success: true,
      })
    }
    console.log(this.props.location)
    const { state } = this.props.location;
    if (state != undefined) {
      this.setState({
        email: state.fbemail,
        avatar: state.avatar,
        hoTen: state.name,
      })
    }
    window.addEventListener('resize', () => {
      this.setState({ width: window.innerWidth });
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.quanHuyen != this.state.quanHuyen) {
      this.setState({
        phuongXa: "",
        address: ''
      })
    }
    if (prevState.tinhTP != this.state.tinhTP) {
      this.setState({
        phuongXa: "",
        address: '',
        quanHuyen: ''
      })
    }
  }
  onChange = async (event) => {
    var name = event.target.name;
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    await this.setState({
      [name]: value
    });
  }
  postData = (url) => {
    var { email, password } = this.state;
    instance.post('/auth/register', {
      email: email,
      password: password,
      name: this.state.hoTen,
      phone: this.state.sdt,
      address: this.state.address,
      city: this.state.tinhTP,
      location: this.state.location,
      district: this.state.quanHuyen,
      ward: this.state.phuongXa,
      avatar: url
    }).then(res => {
      if (res.data.succeed == true) {
        toast.success(res.data.message);
        setTimeout(() => {
          this.setState({
            success: true,
          })
        }, 2000);
      } else {
        toast.error(res.data.message)
      }
    })
  }
  ktraSDT(sdt) {
    for (var x of sdt) {
      if (x.charCodeAt(0) > 57 || x.charCodeAt(0) < 48) {
        return false;
      }
    }
    return true;
  }
  onSubmit = (event) => {
    event.preventDefault();
    var { email, password, repassword, hoTen, sdt, address, tinhTP, quanHuyen, phuongXa } = this.state;
    if (email.trim() != '' && hoTen.trim() != ''
      && sdt.trim() != '' && address.trim() != ''
      & tinhTP != '' && quanHuyen != '' && phuongXa != '') {
      if (password !== repassword) {
        this.setState({
          password: '',
          repassword: '',
        })
        toast.error("M???t kh???u x??c nh???n kh??ng ????ng, vui l??ng ki???m tra l???i");
      } else {
        if (sdt.length == 10 && this.ktraSDT(sdt) == true) {
          const { state } = this.props.location;
          if (state == undefined && password.trim() != '' && repassword.trim() != '') {
            instance.post('/mail', {
              email
            }).then(res => {
              console.log(res)
              if (res.status == 200) {
                if (res.data.succeed == true) {
                  this.setState({
                    openDialog: true,
                    verify: res.data.code,
                  })
                } else {
                  toast.error("Email ????ng k?? kh??ng t???n t???i");
                  this.setState({
                    email: ''
                  })
                }
              }
            })
          } else if (state != undefined) {
            const { email, avatar } = this.state;
            instance.post('/auth/fbregister', {
              token: state.credential,
              name: this.state.hoTen,
              phone: this.state.sdt,
              address: this.state.address,
              city: this.state.tinhTP,
              location: this.state.location,
              district: this.state.quanHuyen,
              ward: this.state.phuongXa,
              avatar, email,
            }).then(res => {
              if (res.data.succeed == true) {
                toast.success(res.data.message);
                setTimeout(() => {
                  this.setState({
                    success: true,
                  })
                }, 2000);
              } else {
                toast.error(res.data.message)
              }
            })
          } else {
            toast.error('Vui l??ng nh???p m???t kh???u ????ng k??')
          }
        } else {
          toast.error('Vui l??ng nh???p ????ng ?????nh d???ng s??? ??i???n tho???i')
        }
      }
    } else {
      toast.error("Vui l??ng ??i???n ?????y ????? th??ng tin ????ng k??");
    }
  }
  verify = () => {
    const { state } = this.props.location;
    if (this.state.verify == this.state.verifycode) {
      if (this.state.file != null) {
        const imgRef = storage.ref(`images/avatar/${Date.now()}.jpg`);
        imgRef.put(this.state.file)
          .then(async () => {
            const url = await imgRef.getDownloadURL();
            this.postData(url)
          })
      } else if (state == undefined) {
        this.postData('')
      } else {
        this.postData(this.state.avatar)
      }
      toast.success("Ok");
    } else {
      toast.error("M?? x??c nh???n kh??ng ????ng");
    }
  }
  onClick = () => {
    document.getElementById('avatar').click();
  }
  handleChange = (e) => {
    if (e.target.files[0]) {
      this.setState({
        file: e.target.files[0]
      })
    }
  }
  render() {

    var vn1 = vn;
    var quanhuyen = vn1.filter(x => {
      return x.name === this.state.tinhTP;
    });
    //Truy???n c??c huy???n v?? m???ng huyen[]
    var huyen = []
    quanhuyen.map((x, index) => {
      x.huyen.forEach(function (item) {
        huyen.push(item)
      });
    });
    //Truy???n c??c huy???n v?? m???ng xa[]
    var xa = [];
    var location = [];
    vn.forEach((tinh) => {
      if (tinh.name === this.state.tinhTP) {
        tinh.huyen.forEach((huyen) => {
          if (huyen.name === this.state.quanHuyen) {
            huyen.xa.forEach((x) => {
              xa.push(x.name);
              location.push(x.location);
            })
          }
        })
      }
    });
    //T??m location c???a x??:
    if (this.state.phuongXa !== "") {
      xa.forEach((x, index) => {
        if (x === this.state.phuongXa) {
          this.state.location = location[index];
        }
      })
    }

    const { success, width, avatar, file } = this.state;
    const { classes } = this.props;
    const { state } = this.props.location;
    if (success === true) {
      return <Redirect to="/sign-in" />
    }
    return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            TRANG ????NG K??
          </Typography>
          <Grid container spacing={3} style={{ width, marginBlock: 15 }} alignItems='center'>
            <form className={classes.form} noValidate onSubmit={this.onSubmit}>
              <Grid container item spacing={5} direction={'row'} alignItems={'flex-start'} justify={'center'}>
                <Grid container item xs={3} direction={'column'} alignItems={'center'}>
                  <Typography component="h1" variant="h5">
                    ???nh ?????i di???n
                  </Typography>
                  <img
                    width={width / 7} height={width / 7}
                    src={file != null ? URL.createObjectURL(file) : avatar}
                    style={{ marginBlock: 10, borderRadius: width / 7 }} />
                  <input
                    accept="image/*"
                    id="avatar"
                    className={classes.input}
                    name="avatar"
                    type="file"
                    hidden
                    onChange={this.handleChange}
                  />
                  <BootstrapButton
                    variant="success"
                    color="primary"
                    style={{ marginBlock: 5 }}
                    component="span"
                    disabled={state != undefined ? true : false}
                    onClick={this.onClick}>
                    Ch???n h??nh ???nh
                  </BootstrapButton>
                  <BootstrapButton
                    variant="success"
                    color="primary"
                    style={{ marginBlock: 5 }}
                    disabled={state != undefined ? true : false}
                    component="span"
                    onClick={() => { this.setState({ file: null }) }}>
                    X??a h??nh ???nh
                  </BootstrapButton>
                </Grid>
                <Grid item xs={3}>
                  <Typography component="h1" variant="h5">
                    Th??ng tin c?? nh??n
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email ????ng nh???p"
                    name="email"
                    autoComplete="email"
                    value={this.state.email}
                    disabled={state != undefined ? true : false}
                    autoFocus
                    onChange={this.onChange}
                  />
                  {state != undefined
                    ? null
                    : <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="M???t kh???u"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={this.onChange}
                    />
                  }
                  {state != undefined
                    ? null
                    : <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="repassword"
                      label="Nh???p l???i m???t kh???u"
                      type="password"
                      id="repassword"
                      autoComplete="current-password"
                      onChange={this.onChange}
                    />
                  }
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="hoTen"
                    label="H??? v?? t??n"
                    value={this.state.hoTen}
                    disabled={state != undefined ? true : false}
                    id="password"
                    autoComplete="current-password"
                    onChange={this.onChange}
                  />
                </Grid>
                <Grid container item xs={3} >
                  <Typography component="h1" variant="h5">
                    ?????a ch???
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="sdt"
                    label="S??? ??i???n tho???i"
                    id="repassword"
                    autoComplete="current-password"
                    onChange={this.onChange}
                  />
                  <FormControl className={classes.formControl}>
                    <InputLabel >T???nh/TP</InputLabel>
                    <NativeSelect
                      value={this.state.tinhTP}
                      defaultValue={this.state.tinhTP}
                      inputProps={{
                        name: 'tinhTP',
                      }}
                      onChange={this.onChange}
                    >
                      <option aria-label="None" value="" />
                      {vn.map((x, index) => {
                        return <option key={index} value={x.name}>{x.name}</option>
                      })}
                    </NativeSelect>
                    {/* <FormHelperText>Uncontrolled</FormHelperText> */}
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel >Qu???n/Huy???n</InputLabel>
                    <NativeSelect
                      value={this.state.quanHuyen}
                      defaultValue={this.state.quanHuyen}
                      inputProps={{
                        name: 'quanHuyen',
                      }}
                      onChange={this.onChange}
                    >
                      <option aria-label="None" value="" />
                      {huyen.map((item, index) => {
                        return <option key={index} value={item.name}>{item.name}</option>
                      })}
                    </NativeSelect>
                    {/* <FormHelperText>Uncontrolled</FormHelperText> */}
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel >Ph?????ng/X??</InputLabel>
                    <NativeSelect
                      value={this.state.phuongXa}
                      defaultValue={this.state.phuongXa}
                      inputProps={{
                        name: 'phuongXa',
                      }}
                      onChange={this.onChange}
                    >
                      <option aria-label="None" value="" />
                      {xa.map((x, index) => {
                        return <option key={index} value={x}>{x}</option>
                      })}
                    </NativeSelect>
                    {/* <FormHelperText>Uncontrolled</FormHelperText> */}
                  </FormControl>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="address"
                    label="?????a ch???"
                    id="repassword"
                    autoComplete="current-password"
                    onChange={this.onChange}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    ????NG K??
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link to="/sign-in" variant="body2">
                        {"B???n ???? c?? t??i kho???n? ????ng nh???p"}
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </div>
        <Dialog
          open={this.state.openDialog}
          onClose={() => { this.setState({ openDialog: false }) }}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">X??C NH???N ????NG K??</DialogTitle>
          <DialogContent>
            <DialogContentText>
              M?? x??c th???c v???a ???????c g???i t???i email c???a b???n.
            </DialogContentText>
            <DialogContentText>
              Vui l??ng ki???m tra email v?? nh???p m?? x??c nh???n v??o tr?????ng b??n d?????i.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="M?? x??c nh???n"
              fullWidth
              name="verifycode"
              onChange={this.onChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.setState({ openDialog: false }) }} color="primary">
              Cancel
            </Button>
            <Button onClick={this.verify} color="primary">
              X??c nh???n
            </Button>
          </DialogActions>
        </Dialog>
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

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SignUp);