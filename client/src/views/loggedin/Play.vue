<template>
    <div class="h-100 w-100">
        <div id="layout" v-if="isAuth" :class="{'chat-open': this.isChatOpen}">
            <Header id="grid-header" class="border-bottom border-dark"/>
            <Sidebar id="grid-left-nav"/>
            <div id="grid-content">
                <router-view></router-view>
                <Inventory :class="{'close': !inventoryIsOpen, 'is-open': inventoryIsOpen}"/>
                <GlobalMessages />
            </div>
            <ChatBar id="grid-chatbar"  :class="{'close': !inventoryIsOpen, 'is-open': inventoryIsOpen}"/>
            <BottomBar id="bottom-bar"/>


        </div>
        <div v-else class="h-100 w-100">
            <LoadingIndicator :loading="true" />
        </div>

        <Modal v-if="itemDialogOpen" />
    </div>
</template>
<script>
import ChatBar from "../../components/layout/ChatBar";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import store from '../../store';
import BottomBar from "../../components/layout/BottomBar";
import LoadingIndicator from "../../components/LoadingIndicator";
import Inventory from "../../components/layout/Inventory";
import GlobalMessages from "../../components/GlobalMessages";
import Modal from "../../components/ItemModal";

export default {
  name: 'Play',
  components: {Modal, GlobalMessages, Inventory, LoadingIndicator, BottomBar, Header, Sidebar, ChatBar},
  data() {
    return {
      store: store.state,
    }
  },
  computed: {
    isAuth() {
        return this.store.readyToPlay
    },
    connectionOffline() {
      return this.$socket.disconnected
    },
    isChatOpen() {
      return this.store.layout.chatMobileOpen
    },

    inventoryIsOpen() {
      return this.store.layout.inventoryOpen
    },
    itemDialogOpen() {
      return this.store.layout.itemModel.show
    },
  },
  sockets: {
    'gain xp': function (skill) {
      this.store.user.character.UserLevel[`${skill.skillName}_xp`] += skill.xp;
    },
    'level up': function (levelUp) {
      console.log("levelup", levelUp)
      this.store.user.character.UserLevel[`${levelUp.skillName}_level`] = levelUp.level
    }
  }
}
</script>
