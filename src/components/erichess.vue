<script>
import 'vue-chessboard/dist/vue-chessboard.css'
import { chessboard }  from 'vue-chessboard'
import Chess from 'chess.js'
import eventBus from '../eventBus'
import axios from 'axios'
import {Howl} from 'howler';


const move_sound = new Howl({src: ['sounds/move.ogg']})
const capture_sound = new Howl({src: ['sounds/capture.mp3']})
const startend_sound = new Howl({src: ['sounds/endofgame.ogg']})

export default {
  name: 'coacheric',
  extends: chessboard,
  props: ['showFirstMove'],
  data () {
    return {
      wrong_counter: 0,
      total_wrong_counter: 0,
      wrong_flag: 0,
      selectionList : [],
      lineList: '',
      loading: false,
      wholeResponse: {},
      current_fen: '',
      line: ''
    }
  },
  methods: {
    getline() {
      axios
      .get('https://www.studychessopenings.com/api.php/records/openings?filter=opening_id,eq,1')
      .then(response => {
        this.wholeResponse = response.data
        this.loading = false
        return this.wholeResponse
      })
      .catch(error => {
        console.log(error)
      })
    },
    resetgame() {
      startend_sound.play()
      this.game.reset()
      this.wrong_flag = false
      this.wrong_counter = 0
      this.total_wrong_counter = 0
      this.board.set({
        fen: this.game.fen(),
        highlight: {
          check: true,
          lastMove: false
        },
        movable: {
          events: { 
            after: this.userPlay()
            },
          free: false
          },
        viewOnly: false,
        resizable: true
      })
      setTimeout(() => { this.ericAI(); }, 250);
    },
    flipboard() {
      let neworient = ""
      if (this.orientation == "white") {
        neworient = "black"
      } else {
        neworient = "white"
      }
      this.orientation = neworient
      this.wrong_counter = 0
      this.total_wrong_counter = 0
      setTimeout(() => { this.ericAI(); }, 250);
    },
    showHint() {
      const line = this.line
      const egame = new Chess()
      egame.load_pgn(line)
      const test_line_verbose = egame.history({verbose:true})
      let actual_hist = this.game.history()
      let curhmn = actual_hist.length
      let arrows = []
      let next_move = test_line_verbose[curhmn]
      arrows.push(
          {orig: next_move.from, brush: 'blue'}
        )
      this.board.setShapes(arrows);
    },
    userPlay() {
      return (orig, dest) => {
        this.game.move({from: orig, to: dest, promotion: 'q'}) // promote to queen for simplicity
        
        const lastmove = this.game.history().slice(-1)[0]

        if (lastmove.indexOf("x") > -1){
          capture_sound.play()
        } else if (lastmove.indexOf("+") > -1) {
          capture_sound.play()
        } else if (lastmove.indexOf("+") > -1) {
          capture_sound.play()
        } else {
          move_sound.play()
        }
        this.board.set({
          fen: this.game.fen(),
          highlight: {
          check: true
          },
        })
        setTimeout(() => { this.ericAI(); }, 250);
      };
    },
    ericAI() {
      //const line = "1.c4 e6 2.Nf3 d5 3.g3 Nf6 4.Bg2 c6 5.b3 *"
      const line = this.line
      const egame = new Chess()
      egame.load_pgn(line)
      const test_line = egame.history()
      const test_line_verbose = egame.history({verbose:true})
      let actual_hist = this.game.history()
      let curhmn = actual_hist.length
      let arrows = []
      
      if (test_line.length > 0 && this.showFirstMove && curhmn == 0) {
        let indx = this.orientation == 'white' ? 0 : 1
        arrows.push(
          {orig: test_line_verbose[indx].from, dest: test_line_verbose[indx].to, brush: 'blue'}
        )
      }

      let completion_flag = egame.fen() == this.game.fen() && line != ''
      if (!completion_flag) {
      if (this.orientation == "black" && curhmn == 0) {
        let aimove = test_line[curhmn]
        this.game.move(aimove)
      } else if (curhmn > 0) {
        //check if last move was right
        let correct_move = test_line[curhmn - 1]
        if (correct_move == actual_hist[actual_hist.length-1]) {
          // they made the right move, so AI should make the next one
          let aimove = test_line[curhmn]
          this.game.move(aimove)

          if (aimove.indexOf("x") > -1){
            capture_sound.play()
          } else if (aimove.indexOf("+") > -1) {
            capture_sound.play()
          } else if (aimove.indexOf("#") > -1) {
            capture_sound.play()
          } else {
            move_sound.play()
          }
          
          this.wrong_counter = 0
          if (egame.fen() == this.game.fen()) {
            startend_sound.play()
            this.board.set({
              highlight: {
                check: true
              },
              movable: {
                events: { 
                  after: null
                  },
                free: false
                },
              })
            setTimeout(() => { eventBus.$emit('linecompletedbyuser', {twc:this.total_wrong_counter,fen:this.game.fen()}) }, 550);
          }
        } else {
          // they made the wrong move
          this.game.undo()
          this.wrong_flag = true
          this.wrong_counter = this.wrong_counter + 1
          this.total_wrong_counter = this.total_wrong_counter + 1
          if (this.wrong_counter > 1 && this.wrong_counter < 3) {
              let vaimove = test_line_verbose[curhmn - 1]
              arrows.push({orig: vaimove.from, brush: 'green'})
          } else if (this.wrong_counter >= 3) {
              let vaimove = test_line_verbose[curhmn - 1]
              arrows.push({orig: vaimove.from, brush: 'green'})
              arrows.push({orig: vaimove.from, dest: vaimove.to, brush: 'green'})
          }
        }
      }
      
      this.board.set({
        fen: this.game.fen(),
        turnColor: this.toColor(),
        highlight: {
          check: true
        },
        movable: {
          color: this.toColor(),
          dests: this.possibleMoves(),
          events: { after: this.userPlay()},
          free: false
        },
        drawable: {
            visible: true,
            enabled: true,
            eraseOnClick: true
        }
      })
      this.board.setShapes(arrows);

      } else {
        this.board.set({
        highlight: {
          check: true
        },
        movable: {
          events: { 
            after: null
            },
          free: false
          },

        })
        startend_sound.play()
        eventBus.$emit('linecompletedbyuser', {twc:this.total_wrong_counter,fen:this.game.fen()})
      }
    },
    addline(linename) {
      this.selectionList.push(linename)
    },
    subline(linename) {
      this.selectionList = this.selectionList.filter(item => item !== linename)
    }
  },
  created () {
    eventBus.$on('addselection', this.addline)
    eventBus.$on('subselection', this.subline)
    setTimeout(() => { this.ericAI(); }, 1000);
  },
  mounted() {
    this.board.set({
      highlight: { check: true },
      movable: { events: { after: this.userPlay()}, free:false},
    })
  }
}
</script>
