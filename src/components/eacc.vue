<template>
    <dl class="accordion box" role="presentation">
      <accordionitem
        v-for="item in content"
        :multiple="multiple"
        :item="item"
        :groupId="groupId"
        :key="item.id">
      </accordionitem>
    </dl>
</template>

<script>
import accordionitem from './eacc_item.vue'

export default {
    name: 'accordion',
    components: {
        accordionitem
    },
    props: {
    content: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupId: null
    }
  },
  mounted() {
    this.groupId = this.$el.id
  }
}
</script>

<style lang="scss">

$browser-context: 16;
$blue: #1779ba;
$gray: #cacaca;
$red: #cc4b37;
$white: #ffffff;

@function em($pixels, $context: $browser-context) {
  @return #{$pixels/$context}em;
}

#accordionapp  {
    width: 150%;
    font-family:
                  "Open Sans",
                  "Segoe UI Symbol",
                  "Apple Color Emoji",
                  "Segoe UI Emoji",
                  "Source Sans Pro",
                  "Helvetica Neue",
                  Helvetica,
                  Arial,
                  sans-serif;
}

.container {
  margin-bottom: em(24);
}

.btn-action-delete {
  color: $red;
  cursor: pointer;
}

.accordion {
  padding: 0;
  
  div:not(:last-child) {
    border-bottom: 1px solid rgba(10, 10, 10, 0.1);
  }
  
  div:last-child .accordion-item-details {
    border-radius: 5px;
  }
  
  dd {
    margin-left: 0;
  }
}

.accordion-item-trigger,
.accordion-item-details-inner {
  padding: 0.75rem 1.25rem;
  color: rgb(199, 199, 199);
  font-size: 12pt;
  text-shadow: 1px 1px 1px black;
}

.accordion-item-title {
  position: relative;
  //background-color: #3893e8;
  background-image: linear-gradient(to top left, rgba(56, 147, 232, .2) , transparent, transparent);
  border: 1px solid rgba(255, 255, 255, 0.452);
  h4 {
    font-size: 1.25rem;
    margin-bottom: 0;
    padding-right: 1.25rem;
  }
}

.accordion-item-trigger {
  width: 100%;
  text-align: left;
  background-color: transparent;
  border: none;
}

.accordion-item-trigger-icon {
  $size: 8px;
  display: block;
  position: absolute;
  top: 0; right: 1.25rem; bottom: 0;
  margin: auto;
  width: $size;
  height: $size;
  border-right: 2px solid rgb(224, 224, 224);
  border-bottom: 2px solid rgb(224, 224, 224);
  transform: translateY(-$size / 4) rotate(45deg);
  transition: transform 0.2s ease;
  background-color: transparent;

  .is-active & {
    transform: translateY($size / 4) rotate(225deg);
  }
}

.accordion-item-details {
  overflow: hidden;
  background-color: rgba(10, 10, 10, 0.1);
}

.accordion-item-enter-active, .accordion-item-leave-active {
  will-change: height;
  transition: height 0.2s ease;
}
.accordion-item-enter, .accordion-item-leave-to {
  height: 0 !important;
}
.accordion-item-title-text {
  font-family:
                  "Open Sans",
                  "Segoe UI Symbol",
                  "Apple Color Emoji",
                  "Segoe UI Emoji",
                  "Source Sans Pro",
                  "Helvetica Neue",
                  Helvetica,
                  Arial,
                  sans-serif;
    color: rgb(224, 224, 224);
    font-size: 14pt;
    font-weight: bold;
    text-shadow: 0px 1px 3px black;
}
</style>