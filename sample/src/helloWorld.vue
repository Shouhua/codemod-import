<template>
<div>
  Hello, {{ name }}
  <button @click="handleGreet">Greet</button>
</div>
</template>
<script>
import greet from './greetPerson.js';

export default {
  name: 'Hello',
  props: {
    name: {
      type: String,
      default: 'world'
    }
  },
  methods: {
    handleGreet() {
      greet(this.name);
    }
  }
}
</script>
