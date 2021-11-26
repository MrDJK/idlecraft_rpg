<template>
    <div>
        <div class="page-header mb-4 p-4">
            <h1 class="d-flex align-items-center">
                <mc-icon icon="furnace" class="d-inline-block me-2"></mc-icon>
                Smithing
            </h1>
            <p>*Clank* *Smash* *Clank* *Smash* smith your ores into ingots</p>
            <GameTip />
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-4" v-for="(skill, index) in skills" :key="index">
                    <Skillbox :skill="skill"/>
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
  name: 'About',
  components: {GameTip, McIcon, Skillbox},
  data() {
    return {
      store: store.state,
    }
  },
  computed: {
    skills() {
      return this.store.skills && this.store.skills.filter(i => i.skill === 'smithing')
    },
  }
}
</script>
