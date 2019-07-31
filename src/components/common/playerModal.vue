<template>
    
    <q-modal
      v-model="openModal"
      @show="showInner = true"
      @hide="showInner = false"
      :content-css="{minWidth: '80vw', minHeight: '80vh'}"
    >
        <q-modal-layout>
        
            <q-toolbar slot="header" color="grey" :style="toolbarStyle">
                <q-toolbar-title>
                <!--Preview-->
                </q-toolbar-title>
                <q-btn flat icon="fa-times" @click="openModal = false" style="padding: .5rem;" />
            </q-toolbar>
            
            <div v-if="showInner" :is="playerModalName" />
        
        </q-modal-layout>

    </q-modal>
    
</template>

<script>
    
    export default {
        
        props: ['componentData'],

        data() {
            return {
                openModal: false,
                showInner: false
            }
        },

        computed: {
            playerModalName() {
                return this.$store.state.environment.json.hooks ? this.$store.state.environment.json.hooks.productComplete : ''
            },
            
            environment() {
                return this.$store.state.environment
            },
            
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
        
            toolbarStyle() {
                return this.brandColor ? 'background: ' + this.brandColor + ' !important ;' : ''
            },

            allComponentsForViewLoaded() {
                return this.$store.state.allComponentsForViewLoaded
            }
        },

        methods: {
            close() {
                this.openModal = false
            }
        },

        created() {
            this.$root.$on('openPlayerModal', (val) => {
                // k('event hub openPlayerModal: ', val)
                this.openModal = true
            })

            if (this.$store.state.environment.json && 
                this.$store.state.environment.json.hooks && 
                this.$store.state.environment.json.hooks.productComplete) {
            //   k('OPEN PLAYER MODAL!')
              this.loadIt(this.$store.state.environment.json.hooks.productComplete, 'customComponents/' + this.$store.state.environment.name + '/' + this.$store.state.environment.json.hooks.productComplete)
            }
        },

        beforeDestroy() {

        }
    }
</script>

<style>

</style>
