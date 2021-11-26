<template>
    <div class="loading" v-if="loading"></div>
</template>
<style lang="scss" scoped>
.loading {
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 9;
    position: absolute;
    background: url('https://res.cloudinary.com/dpktc8kvn/image/upload/v1629144801/latest_murs5i.gif') no-repeat center center rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: 100px 100px;
}
</style>
<script>
export default {
  name: 'LoadingIndicator',
  props: {
    loading: {
      default: false,
      required: false
    }
  }
}
</script>
