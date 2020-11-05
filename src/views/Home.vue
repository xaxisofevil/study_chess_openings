<template>
    <v-main class="grey lighten-3">
      <v-container :fluid="$vuetify.breakpoint.mdAndDown">
        <v-row class="flex-wrap-reverse" :dense="$vuetify.breakpoint.smAndDown">
          <v-col sm="12" md="4" lg="4" xl="3">
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-row>
              <v-alert class="grow rounded-lg" align="center" justify="center" tile dark dense text border="left">
                Lines Selected: {{ sublineCount }}
              </v-alert>
              </v-row>
              <v-text-field v-model="search" label="Opening Selector (Click to Search)" dark flat solo-inverted hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
            </v-sheet>
            <v-sheet id = "treeSection" class="overflow-y-auto rounded-b-lg" min-height="268" elevation="14">
              <v-treeview dense selectable open-on-click transition :items="items" :search="search" :filter="filter" ref="tree" v-model="selectedLines" @input="updateSublineCount"></v-treeview>
            </v-sheet>
            <v-switch v-model="showFirstMove" label="Show First Move" color="blue"></v-switch>
          </v-col>
          
          <v-col sm="12" md="8" lg="7" xl="5">
            <!-- thing at the top that says the current line being quizzed -->
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <transition name="blinker" mode="out-in">
                <div :key="current_line">
                  <v-alert align="center" justify="center" dark dense border="left" text>
                      {{ current_line }}
                  </v-alert>
                </div>
              </transition>
            </v-sheet>
            <!-- actual board section -->
            <v-sheet id = "boardSection" align="center" justify="center" >
              <v-card>
                <v-sheet min-height="5"></v-sheet>
                <v-overlay absolute :value="overlay">
                  <v-alert align="center" justify="center" dark border="left" :dismissible="dismiss" v-model="overlay">
                    <v-row align="center">
                      <v-col class="grow">
                        <p class="text-justify" v-if="startmsg && $vuetify.breakpoint.mdAndUp">
                          Welcome to StudyChessOpenings.com! To get started, choose one or more opening categories from the left panel. You can also try out the<v-btn to="/explorer" small color="primary" text>Explorer</v-btn>board to find openings you like, then transfer back to this page to begin training. For more info, check out the<v-btn to="/about" small text color="primary">About</v-btn>page. Otherwise, have fun!
                        </p>
                        <p class="text-justify" v-else-if="startmsg && $vuetify.breakpoint.smAndDown">
                          Welcome to StudyChessOpenings.com! To get started, choose one or more opening categories from the left panel. You can also try out the<v-btn to="/explorer" small color="primary" text>Explorer</v-btn>board to find openings you like, then transfer back to this page to begin training. For more info, check out the<v-btn to="/about" small text color="primary">About</v-btn>page. Otherwise, have fun!
                        </p>
                        <div class="text-justify" v-else>
                          <p>{{ overlay_message }}</p>
                          <p>{{ overlay_message2}}</p>
                        </div>
                      </v-col>
                      <v-col class="shrink">
                        <div v-if="nothingselectedornewgame">
                          <v-btn text outlined color="success" @click="closeModal">
                            Go!
                          </v-btn>
                        </div>
                        <div v-else>
                          <v-btn text  color="success" @click="closeModal('retry')">Replay Line</v-btn>
                          <v-btn text  color="success" @click="closeModal('new')">New Line</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-overlay>
                <coacheric ref="aiextension" :orientation="orient" :showFirstMove="showFirstMove"/> <!--------------------------------------------------------------- -->
              </v-card>
            </v-sheet>

            <!-- bottom action button section -->
            <v-sheet class="rounded-b-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-row align="center" justify="space-around">
                <v-col class="shrink">
                <v-bottom-navigation background-color="transparent" dark>
                  <v-btn @click="resetboard('new')" v-show="!overlay"><span>New Line</span><v-icon>mdi-checkbox-marked-circle-outline</v-icon></v-btn>
                  <v-divider vertical v-show="!overlay"></v-divider>
                  <v-btn @click="resetboard('reset')" v-show="!overlay"><span>Reset Line</span><v-icon>mdi-undo-variant</v-icon></v-btn>
                  <v-divider vertical v-show="!overlay"></v-divider>
                  <v-btn @click="flipboard"><span>Flip Board</span><v-icon>mdi-autorenew</v-icon></v-btn>
                  <v-divider vertical v-show="!overlay"></v-divider>
                  <v-btn @click="hintShower"  v-show="!overlay"><span>Hint</span><v-icon>mdi-lightbulb-on-outline</v-icon></v-btn>
                </v-bottom-navigation>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col xl="2" lg="2" v-show="$vuetify.breakpoint.mdAndUp"></v-col>

        </v-row>
      </v-container>
    </v-main>
</template>

