<template>
    <div class="global-toast-container">
        <transition-group name="messageList">
            <div class="toast-notification" v-for="m in messages" :key="m.id">
                <div class="d-inline-flex px-4 flex-row align-items-center justify-content-center bg-info p-2 m-1">
                    <span v-html="m.message"></span>
                </div>
            </div>
        </transition-group>
    </div>
</template>
<script>
export default {
  name: 'GlobalMessages',
  data() {
    return {
      messages: [],
      id: 0,
    }
  },
  sockets: {
    'global toast'(message) {

      console.log("got message", message)

      this.id++;
      this.messages.push({
        id: this.id,
        message: message.message,
      });

      setTimeout(() => {
        this.messages.splice(0, 1);
      }, 5000);
    }
  }
}
</script>
