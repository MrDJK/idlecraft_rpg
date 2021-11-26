<template>
    <li class="chat-message mb-2 ps-2 position-relative" :class="{'text-muted': isBlocked}">
        <span v-if="isChatMod && !messageDeleted && !isSystem" @click="deleteMessage"
              class="me-1 d-inline-block cursor-pointer">
            <v-tooltip placement="left">
                <span>[x]</span>
                <template #popper>Delete</template>
            </v-tooltip>
        </span>
        <span v-if="isChatMod && !isSystem" @click="timeoutUser" class="me-1 d-inline-block cursor-pointer">
            <v-tooltip placement="left">
                <span>[t]</span>
                <template #popper>Timeout user</template>
            </v-tooltip>
        </span>
        <!--        <span v-if="isChatMod" @click="banUser" class="me-2 d-inline-block cursor-pointer">-->
        <!--            <v-tooltip placement="left">-->
        <!--                <span>[b]</span>-->
        <!--                <template #popper>Ban User</template>-->
        <!--            </v-tooltip>-->
        <!--        </span>-->
        <div class="me-2 d-inline-block author" v-if="message.Character">
            <v-tooltip placement="left" :disabled="!message.Character?.title">
                <span>
                    <mc-icon :icon="message.Character?.badge"
                             :size="12"
                             class="d-inline-block me-2"
                             v-if="message.Character?.badge"/>
                </span>
                <span :class="usernameColor" class="cursor-pointer"
                      @click.stop="openProfile">{{ message.Character.username || m.from }}</span>

                <template #popper>
                    {{ message.Character?.title }}
                </template>
            </v-tooltip>
        </div>
        <span class="mb-0" :class="{'text-muted': messageDeleted}">
            {{ !message.Character ? message.from : '' }} {{ messageContent }}</span>
    </li>
</template>
<script>
import McIcon from "./McIcon";
import store from '../store'

export default {
  name: 'ChatMessage',
  components: {McIcon},
  props: {
    message: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      store: store.state,
    }
  },
  computed: {
    isChatMod() {
      return this.store.user.user.staff > 0
    },
    messageContent() {
      if(this.isBlocked)
        return 'Message blocked';

      return !this.message.deleted_at ? this.message.message : 'message deleted'
    },
    messageDeleted() {
      return this.message.deleted_at !== null;
    },
    isSystem() {
      return this.message.system
    },
    isFriend() {
      if(!this.message.Character || !this.message.Character.User)
        return false;

      return this.store.user.relationships.findIndex(r => r.other_user_id === this.message.Character.id && r.type === 'friend') > -1
    },
    isBlocked() {
      if(!this.message.Character || !this.message.Character.User)
        return false;

      return this.store.user.relationships.findIndex(r => r.other_user_id === this.message.Character.id && r.type === 'block') > -1
    },
    messageIsFromStaff() {
      if(!this.message.Character || !this.message.Character.User)
        return false;

      return this.message.Character.User.staff >= 2
    },
    messageIsFromChatMod() {
      if(!this.message.Character || !this.message.Character.User)
        return false;

      return this.message.Character.User.staff === 1
    },
    usernameColor() {
      return {
        'text-success': this.isFriend,
        'text-danger': this.messageIsFromStaff,
        'text-info': this.messageIsFromChatMod,
      }
    }
  },
  methods: {
    deleteMessage() {
      if (confirm(`Are you sure you want to delete this message? ${this.message.message}`) === true) {
        this.$socket.emit('delete message', this.message.id)
      }
    },
    banUser() {
      if (confirm(`Are you sure you want to timeout ${this.message.Character.username} for 10 minutes?`) === true) {
        this.$socket.emit('chatban user', this.message.Character.user_id)
      }
    },
    timeoutUser() {
      if (confirm(`Are you sure you want to timeout ${this.message.Character.username} for 10 minutes?`) === true) {
        this.$socket.emit('timeout user', this.message.Character.user_id)
      }
    },
    openProfile() {
      this.$emit('openProfile', this.message.Character)
    },
  },
}
</script>
