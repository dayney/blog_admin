<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.about {
  padding: 20px;
  
  h1 {
    color: $text-primary;
  }
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
