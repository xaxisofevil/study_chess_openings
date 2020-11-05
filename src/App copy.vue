<template>
  <v-app id="inspire">
    
    <v-app-bar app absolute color="rgb(88 132 158)">
      <img class="mr-3" :src="require('./assets/images/headline_sm.png')" height="40" v-show="!$vuetify.breakpoint.mdAndUp"/>
      <v-spacer></v-spacer>
      <img class="mr-3" :src="require('./assets/images/headline.png')" height="40" v-show="!$vuetify.breakpoint.smAndDown"/>
      <v-spacer></v-spacer>
      <v-btn @click="overlay = !overlay">Log In</v-btn>
    </v-app-bar>


    <v-main class="grey lighten-3 flex-column-reverse">
      <v-container :fluid="$vuetify.breakpoint.mdAndDown">
        <v-row class="flex-wrap-reverse">

          <v-col sm="12" md="4" lg="4" xl="3" class="flex-column-reverse">
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-text-field v-model="search" label="Search Openings" dark flat solo-inverted hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
            </v-sheet>
            <v-sheet id = "treeSection" class="overflow-y-auto  rounded-b-lg" min-height="268" elevation="14">
              <v-treeview dense selectable open-on-click transition :items="items" :search="search" :filter="filter"></v-treeview>
            </v-sheet>
          </v-col>
          
          <v-col sm="12" md="8" lg="7" xl="5">
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-banner outlined single-line class="text-h5 font-weight-bold" color="rgb(115 152 174)" align="center" justify="center">{{lineName}}</v-banner> 
            </v-sheet>
            <v-sheet id = "boardSection" align="center" justify="center" >
              <v-card>
                <v-sheet min-height="5"></v-sheet>
                <v-overlay absolute :value="overlay">
                  <v-card>
                    <v-list-item three-line>
                      <v-list-item-title class="headline mb-1">
                        Select an opening to get started
                      </v-list-item-title>
                    </v-list-item>
                    <v-card-actions>
                      <v-spacer/>
                    <v-btn text color="success" @click="overlay = false">
                      Hide Overlay
                    </v-btn>
                    <v-spacer/>
                    <v-btn text color="success" @click="overlay = false">
                      Hide Overlay
                    </v-btn>
                    <v-spacer/>
                    </v-card-actions>
                  </v-card>
                </v-overlay>
                <chessboard/> <!--------------------------------------------------------------- -->
              </v-card>
            </v-sheet>
            <v-sheet class="rounded-b-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-row align="center" justify="space-around">
                <v-spacer/>
                <v-btn text class="ma-1" dark elevation="14">New</v-btn>
                <v-spacer/>
                <v-btn text class="ma-1" elevation="14" dark>Reset</v-btn>
                <v-spacer/>
                <v-btn text class="ma-1" elevation="14" dark>Flip Board</v-btn>
                <v-spacer/>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col xl="2" lg="2" v-show="$vuetify.breakpoint.smAndDn">
            <v-sheet class=".d-sm-none .d-md-flex" :min-height="$vuetify.breakpoint.xs ? 300 : 400"></v-sheet>
          </v-col>

        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {chessboard} from 'vue-chessboard'
import 'vue-chessboard/dist/vue-chessboard.css'
import 'vuetify/dist/vuetify.min.css'
import './plugins/reset-css.css'
import {tree_data} from './assets/data/treedata.js'
  export default {
    components: {
      chessboard
    },
    data: () => ({
      links: [
        'Dashboard',
        'Messages',
        'Profile',
        'Updates',
      ],
      orient: 'white',
      items: tree_data,
      search: "",
      caseSensitive: false,
      overlay: false,
    }),
    computed: {
      filter () {
        return (item, search, textKey) => item[textKey].indexOf(search) > -1
      },
      lineName () {
        return this.$vuetify.breakpoint.height * .85
      }
    },
    created() {
      window.addEventListener("resize", this.myEventHandler);
      console.log(this.$vuetify.breakpoint)
    },
    destroyed() {
      window.removeEventListener("resize", this.myEventHandler);
    },
    methods: {
      myEventHandler(event) {
        if (event.type == 'resize') {
          document.body.dispatchEvent(new Event('chessground.resize'))
        }
      }
    }
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/styles.sass'
  
  @media #{map-get($display-breakpoints, 'sm-and-down')}
    .cg-board-wrap
      width: clamp(320px, min(85vw,85vh), 640px)
      height: clamp(320px, min(85vw,85vh), 640px)

  @media #{map-get($display-breakpoints, 'md-and-up')}
    .cg-board-wrap
      width: clamp(320px, min(85vw,85vh), 640px)
      height: clamp(320px, min(85vw,85vh), 640px)
  
</style>