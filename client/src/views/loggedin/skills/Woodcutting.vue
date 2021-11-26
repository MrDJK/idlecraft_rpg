<template>
    <div>
        <div class="page-header mb-4 p-4">
            <h1 class="d-flex align-items-center">
                <mc-icon :skill="'woodcutting'" class="d-inline-block me-2"></mc-icon>
                Woodcutting
            </h1>
            <p>Take a walk into the forest and cut down some of the local trees to use as firewood or craft your imagination</p>
            <GameTip />
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-4 col-xxxl-3" v-for="(skill, index) in skills" :key="index">
                    <Skillbox :skill="skill" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Skillbox from "../../../components/SkillBox";
import store from '../../../store'
import McIcon from "../../../components/McIcon";
import GameTip from "../../../components/GameTip";

export default {
  name: 'Woodcutting',
  components: {GameTip, McIcon, Skillbox},
  data() {
    return {
      store: store.state,
    }
  },
  computed: {
    skills() {
      return this.store.skills && this.store.skills.filter(i => i.skill === 'woodcutting')
    },
  }
}
</script>
