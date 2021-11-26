<template>
    <div id="chat-container">
        <div class="m-0 ps-2 border-bottom border-dark align-items-center d-flex small">
            <span class="me-2">Players Online:</span>
            <vue3autocounter ref='counter'
                             :startAmount='playersOnline.previous'
                             :endAmount='playersOnline.current'
                             :duration='1'
                             :autoinit='true'/>

        </div>
        <div id="chat-messages" ref="chatBox" v-on:scroll="checkScroll" class="mt-2">
            <div v-if="profileOpen" class="chat-profile-bit" v-click-outside="closeProfile">
                <div class="p-2">
                    <h3 :class="usernameColor" class="d-flex align-items-center flex-row justify-content-center">
                        <mc-icon :icon="profile?.badge"
                                 :size="12"
                                 class="d-inline-block me-2"
                                 v-if="profile?.badge"/>{{ profile.username }}
                        <span class="text-muted ms-auto h6 mb-0">{{ profile.title }}</span></h3>

                    <h6 v-if="profile.title" class="pull-right"></h6>

                    <div class="d-flex flex-row justify-content-between">
                        <button @click="addFriend" class="btn btn-primary" v-if="!isFriend">Add friend</button>
                        <button @click="removeFriend" class="btn btn-primary" v-else>Remove friend</button>
                        <button @click="addBlock" class="btn btn-primary" v-if="!isBlocked">Block</button>
                        <button @click="unBlock" class="btn btn-primary" v-else>Un-block</button>
                    </div>
                </div>
            </div>
            <ul v-if="loaded" class="mb-0 list-unstyled" ref="messageList">
                <transition-group name="chatMessage">
                    <ChatMessage v-for="(m, i) in messages" :key="i" class="chat-message mb-2 ps-2"
                                 :class="{'text-muted': m.system}" :message="m" @openProfile="openProfile"/>
                </transition-group>
            </ul>
            <div v-else>
                Loading Chat History...
            </div>
        </div>
        <div id="chat-input" class="px-1">
            <!--            <hr class="my-3">-->
            <div class="new-message-badge cursor-pointer" v-if="newMessageIndicator" @click="scrollToBottom(true)">
                <span class="badge bg-primary amount">New Messages</span>
            </div>
            <form @submit.prevent="sendMessage" class="d-flex flex-column">
                <div class="mb-2">
                    <textarea type="text" v-model="message" class="form-control shadow-none chat-input"
                              placeholder="Send a message"
                              rows="2"
                              @keydown.enter.exact="$event.preventDefault()"
                              @keyup.enter.exact="sendMessage"
                    />
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div :class="{
                      'text-danger': message.length < 2 || message.length > 140,
                      'text-success': message.length >= 2 && message.length <= 140
                    }">
                        <v-tooltip placement="top">
                            <span>{{ message.length }} / 140</span>
                            <template #popper>
                                Your message must be between 2 and 140 characters in length
                            </template>
                        </v-tooltip>
                    </div>
                    <div class="float-end">
                        <input type="submit" value="Chat" class="btn btn-secondary btn-sm"
                               :disabled="message.length < 2 || message.length > 140"/>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped lang="scss">
#chat-messages {
    overflow: hidden scroll;
    word-break: break-word;
}

#chat-input {
    position: relative;
    text-align: center;
}

.chat-input {
    background: #222;
    color: #b7b5b5;
    font-size: 14px;
    resize: none;

    &:focus {
        background: black;
        color: white;
    }

    &::placeholder {
        color: inherit;
    }
}

.chat-message {
    transition: all ease-in-out .4s;
    font-size: 16px;
    word-break: break-all;

    .author {
        font-weight: bold;
    }
}

.chatMessage-enter-from {
    opacity: 0;
    height: 0;
    transform: translateX(30px);
}

.new-message-badge {
    bottom: 100px;
    position: absolute;
    margin: 0 auto;
    display: inline;
    left: 0;
    width: 100%;
}
</style>
<script>
import {nextTick} from "vue";
import Vue3autocounter from 'vue3-autocounter';
import ChatMessage from "../ChatMessage";
import McIcon from "../McIcon";
import store from '../../store'

