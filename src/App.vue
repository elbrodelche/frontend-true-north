<template>
  <div id="app" class="container">
    <PizzaCart/>
  </div>
</template>

<script>
import PizzaCart from './components/PizzaCart.vue';

export default {
  name: 'app',
  components: {
    PizzaCart,
  },
};
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
