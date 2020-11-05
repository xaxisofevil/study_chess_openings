<template>
  <v-app id="inspire" class="myFont">
    
    <v-app-bar app absolute color="rgb(88 132 158)">
      <router-link to="/"><img class="mr-3" :src="require('./assets/images/headline_sm.png')" height="40" v-show="!$vuetify.breakpoint.mdAndUp"/></router-link>
      <v-spacer></v-spacer>
      <router-link to="/"><img class="mr-3" :src="require('./assets/images/headline.png')" height="40" v-show="!$vuetify.breakpoint.smAndDown"/></router-link>
      <v-spacer></v-spacer>
      <v-btn class="logbutton loginbutton" v-if="!$auth.isAuthenticated" @click="login">Log in/Register</v-btn>
      <div v-if="$auth.isAuthenticated">
        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar color="transparent" size="48">
                <v-icon dark>
                mdi-account-circle
              </v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="transparent">
                  <v-icon>
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
                <h3>{{ $auth.user.name }}</h3>
                <p class="caption mt-1">
                  {{ $auth.user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logout">
                  Log Out
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </div>
      
    </v-app-bar>

    <keep-alive include="Home">
      <transition name="fade" mode="out-in" >
        <router-view/>
      </transition>
    </keep-alive>

    
    <v-footer color="rgb(88 132 158)">
      <v-container :fluid="$vuetify.breakpoint.mdAndDown">
        <v-row class="flex-wrap-reverse" :dense="$vuetify.breakpoint.smAndDown">
          <v-col sm="12" md="4" lg="4" xl="3"></v-col>
          <v-col sm="12" md="8" lg="7" xl="5">
                <v-bottom-navigation background-color="transparent" dark grow>
                  <v-btn to="/"><span>Play</span><v-icon>mdi-checkerboard</v-icon></v-btn>
                  <v-btn to="/explorer"><span>Explorer</span><v-icon>mdi-magnify</v-icon> </v-btn>
                  <v-btn to="/about"><span>About</span><v-icon>mdi-comment-question-outline</v-icon></v-btn>
                  <v-btn href='https://ko-fi.com/E1E72B6XC' target="_blank"><span>Donate</span><v-icon>mdi-cash-usd</v-icon></v-btn>
                  <v-btn to="/engine"><span>Engine</span><v-icon>mdi-fish</v-icon></v-btn>
                </v-bottom-navigation>
            </v-col>
          <v-col xl="2" lg="2" v-show="$vuetify.breakpoint.mdAndUp"></v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "loginbutton",
  data: () => ({
    initials: '',
  }),
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>


<style>
.myFont {
  font-family:
          "Open Sans",
          "Segoe UI Symbol",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Source Sans Pro",
          "Helvetica Neue",
          Helvetica,
          Arial,
          sans-serif !important;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>