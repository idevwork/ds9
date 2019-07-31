<template>
    
    <div style="min-height: 3rem;">
        
        <div v-if="offerBrandComponent" :is="offerBrandComponent" />
        <q-inner-loading v-else visible />

    </div>
      
</template>

<script>
    
    export default {

        data() {
            return {
                offerBrandComponent: ''
            }
        },

        computed: {
            environmentName() {
                return this.$root.$store.state.environment.name
            },
            
            environmentJSON() {
                return this.$root.$store.state.environment.json
            },
            
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
            
            userInfo() {
                return this.$root.$store.state.user.info
            },
            
            offerBrand() {
                return this.$root.$store.state.offerBrand
            },
        },

        methods: {
            setOfferComponentData() {
                k('BRAND PROP: ', this.offerBrand)
                
                var sectionData = this.homePageSectionFromID('offer')
                if (!sectionData.validRoutes[this.offerBrand]) this.route('/404')
                
                this.loadIt(this.offerBrand, 'customComponents/' + this.environmentName + '/' + this.offerBrand)
                this.offerBrandComponent = this.offerBrand
            }
        },
        
        watch: {
            offerBrand() {
                if (this.offerBrand) {
                    this.setOfferComponentData()
                } else {
                    this.route('/')
                }
            },
            
            offerBrandComponent() {
                k('offerBrandComponent: ', this.offerBrandComponent)
            }
        },
        
        mounted() {
            if (this.offerBrand) {
                this.setOfferComponentData()
            } else {
                this.route('/')
            }
        }
    }
</script>

<style>

</style>
