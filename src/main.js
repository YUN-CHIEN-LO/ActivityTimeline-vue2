import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue'
import dayjs from 'dayjs'
import Mock from './mock'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

// == bootstrap ==
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.css'
Vue.use(BootstrapVue)
Vue.use(ModalPlugin)
Vue.use(IconsPlugin)

// == dayjs.js ==
/**
 * 回傳格式後的日期(YYYY/MM/DD)
 * @param {Obj} date - Date object 
 * @param {String} format - date format 
 * @returns {Obj} Date object 
 */
const dateFormatSlash = (date, format = 'YYYY/MM/DD') => {
        return date ? dayjs(date).format(format) : ''
    }
    /**
     * 註冊全域plugin
     */
const timeParserPlugin = {
    install(Vue, options) {
        Vue.prototype.$dateFormatSlash = dateFormatSlash
    }
}
Vue.use(timeParserPlugin)

// Vue.use(Mock)
// const Mock = require('mockjs')
Vue.use(VueAxios, axios)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')