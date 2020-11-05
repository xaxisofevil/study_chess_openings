<template>
    <v-main class="grey lighten-3">
      <v-container :fluid="$vuetify.breakpoint.mdAndDown">
        <v-row class="flex-wrap-reverse" :dense="$vuetify.breakpoint.smAndDown">
          <v-col sm="12" md="4" lg="4" xl="3">
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14" dark>
              <h4 dark>Current board is found in:</h4>
            </v-sheet>
            <v-sheet id = "treeSection" class="overflow-y-auto rounded-b-lg" min-height="268" elevation="14">
              <div  v-if="this.matchCount > 0"> <ul>
                <li v-for="item in listitems" :key="item">
                  {{ item }}
                </li>
              </ul></div>
              <div v-else-if="hmc == 0">
                <p class="text--disabled font-italic ma-4 pa-1">Make moves on the board to see which openings they come from</p>
              </div>
              <div v-else>
                <p class=" font-italic ma-4 pa-1">No saved openings contain this position!</p>
              </div>
            </v-sheet>
          </v-col>
          
          <v-col sm="12" md="8" lg="7" xl="5">
            <!-- thing at the top that says the current line being quizzed -->
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14">
            </v-sheet>
            <!-- actual board section -->
            <v-sheet id = "boardSection" align="center" justify="center" >
              <v-card>
                <v-sheet min-height="5"></v-sheet>
                <chessboard ref="explorerextension" @onMove="transposePopulator" :fen="f" :orientation="orient"/> <!--------------------------------------------------------------- -->
              </v-card>
            </v-sheet>

            <!-- bottom action button section -->
            <v-sheet class="rounded-b-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-row align="center" justify="space-around">
                <v-bottom-navigation background-color="transparent" dark grow>
                  <v-btn @click="setboard('undo')"><span>Undo Move</span><v-icon>mdi-arrow-left-thick</v-icon></v-btn>
                  <v-btn @click="setboard('reset')"><span>Reset Board</span><v-icon>mdi-undo-variant</v-icon></v-btn>
                  <v-btn @click="flipboard"><span>Flip Board</span><v-icon>mdi-autorenew</v-icon></v-btn>
                  <v-divider class="mx-4" vertical></v-divider>
                  <v-divider class="mx-4" vertical></v-divider>
                  <v-btn @click="transferToMain"><span>Transfer to Main</span><v-icon>mdi-checkbox-marked-circle-outline</v-icon> </v-btn>
                </v-bottom-navigation>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col xl="2" lg="2" v-show="$vuetify.breakpoint.mdAndUp"></v-col>

        </v-row>
      </v-container>
    </v-main>
</template>

<script>
import { chessboard }  from 'vue-chessboard'
import Chess from 'chess.js'
import 'vue-chessboard/dist/vue-chessboard.css'
import 'vuetify/dist/vuetify.min.css'
import '@/plugins/reset-css.css'
import {transposeCounter} from '@/plugins/linehelper.js'
import ag from '@/assets/data/allgid.js'

  export default {
    components: {
      chessboard
    },
    data: () => ({
      orient: 'white',
      listitems: [],
      gidlist:  [],
      f: '',
      hist: null,
      future: [],
      hmc: 0,
      matchCount: 0
    }),
    created() {
      window.addEventListener("resize", this.myEventHandler)
      window.addEventListener("wheel", this.myEventHandler)
    },
    destroyed() {
      window.removeEventListener("resize", this.myEventHandler)
      window.removeEventListener("wheel", this.myEventHandler)
    },
    methods: {
      myEventHandler(event) {
        if (event.type == 'resize') {
          document.body.dispatchEvent(new Event('chessground.resize'))
        }
        
        if (event.type == 'wheel' && event.deltaY < 0) {
          this.setboard("undo")
          // take back move
        }
      },
      flipboard(){
        this.orient = this.orient == 'white' ? 'black' : 'white'
      },
      setboard(action="undo"){
        let tmp = new Chess()
        if (action == "undo") {
          let moves = this.$refs.explorerextension.game.history()
          let previous = moves.length-this.future.length-1
          for(var i=0;i<previous;i++) {
            tmp.move(moves[i])
          }
        }
        let previous_fen = tmp.fen()
        this.$refs.explorerextension.game = tmp
        let turn = this.$refs.explorerextension.game.turn() == 'w' ? 'white' : 'black'
        this.$refs.explorerextension.board.set({fen: previous_fen,highlight: {lastMove: false}, turnColor:turn, movable:{free:true,color:turn}})
        this.transposePopulator()
      },
      undoMove() {
        let moves = this.$refs.explorerextension.game.history()
        let tmp = new Chess()
        let previous = moves.length-this.future.length-1
        for(var i=0;i<previous;i++) {
          tmp.move(moves[i])
        }
        let previous_fen = tmp.fen()
        this.$refs.explorerextension.game = tmp
        let turn = this.$refs.explorerextension.game.turn() == 'w' ? 'white' : 'black'
        this.$refs.explorerextension.board.set({fen: previous_fen,highlight: {lastMove: false}, turnColor:turn, movable:{free:true,color:turn}})
      },
      transposePopulator() {
        let f = this.$refs.explorerextension.game.fen().split(" ")[0]
        this.hmc = this.$refs.explorerextension.game.history().length
        transposeCounter(f)
          .then((flashcard) => {
            this.gidlist = flashcard
            this.listitems = flashcard.map(x => ag.giddict[x])
            let len = 0
            for (var i = 0; i < this.listitems.length; i++) {
              if (this.listitems[i] !== undefined) {
                len++;
              }
            }
            this.matchCount = len
            //console.log(this.matchCount,this.listitems)
          })
      },
      transferToMain(){
        this.$router.replace({name:'Home', params:{ "explorerResults": {"gid":this.gidlist,"count":this.matchCount} }});
      }
    }
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/styles.sass'
  $large-square: min(85vw,85vh)
  $small-square: min(85vw,85vh)
  
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