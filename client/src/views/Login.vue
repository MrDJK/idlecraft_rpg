<template>
    <div id="auth-page">
        <div id="auth-sidebar">
            <div class="form m-5 w-75">
                <h2 class="mb-3">Login</h2>

                <form @submit.prevent="loginUser" method="post" novalidate class="position-relative p-2">
                    <LoadingIndicator :loading="loading" />
                    <div class="input-group mb-2">
                        <input type="text" class="form-control" placeholder="Username" id="username"
                               v-model="login.username"
                               :class="{'border-danger': errors.username}">
                        <div class="text-danger small w-100" v-if="errors.username">{{ errors.username }}</div>
                    </div>

                    <div class="form-group mb-3">
                        <input type="password" class="form-control" placeholder="Password" id="password"
                               v-model="login.password"
                               :class="{'border-danger': errors.password}">
                        <div class="text-danger small w-100" v-if="errors.password">{{ errors.password }}</div>
                    </div>

                    <button class="btn w-100 btn-login mb-4" type="submit">
                        Login
                    </button>

                    <router-link class="btn w-100 btn-login" :to="{name: 'Register'}">
                        Register for alpha
                    </router-link>
                </form>
            </div>
        </div>
        <div id="auth-main-content">
            <div class="p-5 m-5 w-75">
                <h1>IdleCraft</h1>
                <h3>An idle adventure in the world of Minecraft</h3>
                <p>Step into the world of Minecraft directly in your browser and take part in this idle adventure.
                    Commit as much or as little time as you want as most actions are idle, meaning you can start them
                    and disappear, offline actions last for 12 hours before they will stop and you will need to login
                    again to restart</p>
            </div>
        </div>
    </div>
</template>
<script>

import LoadingIndicator from "../components/LoadingIndicator";
export default {
  name: 'Login',
  components: {LoadingIndicator},
  data: () => {
    return {
      login: {
        username: '',
        password: ''
      },
      register: {
        username: '',
        password: '',
        password_confirmation: ''
      },
      errors: [],
      loading: false,
    }
  },
  methods: {
    loginUser: function () {
      if(this.loading)
        return;

      this.loading = true;
      this.$socket.emit("guest:login", this.login);
    },
    registerUser() {
      this.$socket.emit("guest:register", this.register)
    }
  },
  sockets: {
    'login success'(token) {
      localStorage.setItem(process.env.VUE_APP_JWT_NAME, token);
      this.$socket.emit('auth', {token})
    },
    'register success'(token) {
      localStorage.setItem(process.env.VUE_APP_JWT_NAME, token);
      this.$socket.emit('auth', {token})
    },
    'redirect to play'() {
      console.log("redirecting to play")
      this.$router.push({
        name: 'Home'
      })
    },
    'login error'(errors) {
      this.errors = errors
      this.loading = false;
    }
  }
}
</script>
