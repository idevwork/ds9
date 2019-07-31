<template>

    <div class="row" :style="footerStyle" id="footer">
        <div v-if="componentData.socialMediaLinks && componentData.socialMediaLinks.length" class="col-12" align="center" style="padding: 1rem;">
            <a v-for="link in componentData.socialMediaLinks" target="_blank" :href="link.link" style="color: white; margin: 1rem; text-decoration: none;">
                <q-icon :name="'fab fa-' + link.icon" style="font-size: 1.5rem;" />
            </a>
        </div>

        <div class="col-12" align="center" style="color: white;">
            <a href="https://streamlinepublishing.com/corp/?page_id=593" target="_blank" style="color: #fff !important; font-weight: 700;">Privacy Policy</a> | <a href="https://streamlinepublishing.com/corp/?page_id=914" target="_blank" style="color: #fff !important; font-weight: 700;">Terms & Conditions</a> | <a href="https://streamlinepublishing.com/corp/?page_id=908" target="_blank" style="color: #fff !important; font-weight: 700;">Cookie Policy</a>
            <br />
            <br />
            <q-icon name="fa-copyright" style="font-size: 1rem;" /> {{moment().format('YYYY')}} {{environmentData.shopName ? ' ' + environmentData.shopName : ''}}. All Rights Reserved.
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
