import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from "vue-socket.io";
import io from 'socket.io-client'
import VTooltip from "v-tooltip";
const sock = io(process.env.VUE_APP_SOCKET_CONNECTION);
import {Cloudinary} from "@cloudinary/base";
import vClickOutside from 'click-outside-vue3'

window.$cld = new Cloudinary({
  cloud: {
    cloudName: process.env.VUE_APP_CLOUDINARY
  }
});
createApp(App)
  .use(new VueSocketIO({
    debug: process.env.VUE_APP_DEBUG_MODE || false,
    connection: sock,
  }))
  .use(vClickOutside)
  .use(router)
  .use(VTooltip)
  .mount('#app')
