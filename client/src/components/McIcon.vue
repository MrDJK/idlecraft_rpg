<template>
    <div class="mc-icon" :class="[getImageClass, getIconSizeClass, isCustomIcon]">
    </div>
</template>
<script>
import store from '../store'

export default {
  name: 'McIcon',
  data() {
    return {
      store: store.state
    }
  },
  props: {
    icon: {
      type: String,
      required: false
    },
    size: {
      type: Number,
      default: 36
    },
    skill: {
      type: String,
      required: false,
    },
    custom: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {

    getSkillClass(skill) {

      let tool = null,
        current_level = this.store.user.character.UserLevel[`${skill}_level`],
        level = null;

      switch (skill) {
        case 'mining':
          tool = 'pickaxe';
          break;
        case 'woodcutting':
          tool = 'axe';
          break;
        case 'fishing':
          return 'icon-fishing-rod'
        case 'crafting':
          return 'icon-crafting-table'
        case 'smithing':
          return 'icon-furnace'
        case 'cooking':
          return 'icon-smoker'
        case 'adventuring':
          tool = 'boots';
          break;
        case 'combat':
          tool = 'sword';
          break;
      }

      if (current_level < 10)
        level = tool === 'boots' ? 'leather' : 'wooden';
      else if (current_level < 20)
        level = tool === 'boots' ? 'iron' : 'stone';
      else if (current_level < 40)
        level = 'iron'
      else if (current_level < 80)
        level = 'golden';
      else
        level = 'diamond'

      return `icon-${level}-${tool}`;
    },
  },
  computed: {
    getImageClass() {
      if (this.skill)
        return this.getSkillClass(this.skill)

      return `icon-${this.icon}`
    },
    getIconSizeClass() {
      return `icon-size-${this.size}`
    },
    isCustomIcon(){
      return this.custom === true ? 'custom-icon' : '';
    }
  }
}
</script>
