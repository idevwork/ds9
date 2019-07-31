<template>
  
    <q-toolbar color="white">
        <q-btn
            v-for="item in mediaOptions" 
            v-if="showMediaType(item)" 
            :key="item.text" 
            :id="item.text + 'Tab'"
            flat
            style="color: #000; padding: 0 .5rem; border-right: 1px #ddd solid;"
            @click="selectTab(item)"
        >
            <q-icon :name="item.icon" style="margin-right: .5rem;" />
            <span class="gt-xs">{{item.text}}</span>
        </q-btn>
        
        <q-btn id="closeVideoPlayer" style="position: absolute; right: .25rem; top: .25rem; padding: .75rem;" @click="exitMedia()" flat color="red">
            <q-icon color="red" name="fa-times" />
        </q-btn>
            
    </q-toolbar>
    
</template>

<script>
    export default {
        data() {
            return {
                selectedTabID: 'video',
                
                mediaOptions: [{
                    id: 'video',
                    icon: 'fas fa-video',
                    text: 'video',
                    jsonKeys: ['video']
                },
                {
                    id: 'audio',
                    icon: 'fas fa-music',
                    text: 'audio',
                    jsonKeys: ['audio']
                },
                {
                    id: 'additionalMedia',
                    icon: 'fas fa-folder',
                    text: 'additional media',
                    jsonKeys: ['pdf', 'zip']
                }],
                
                showMediaType(option) {
                    let productMediaTypes = this.currentProduct.productJSON ? Object.keys(this.currentProduct.productJSON) : []
                    return productMediaTypes.some((type) => { return option.jsonKeys.includes(type) })
                }
            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },
            
            comingFrom() {
                return this.$store.state.comingFrom
            },
            
            currentMediaType() {
                return this.$store.state.currentMediaType
            }
        },

        methods: {
            selectTab(item) {
                k('selectTab: ', item)

                // this.selectedTabID = item.id
                this.$store.commit('currentMediaType', item.id)
                
                k('currentMediaType: ', this.currentMediaType)
            },
            
            exitMedia() {
                k('exitMedia: ', this.comingFrom)
                
                this.$store.commit('currentMediaType', '')
                
                if (this.comingFrom && this.comingFrom !== '/signin') {
                    this.route(this.comingFrom)
                } else {
                    this.route('/library')
                }
            }
        },

        mounted() {

        },
        
        beforeDestroy() {

        }
    }
</script>

<style>

</style>