export default {
  name: 'ChatBar',
  components: {McIcon, ChatMessage, Vue3autocounter},
  data() {
    return {
      messages: [],
      message: '',
      loaded: false,
      newMessageIndicator: false,
      rawPlayersOnline: 0,
      playersOnline: {
        previous: 0,
        current: 0,
      },
      profileOpen: false,
      profile: {},
      store: store.state
    }
  },
  watch: {
    'rawPlayersOnline'(current, old) {
      console.log('players online', old, current)
      this.playersOnline.previous = old;
      this.playersOnline.current = current;
      this.$refs.counter.start();
    },
  },
  mounted() {
    this.getPlayersOnline();
    this.getHistory()
  },
  computed: {
    isFriend() {
      return this.store.user.relationships.findIndex(r => r.other_user_id === this.profile.id && r.type === 'friend') > -1
    },
    isBlocked() {
      return this.store.user.relationships.findIndex(r => r.other_user_id === this.profile.id && r.type === 'block') > -1
    },
    messageIsFromStaff() {
      return this.profile.User.staff >= 2
    },
    messageIsFromChatMod() {
      return this.profile.User.staff === 1
    },
    usernameColor() {
      return {
        'text-success': this.isFriend,
        'text-danger': this.messageIsFromStaff,
        'text-info': this.messageIsFromChatMod,
      }
    },
  },
  methods: {
    getPlayersOnline() {
      this.$socket.emit('players online')
    },
    getHistory() {
      this.$socket.emit('get chat history')
    },
    sendMessage() {

      if (this.message.length < 2 || this.message.length > 140) {
        return;
      }

      this.$socket.emit("chat send message", this.message);
      this.message = '';
    },
    checkScroll() {
      nextTick(() => {
        const chatBox = this.$refs.chatBox;
        const messageList = this.$refs.messageList;

        if ((chatBox.scrollTop + chatBox.clientHeight > (messageList.clientHeight - 100))) {
          this.newMessageIndicator = false;
        }

      });
    },
    scrollToBottom(force = false) {
      // Vue does some weird shit sometimes, so this makes sure on the next tick it fetchs the correct height
      // so it can actually scroll to the bottom
      nextTick(() => {
        const chatBox = this.$refs.chatBox;
        const messageList = this.$refs.messageList;

        if ((chatBox.scrollTop + chatBox.clientHeight > (messageList.clientHeight - 100)) || force) {
          this.newMessageIndicator = false;
          chatBox.scrollTop = chatBox.scrollHeight + 300;
        } else {
          this.newMessageIndicator = true;
        }

      });
    },
    onReady(instance) {
      console.log(instance)
      // const that = this;
      // instance.update(that.playersOnline)
    },

    toggleProfile() {
      this.profileOpen = !this.profileOpen;
    },
    openProfile(profile) {
      console.log("opening cpporoadsf")
      this.profile = profile;
      this.profileOpen = true;
    },
    closeProfile() {
      console.log("Closing profile")
      this.profileOpen = false;
    },
    clickOutside() {
      if (this.profileOpen)
        this.profileOpen = false;
    },
    addFriend() {
      this.$socket.emit('add friend', this.profile.id)
    },
    addBlock() {
      this.$socket.emit('block user', this.profile.id)
    },
    removeFriend() {
      this.$socket.emit('remove friend', this.profile.id)
    },
    unBlock() {
      this.$socket.emit('unblock user', this.profile.id)
    }
  },
  sockets: {
    'new chat message': function (message) {
      this.messages.push(message);
      setTimeout(() => {

        this.scrollToBottom();
      }, 100)
    },
    'send history': function (history) {
      this.messages = history.reverse();
      this.loaded = true;

      this.scrollToBottom(true)
    },
    'players online': function (online) {
      this.rawPlayersOnline = online;
    },
    'delete message'(id) {
      const message = this.messages.find(m => m.id === id);
      message.message = 'Message Deleted';
      message.deleted_at = new Date()
    }
  }
}
</script>
