<template>
    <div id="sidebar-left">
        <ul class="list-unstyled d-flex flex-column flex-grow-1 h-100 mb-0">

            <li>
                <router-link :to="{name: 'Home'}" class="skill-link">
                    <mc-icon icon="a-very-fine-item" :size="32" />
                    <!--                        <span class="skill-name">Logout</span>-->
                </router-link>
            </li>
            <li
                    v-for="(skill, index) in getSkills"
                    :key="index"
            >
                <router-link :to="{name: skillName(skill)}" :class="[skillIsActive(skill), 'skill-link']">
                    <mc-icon :skill="skill" :size="32"></mc-icon>
<!--                        <span class="skill-name">{{ skillName(skill) }}</span>-->
                </router-link>
            </li>

            <li class="mt-auto">
                <router-link :to="'#'" @click="logout">
                    <mc-icon icon="ender-pearl" :size="32" />
<!--                        <span class="skill-name">Logout</span>-->
                </router-link>
            </li>
        </ul>
    </div>
</template>
<style lang="scss">
#grid-left-nav {
    z-index: 9;

    > div {
        width: 60px;
        height: 100%;
        overflow: hidden;
        background: rgba(0,0,0,1) !important;
    }

    ul {
        li {
            > a {
                display: flex;
                align-items: center;
                padding: 10px 10px;
            }
        }
    }
}
</style>
<script>
import McIcon from "../McIcon";
import store from '../../store'
import {startCase} from "lodash/string";

export default {
  name: 'Sidebar',
  components: {McIcon},
  data() {
    return {
      store: store.state
    }
  },
  methods: {
    skillName(skill) {
      return startCase(skill)
    },
    logout() {
      if(confirm("Are you sure you want to logout?") === true) {
        localStorage.removeItem(process.env.VUE_APP_JWT_NAME)
        window.location.reload();
      }
    },
    skillIsActive(skill) {
      if (!this.store.user.character.current_skill || !skill)
        return;

      const activeSkill = this.store.user.character.current_skill;
      const skillFound = this.store.skills.find(s => s.id === activeSkill)

      if(!skillFound)
        return ''

      return skillFound.skill === skill ? 'active-skill' : ''
    },
    activeRoute(route) {
      return this.$route.name === route
    }
  },
  computed: {
    getSkills() {
      console.log('ded')
      return Object.keys(this.store.user.character.UserLevel).filter(i => i.includes('_xp')).map(i => i.replace("_xp", ''))
    },
  }
}
</script>
