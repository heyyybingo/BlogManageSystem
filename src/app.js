import Vue from "vue"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router.js' //引入路由
import app from "./App.vue"
import axios from 'axios'
import VueAxios from 'vue-axios'



// 这里为了方便全部引入了，虽然可能引起打包项目比较大，但是总体来说这是一个小项目，不碍事
Vue.use(ElementUI);

// axios
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = 'http://101.37.13.10/blog/api';

Vue.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 拦截器
Vue.axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = "Bearer " + localStorage.getItem('token');
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    });

Vue.axios.interceptors.response.use(response => {

        return response
    },
    error => {

        if (error && error.response) {
            switch (error.response.status) {
                case 401:
                    Vue.prototype.$notify({
                        title: '提示',
                        message: '登录验证失败',
                        offset: 100
                    });
                    router.push('/login');
                    break;
                case 500:
                    Vue.prototype.$notify({
                        title: '提示',
                        message: '服务端出错',
                        offset: 100
                    });

                    break;

            }
            // console.log(error, 1111)
            return error;
        } else {
            Vue.prototype.$notify({
                title: '提示',
                message: '网络故障！',
                offset: 100
            });
        }
    }
)
const vm = new Vue({
    el: "#app",
    router,
    render: c => c(app)
})