<template>
    <div class="h-100 d-flex flex-column">
        <div class="page-header p-4">
            <h1 class="d-flex align-items-center">
                <mc-icon :skill="'adventuring'" class="d-inline-block me-2"></mc-icon>
                Adventuring
            </h1>
            <p>Explore the world of Minecraft by taking a wander into the wilderness. Find temples deep in the
                jungle, discover hidden templates</p>
            <GameTip />
        </div>
        <div id="adventuring-locations" :class="{'has-active': currentSkill && currentSkill.skill === 'adventuring'}" class="flex-grow-1">
            <AdventureLocation v-for="(skill, i) in skills" :key="i" :skill="skill"/>
        </div>
    </div>
</template>
<script>
import store from '../../../store'
import McIcon from "../../../components/McIcon";
import AdventureLocation from "../../../components/AdventureLocation";
import GameTip from "../../../components/GameTip";

export default {
  name: 'Woodcutting',
  components: {GameTip, AdventureLocation, McIcon},
  data() {
    return {
      store: store.state,
    }
  },
  computed: {
    skills() {
      return this.store.skills && this.store.skills.filter(i => i.skill === 'adventuring')
    },
    currentSkillId() {
      return this.store.user.character.current_skill;
    },
    currentSkill() {
      return this.store.skills.find(s => s.id === this.currentSkillId);
    }
  },
}
</script>
