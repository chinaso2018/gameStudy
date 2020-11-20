<template>
  <div
    class="actionButton"
    :class="{ active: isActive }"
    @touchstart="pressIn"
    @mousedown="pressIn"
    @mouseup="pressOut"
    @touchend="pressOut"
  >
    {{ text }}
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    pressIn() {
      this.isActive = true
    },
    pressOut() {
      this.isActive = false
      this.$emit('onClick')
    }
  }
}
</script>
<style scoped>
.actionButton {
  width: 100px;
  height: 44px;
  background-color: #6aa1ec;
  border-radius: 10px;
  filter: drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.3));
  display:flex;
  justify-content: center;
  align-items: center;
  color:#ffffff;
  font-size: 18px;
  line-height: 18px;
  font-weight: bold;
  text-align: center;
}
.actionButton.active {
  transform: scale(0.95);
}
</style>
