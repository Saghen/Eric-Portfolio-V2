<template>
  <div id="login-modal">
    <h1>Author Login</h1>
    <div class="input">
      <label for="email">Email</label>
      <input type="text" name="email" v-model="email" @keydown.enter="login()">
    </div>
    <div class="input">
      <label for="password">Password</label>
      <input type="password" name="password" v-model="password" @keydown.enter="login()">
    </div>
    <a class="button" @click.prevent="login()">LOG IN</a>
    <span class="error-message" v-show="errorMessage">{{ errorMessage }}</span>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: undefined
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.$http.post('/api/auth/login', {
          email: this.email,
          password: this.password
        });

        const data = response.data.data;

        this.$http.defaults.headers.Authorization = 'Bearer ' + data.token;
        this.$modal.hide('login');
      } catch (err) {
        if (err.response)
          this.errorMessage = err.response.data.errors
            .map(obj => obj.message)
            .join('. ');
        else {
          this.errorMessage =
            'An unkown error occured. Check the console for more info.';
          console.log(err);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/_globals.scss';

#login-modal {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 48px;
  background: #fff;
  position: relative;

  > h1 {
    color: $primary;
    margin: 0;
  }

  > * + * {
    margin-top: 48px;
  }

  div.input > input {
    box-sizing: border-box;
    width: 100%;
  }

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    background: $primary;
  }
}
</style>