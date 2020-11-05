<script>
import MButton from 'vue-m-button'
  export default {
    name: 'modal',
    components: {
        MButton
    },
    props: {
        bodymsg: String,
    },
    computed: {
        initial : function() {
            return (this.bodymsg == 'Pick An Opening And Start Training') || (this.bodymsg == 'You must pick an opening first!')
        },
        eol : function() {
            return (this.bodymsg != 'Pick An Opening And Start Training') && (this.bodymsg != 'You must pick an opening first!')
        }
    },
    methods: {
      trainnewline() {
          this.$emit('close', 'new');
      },
      retryline() {
          this.$emit('close', 'retry');
      },
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <section class="modal-body" id="modalDescription">
          <slot name="body">
            {{ bodymsg }}
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <div class="eolbuttons" v-show="eol">
                <m-button type="default" @click="trainnewline" aria-label="Close modal">
                New Line
                </m-button>
                <m-button plain type="default" @click="retryline" aria-label="Close modal">
                Retry Line
                </m-button>
            </div>
            <div class="initbuttons" v-show="initial">
                <m-button type="default" @click="trainnewline" aria-label="Close modal">
                Begin Training
                </m-button>
            </div>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<style>
  .modal-backdrop {
    background-color:transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: #FFFFFF;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-width: 2px; /* top right bottom left */
    border-style: solid;
    border-color: rgb(143, 143, 143);
  }
  .modal-body,
  .modal-footer {
    display: flex;
    font-family: "Oswald ","Raleway",
                "Open Sans",
                "Segoe UI Symbol",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Source Sans Pro",
                "Helvetica Neue",
                Helvetica,
                Arial,
                sans-serif
                ;
    width: 250px;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    color:hotpink;
    height: 45px;
    display: flex; 
    justify-content: space-around;
    width: 100%;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
    color:black;
    height:150px;
    text-align: center;
    display: flex; 
    flex-direction: column;
    align-items: center;
  }

  .btn-green {
    color: black;
    background: transparent;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
    height: 30px;
  }
</style>