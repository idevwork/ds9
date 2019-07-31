<template>

    <div id="ydwSharingModal" class="row justify-center" align="center">
        <h1 class="col-12" style="margin: 0; padding: 1rem; color: #fff; background: #dc3972;">
            <q-icon name="fa-trophy" class="big-icon" /> Congratulations!
        </h1>
    
        <div class="col-12" style="padding: 1rem; background: #efefef;">
            
            <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + currentProduct.productSKU + '/' + currentProduct.productSKU + '_ws.jpg'" style="margin: 0 auto; width: 500px; max-width: 100%; border: 5px solid #dc3972;" />
            <!--<h3>{{currentProduct.productName}}</h3>-->
            
            <h2 style="margin: .5rem;">
                You did it!
            </h2>
            <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/yourdailywalk/icon-shoe.png" style="max-width: 5rem;" />
        </div>
        <div  class="col-12" style="padding: 1rem;">
            <p>Share this with your friends to encourage them to join you:</p>
            
            <q-btn round color="blue" icon="fab fa-facebook-f" @click="share2Facebook(currentProduct)"></q-btn>
            <q-btn round color="teal" icon="fab fa-twitter" @click="share2Twitter(currentProduct)"></q-btn>
        </div>
    
    </div>

</template>

<script>
    import { social } from '../../../mixins/social'
    
    export default {
        props: ['componentData'],
        
        mixins: [social],
    
        data() {
            return {
                truncate(string) {
                    var truncateLength = 100
                    return string.length > truncateLength ? string.substring(0, truncateLength) + '...' : string
                },
            }
        },
    
        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            }
        },
    
        methods: {

        },
    
        mounted() {

        }
    }
</script>