<template>
  <div class="demo">
    <TailwindElementDemo />
  </div>
</template>

<script setup>
import TailwindElementDemo from '@/components/TailwindElementDemo.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.demo {
  width: 100%;
  padding: 20px 0;
  background-color: $bg-color;
}
</style> 