

//cau hinh axios
const instance = require('axios').default;
instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    var user = JSON.parse(localStorage.getItem("user"));
    if (user != null) {
        instance.defaults.headers['x-access-token'] = user.token;
    };
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
instance.interceptors.response.use((response) => {
    return response
}, async error => {
    // return Promise.reject(error)
    var user = JSON.parse(localStorage.getItem("user"));
    if ( error.response != null && error.response.status == 401 && user != null) {
        if (error.response.data.code == "auth/id-token-revoked"
            || error.response.data.code == 'auth/id-token-expired') {
            localStorage.removeItem("user");
            alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại')
            window.location.pathname = '';
        }
    } else {
        return Promise.reject(error)
    }
})

export default instance

