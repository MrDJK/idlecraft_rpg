<template>
    <div v-if="store.user && store.user.character.UserLevel" class="d-flex flex-row">
        <div class="me-auto profile-bit d-flex align-items-center">
            <img :src="getMCHead" alt="Avatar" class="avatar ">
            <div class="profile-info">
                <div class="username">{{ user.character.username || user.username }}</div>
                <div class="premium">
                    <span v-if="isPremium">
                        Premium <span class="head text-muted d-none d-md-inline-block">{{ premiumTimeLeft }}</span>
                    </span>
                    <span v-else class="btn btn-success btn-sm py-0 px-3" @click="upgrade">Upgrade</span>
                </div>
            </div>
        </div>

        <v-tooltip placement="bottom" v-for="(skill, index) in getSkills" :key="index">
            <div class="d-flex flex-row mb-0">
                <router-link :to="{name: getSkillName(skill)}" :class="[skillIsActive(skill), 'skill-link']">

                    <div class="skill-container cursor-pointer">

                        <div class="skill-orb ms-2">

                            <div class="text">
                                {{ getSkillLevel(skill) }}
                            </div>
                            <div class="circle">
                                <div class="levelProgress" :style="{height: getPercentToNextLevel(skill) + '%'}"></div>
                            </div>
                        </div>
                        <mc-icon :icon="skill" :skill="skill"></mc-icon>

                    </div>
                </router-link>

            </div>

            <template #popper>
                <p>Current XP: {{ getCurrentXPFormatted(skill) }}</p>
                <p>Next Level: {{ getFormattedXPRequiredForNextLevel(skill) }}</p>
            </template>
        </v-tooltip>
    </div>
</template>
<style lang="scss">

.skill-container {
    display: flex;
    flex-direction: row;
    margin-right: 20px;
}

.profile-bit {
    margin-left: 10px;

    .avatar {
        height: 50px;
        width: 50px;
        margin-right: 15px;
    }
}

.skill-orb {
    position: relative;
    width: 50px;
    height: 50px;
    margin-right: 10px;

    .text {
        z-index: 10;
        background: rgba(0, 0, 0, 1);
        height: calc(100% - 10px);
        width: calc(100% - 10px);
        position: relative;
        border-radius: 100%;
        margin-left: 5px;
        margin-top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .circle {
        z-index: 5;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 100%;
        overflow: hidden;

        .levelProgress {
            width: 100%;
            background: green;
            position: absolute;
            z-index: 10;
            bottom: 0;
            left: 0;
            transition: all ease-in-out 0.3s;
        }
    }
}
</style>
<script>
import store from '../../store'
import {levelHelpers} from '../../utils/levelHelper'
import McIcon from "../McIcon";
import {startCase} from "lodash/string";

export default {
  name: 'Header',
  components: {McIcon},
  data() {
    return {
      test: true,
      store: store.state,
      skills: [],
    }
  },
  methods: {
    getSkillLevel(skill) {
      return this.store.user.character.UserLevel[skill + '_level'] || 0
    },
    getSkillXp(skill) {
      return this.store.user.character.UserLevel[skill + '_xp'] || 0
    },
    getXpForLevel(level) {
      return levelHelpers.xpTable[level];
    },
    getCurrentXPFormatted(skill) {
      return (new Intl.NumberFormat().format(this.getSkillXp(skill)))
    },
    getFormattedXPRequiredForNextLevel(skill) {
      const level = this.getRequiredXPForLevel(skill);

      if (!level)
        return 'Maxed'

      return new Intl.NumberFormat().format(level) || 'Maxed'
    },
    getRequiredXPForLevel(skill) {
      return this.getXpForLevel(this.getSkillLevel(skill));
    },
    getPercentToNextLevel(skill) {
      const requiredXp = this.getRequiredXPForLevel(skill)
      const currentBaseLevelXp = this.getXpForLevel(this.getSkillLevel(skill) - 1)

      const diff = requiredXp - currentBaseLevelXp

      const currentXp = this.getSkillXp(skill) - currentBaseLevelXp;

      return (100 * currentXp) / diff
    },

    skillIsActive(skill) {
      if (!this.store.user.character.current_skill || !skill)
        return;

      const activeSkill = this.store.user.character.current_skill;
      const skillFound = this.store.skills.find(s => s.id === activeSkill)

      if (!skillFound)
        return '';

      return skillFound.skill === skill ? 'active-skill' : ''
    },
    upgrade() {
      window.alert("Upgrade not yet available")
    },
    getSkillName(skillName) {
      return startCase(skillName)
    }
  },
  computed: {
    user() {
      return this.store.user || {};
    },
    getSkills() {
      return Object.keys(this.store.user.character.UserLevel).filter(i => i.includes('_xp')).map(i => i.replace("_xp", ''))
    },
    premiumTimeLeft() {
      const now = this.$root.$data.date;
      const expires = new Date(this.user.character.premium);
      let delta = Math.abs(expires - now) / 1000;

      if (expires - now < 0)
        return `Expired`;

      const days = Math.floor(delta / 86400);
      delta -= days * 86400;

      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      const minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      if (days > 0)
        return `${days} day${days > 1 ? 's' : ''} left`
      else if (hours > 0)
        return `${hours} hour${hours > 1 ? 's' : ''} left`
      else if (minutes > 0)
        return `${minutes} minute${minutes > 1 ? 's' : ''} left`
      else
        return `Expires soon`
    },
    isPremium() {
      return new Date(this.user.character.premium) - this.$root.$data.date > 0;
    },
    getMCHead() {
      const head = this.user.character.mc_head || "MHF_Steve";
      const match = head.match(/([a-zA-Z0-9_]{1,16})/g);

      if (match.length === 1)
        return `https://www.mc-heads.net/head/${match[0]}/50`
      else
        return `https://www.mc-heads.net/head/MHF_Steve/50`
    },

  }

}
</script>
