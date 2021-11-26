<template>
    <div id="auth-page">
        <div id="auth-sidebar">
            <span class="position-absolute" style="left: 25px;top:25px">
                <router-link :to="{name: 'Login'}">Back to login</router-link>
            </span>
            <div class="form m-5 w-75">
                <h2 class="mb-3">Register</h2>
                <form @submit.prevent="registerUser" method="post" novalidate class="position-relative p-2">
                    <div class="input-group mb-2">
                        <input type="text" class="form-control" placeholder="Username" id="register_username"
                               v-model="register.username"
                               :class="{'border-danger': errors.username}">
                        <div class="text-danger small w-100" v-if="errors.username">{{ errors.username }}</div>
                    </div>

                    <div class="input-group mb-2">
                        <input type="text" class="form-control" placeholder="Email" id="register_email"
                               v-model="register.email"
                               :class="{'border-danger': errors.email}">
                        <div class="text-danger small w-100" v-if="errors.email">{{ errors.email }}</div>
                    </div>

                    <div class="input-group mb-2">
                        <input type="password" class="form-control" placeholder="Password" id="register_password"
                               v-model="register.password"
                               :class="{'border-danger': errors.password}">
                        <div class="text-danger small w-100" v-if="errors.password">{{ errors.password }}</div>
                    </div>

                    <div class="input-group mb-2">
                        <input type="password" class="form-control" placeholder="Password"
                               id="register_password_confirm"
                               v-model="register.password_confirmation"
                               :class="{'border-danger': errors.password_confirmation}">
                        <div class="text-danger small w-100" v-if="errors.password_confirmation">{{ errors.password_confirmation }}</div>
                    </div>

                    <button class="btn w-100 btn-login" type="submit">
                        Register
                    </button>
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

export default {
  name: 'Register',
  components: {},
  data: () => {
    return {
      login: {
        username: '',
        password: ''
      },
      register: {
        username: '',
        password: '',
        password_confirmation: '',
        email: ''
      },
      errors: {}
    }
  },
  methods: {
    loginUser: function () {
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
    'register error'(errors) {
      console.log(errors)
      this.errors = {...errors};
    },
    'redirect to play'() {
      console.log("redirecting to play")
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>
