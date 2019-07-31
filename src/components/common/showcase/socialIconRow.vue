<template>
    
    <div class="" :style="rowStyle" align="center">

        <div class="well">
            
            <div class="full-width row">
              <div v-for="link in componentData.socialMediaLinks" class="col" align="center">
                  <a class="full-width" target="_blank" :href="link.link" style="text-decoration: none;">
                      <q-icon :color="link.color" :name="'fab fa-' + link.icon" style="font-size: 2rem;" />
                  </a>
              </div>
            </div>
            
        </div>

    </div>
    
</template>

<script>

  export default {
    props: ['componentData'],
    
    data() {
      return {

      }
    },

    components: {
      
    },

    computed: {
      rowStyle() {
        return 'background: ' + (this.componentData.backgroundColor || '#fff') + '; padding: 0 1rem;'
      },
    },

    methods: {

    },

    mounted() {
      // console.log('componentData: ', this.componentData)
    }
  }
</script>

<style>
</style>