<script>
import coacheric from '../components/erichess.vue'
import eventBus from '../eventBus'
import 'vue-chessboard/dist/vue-chessboard.css'
import 'vuetify/dist/vuetify.min.css'
import '@/plugins/reset-css.css'
import {tree_data} from '@/assets/data/treedata.js'
import {lineChooser, progressUpdater, sublineCounter} from '@/plugins/linehelper.js'

  export default {
    components: {
      coacheric
    },
    props: ['explorerResults'],
    data: () => ({
      orient: 'white',
      items: tree_data,
      search: "",
      sublineCount: 0,
      overlay: true,
      selectedLines: [],
      current_line: "---",
      lichessurl: '',
      nothingselectedornewgame: true,
      overlay_message: "",
      overlay_message2: "",
      lineObj: null,
      showFirstMove:true,
      showHint:false,
      delay_in_secs: 0,
      startmsg : true,
      dismiss: false,
      alert: true
    }),
    computed: {
      filter () {
        return (item, search, textKey) => item[textKey].indexOf(search) > -1
      },
    },
    created() {
      window.addEventListener("resize", this.myEventHandler)
      eventBus.$on('linecompletedbyuser', this.lineCompleted)
      eventBus.$on('delay', this.delayStr)
      //this.overlay_message = this.$vuetify.breakpoint.smAndDown ? "Scroll Down to Select An Opening" : 'Welcome to </p><p>StudyChessOpenings.com! To get started, choose one or more opening categories from the left panel. You can also try out the&nbsp;&nbsp;<button type="button" style="border: 2px solid #1976D2;border-radius: 2px;padding: 2px 2px;">Explorer</button>&nbsp;&nbsp;board to find openings you like, then transfer back to this page to begin training. For more info, check out the<v-btn to="/about" small text color="primary">About</v-btn>page. Otherwise, have fun!'
    },
    mounted() {
      this.startmsg = true
      if (this.explorerResults){
        if (this.explorerResults.count > 0) {
            this.selectedLines = this.explorerResults.gid
            this.closeModal('new')
          }
      }
    },
    destroyed() {
      window.removeEventListener("resize", this.myEventHandler);
    },
    methods: {
      myEventHandler(event) {
        if (event.type == 'resize') {
          document.body.dispatchEvent(new Event('chessground.resize'))
        }
      },
      resetboard(x) {
        if (x == "new") {
        lineChooser(this.selectedLines, this.lineObj ? this.lineObj.oid : -1)
          .then((flashcard) => {
            this.lineObj = flashcard
            this.current_line = flashcard.fullname
            this.current_line_name = flashcard.fullname
            this.$refs.aiextension.line = flashcard.main_line
            this.$refs.aiextension.current_line_name = flashcard.fullname
          })}
        this.$refs.aiextension.resetgame()
      },
      flipboard(){
        this.orient = this.orient == 'white' ? 'black' : 'white'
        this.$refs.aiextension.wrong_counter = 0
        this.$refs.aiextension.total_wrong_counter = 0
        setTimeout(() => { this.$refs.aiextension.ericAI(); }, 250);
      },
      showModal() {
        this.overlay = true;
      },
      delayStr(d) {
        this.delay_in_secs = d
      },
      closeModal(action) {
        this.startmsg = false
        if (this.selectedLines.length == 0) {
          this.dismiss = false
          this.nothingselectedornewgame = true
          const leftmenu = this.$vuetify.breakpoint.smAndDown ? "below" : "on the left"
          this.overlay_message = `Please pick at least one opening category from the menu ${leftmenu}`
        } else {
          this.dismiss = true
          this.overlay = false;
          this.current_line = this.current_line_name
          if (action == 'retry') {
            this.resetboard('old')
          } else {
            this.resetboard('new')
          }
        }
      },
      hideModal() {
        this.overlay = false
      },
      lineCompleted(info) {
        progressUpdater(this.lineObj, info.twc)
        this.nothingselectedornewgame = false
        this.overlay_message = `Line Completed With ${info.twc} Wrong Moves.`
        this.overlay_message2 = `This line will not be shown again for at least ${this.delay_in_secs} seconds`
        //line will be shown again soon
        this.lichessurl  = "https://www.lichess.org/analysis/" + info.fen.replace(/ /g,"_")
        this.showModal()
      },
      updateSublineCount(selectionList) {
        this.sublineCount = sublineCounter(selectionList)
      },
      hintShower(){
        setTimeout(() => { this.$refs.aiextension.showHint(); }, 50);
      }
    }
  }
</script>

<style>

.blinker-enter-active {
  animation: newlineblinker 1.5s;
}

@keyframes newlineblinker {
  0% {
    box-shadow: 0 0 6px 10px #8e04b8;
  }
  100% {
    box-shadow: none;
  }
}
</style>

<style lang="sass">
  @import '~vuetify/src/styles/styles.sass'
  $large-square: min(85vw,65vh)
  $small-square: min(85vw,65vh)
  
  @media #{map-get($display-breakpoints, 'sm-and-down')}

    .cg-board-wrap
      width: clamp(320px, $small-square, 640px)
      height: clamp(320px, $small-square, 640px)
    .v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle
      font-size: 1rem !important
    .opening-title
      font-size: .6rem !important

  @media #{map-get($display-breakpoints, 'md-and-up')}
    .cg-board-wrap
      width: clamp(320px, $large-square, 640px)
      height: clamp(320px, $large-square, 640px)
    .v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle
      font-size: 1.5rem !important
    .opening-title
      font-size: 1rem !important
</style>