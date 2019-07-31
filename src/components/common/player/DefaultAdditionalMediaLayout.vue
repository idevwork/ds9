<template>
        
    <div style="background: #efefef;">
        <MediaMenu />
        
        <div class="row well">
            <div class="col-12" style="padding: 1rem;">
                <q-list v-if="currentProduct.productJSON.pdf" style="background: white;" separator highlight>
                    <q-list-header>
                        <h5>PDFs</h5>
                    </q-list-header>
            
                    <q-item v-for="(item, index) in currentProduct.productJSON.pdf" :key="item.displayName" style="cursor: pointer;" @click.native="$emit('launchPDF', item)">
                        <q-item-side icon="fa fa-file-pdf" />
                        <q-item-main>
                            {{item.displayName}}
                        </q-item-main>
                        <q-item-side icon="fa-external-link-alt" />
                    </q-item>
                </q-list>
            </div>
        
            <div class="col-12" style="padding: 1rem;">
                <q-list v-if="currentProduct.productJSON.zip" style="background: white;" separator highlight>
                    <q-list-header>
                        <h5>ZIPs</h5>
                    </q-list-header>
            
                    <q-item v-for="(item, index) in currentProduct.productJSON.zip" :key="item.displayName" style="cursor: pointer;" @click.native="$emit('launchZip', item)">
                        <q-item-side icon="fa-folder" />
                        <q-item-main>
                            {{item.displayName}}
                        </q-item-main>
                        <q-item-side icon="fa-external-link-alt" />
                    </q-item>
                </q-list>
            </div>
        </div>
    
    </div>
        
</template>

<script>
    import MediaMenu from './MediaMenu'
    
    export default {
        
        components: {
            MediaMenu
        },

        data() {
            return {

            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            }
        },

        methods: {

        },

        created() {
           
        }

    }
</script>

<style>

</style>