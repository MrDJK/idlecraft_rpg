<template>
    <div class="progress-outer-bar">
        <div class="progress-bar border-0 bg-dark-progress-grad"
             :style="{
                      'animation-duration': timer / 1000 + 's',
                    }"
             ref="pb">
        </div>
    </div>
</template>
<style scoped lang="scss">

.progress-outer-bar {
    background: rgba(0, 0, 0, 0.1);
    height: 24px;
    z-index: 10;
}

.progress-bar {
    width: 0;
    height: 100%;
    //background-color: red;
    border: 2px solid black;

    &.animate {
        animation-name: animateProgressBar;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
        animation-timing-function: linear;
    }

}


@keyframes animateProgressBar {
    0% {
        width: 0;
    }

    100% {
        width: 100%;
    }
}
</style>
<script>
import store from '../store'

export default {
  name: 'SocketProgressBar',
  data() {
    return {
      timer: null,
      store: store.state,
    }
  },
  props: {
    skill: {
      type: Object
    }
  },
  sockets: {

    'stop skill': function () {
      this.started = false;
      this.$refs.pb.classList.remove('animate');
      void this.$refs.pb.offsetWidth;
    },
    'start skill': function (skill) {
      if (skill.id === this.skill.id) {
        this.timer = skill.timer;

        this.$refs.pb.classList.remove('animate');
        void this.$refs.pb.offsetWidth;
        this.$refs.pb.classList.add('animate');
      }
    },
    'start combat timer': function (skill) {
      if (skill.id === this.skill.id) {
        this.timer = skill.timer;

        this.$refs.pb.classList.remove('animate');
        void this.$refs.pb.offsetWidth;
        this.$refs.pb.classList.add('animate');
      }
    },
  }

}
</script>
