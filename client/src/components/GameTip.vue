<template>
    <p class="alert bg-dark-blue-grad d-flex" :class="{'flex-column': homepage, 'align-items-center': !homepage}" v-if="store.layout.gameTips || force">
        <mc-icon icon="question" class="me-3" v-if="!hideIcon"/>
        Tip: <span v-html="getTip" :class="{'ms-1': !homepage}"></span>

        <span class="ms-auto cursor-pointer" @click="dismiss" v-if="!force">Dismiss</span>
    </p>
</template>
<script>
import McIcon from "./McIcon";
import {random} from "lodash/number";
import store from '../store'

export default {
  name: 'GameTip',
  components: {McIcon},
  props: {
    force: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
    homepage: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      store: store.state,
      tips: [
        'You can find new areas by going adventuring',
        'Some skills have hidden locations like the <strong>Magical Forest</strong>, go adventuring to find them',
        'Level up your skill to unlock new areas',
        'One mans junk is another mans treasure',
        `When you start adventuring, you will randomly come across things, be patient if something doesn't appear right away`,
      ],
    }
  },
  mounted() {
    console.log(this.store.layout.gameTips, typeof this.store.layout.gameTips)
  },
  methods: {
    dismiss() {
      if (window.confirm("Would you like to disable these tips forever?")) {
        localStorage.setItem('gametips', JSON.stringify(false));
        this.store.layout.gameTips = false;
      }
    }
  },
  computed: {
    getTip() {
      return this.tips[random(0, this.tips.length - 1)]
    }
  }
}
</script>
