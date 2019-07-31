<template>

    <div class="image-placeholder relative-position full-width">

        <img :src="url" v-show="loaded" @load="imageLoaded" style="max-width: 100%;">

        <q-inner-loading :visible="!loaded" />

    </div>

</template>

<script>
    export default {
      name: 'image-loader',

      props: ['url'],

      data() {
        return {
          loaded: false
        }
      },

      methods: {
        imageLoaded() {
          this.loaded = true
        }
      },
      watch: {
        url() {
          this.loaded = false
        }
      }
    }
</script>

<style>

  .image-placeholder {
    min-height: 3rem;
    font-size: 0;
  }

</style>

