<template>

    <div class="row" :style="footerStyle" id="footer">
        <div v-if="componentData.socialMediaLinks && componentData.socialMediaLinks.length" class="col-12" align="center" style="padding: 1rem;">
            <a v-for="link in componentData.socialMediaLinks" target="_blank" :href="link.link" style="color: white; margin: 1rem; text-decoration: none;">
                <q-icon :name="'fab fa-' + link.icon" style="font-size: 1.5rem;" />
            </a>
        </div>

        <div class="col-12" align="center" style="color: white;">
            <q-icon name="fa-copyright" style="font-size: 1rem;" /> {{moment().format('YYYY')}} {{componentData.shopName ? ' ' + componentData.shopName : environmentData.shopName ? ' ' + environmentData.shopName : ''}}. All Rights Reserved. {{ componentData.footerText }}
        </div>
    </div>

</template>

<script>
export default {
  props: ['componentData'],

  data () {
    return {

    }
  },

  computed: {
    environmentData() {
        return this.$store.state.environment.data
    },

    homePageData() {
        return this.$store.state.environment.json
    },

    footerStyle() {
      return 'background: ' + (this.componentData.backgroundColor || this.homePageData.e.brandColor || '#564F8A') + '; margin: 0; border-radius: 0; padding: 1rem;'
    }
  },

  methods: {

  },

  mounted () {
    // k('componentData footer: ', this.componentData)
  },

  beforeDestroy () {

  }
}
</script>

<style>

</style>
