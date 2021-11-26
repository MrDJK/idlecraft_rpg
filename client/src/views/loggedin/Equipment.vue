<template>
    <div class="d-flex justify-content-center align-items-center flex-column h-100">
        <div id="equipment-screen" class="mt-md-5 mb-0 mb-md-5">
            <div id="equipment-header" class="header bg-dark-blue-grad py-2 px-3 d-flex flex-row align-items-center">
                <img :src="getMCHead" class="me-3" :alt="getMinecraftName + ' avatar'" />
                <h5 class="mb-0 d-flex align-items-center w-100">
                    {{ characterName }}

                    <span class="text-muted badge bg-secondary text-white-50 ms-auto" v-if="title">
                        {{ title }}
                    </span>
                </h5>
            </div>
            <div id="equipment-left-panel" class="flex-row flex-md-column justify-content-between">
                <EquipmentSlot type="helmet"/>
                <EquipmentSlot type="chestplate"/>
                <EquipmentSlot type="leggings"/>
                <EquipmentSlot type="boots"/>
            </div>
            <div id="equipment-preview">
                <PlayerRender />
            </div>
            <div id="equipment-right-panel" class="flex-row flex-md-column">
                <EquipmentSlot type="weapon"/>
            </div>
            <div id="equipment-tools" class="flex-row">
                <EquipmentSlot type="pickaxe"/>
                <EquipmentSlot type="axe"/>
                <EquipmentSlot type="shovel"/>
                <EquipmentSlot type="hoe"/>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>

</style>
<script>
import store from '../../store'
import EquipmentSlot from "../../components/EquipmentSlot";
import PlayerRender from "../../components/PlayerRender";
export default {
  name: 'Equipment',
  components: {PlayerRender, EquipmentSlot},
  data() {
    return {
      store: store.state
    }
  },
  computed: {
    equipment() {
      return this.store.user.inventory(i => i.equipped === true)
    },
    getMinecraftName() {
      const name = this.store.user.character.mc_head || "MHF_Steve";
      const match = name.match(/([a-zA-Z0-9_]{1,16})/g);

      if (match.length === 1)
        return name;
      else
        return "MHF_Steve"
    },
    getMCBody() {
        return `https://www.mc-heads.net/body/${this.getMinecraftName}/512`
    },
    getMCHead() {
      return `https://www.mc-heads.net/head/${this.getMinecraftName}/24`
    },
    title() {
      return this.store.user.character.title;
    },
    characterName() {
      return this.store.user.character.username;
    }
  },
  sockets: {}
}
</script>
