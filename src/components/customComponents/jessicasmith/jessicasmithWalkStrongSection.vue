<template>
    
    <div v-if="productArr" class="row" :style="'background: ' + componentData.backgroundColor || '#fff' + '; text-align: center; padding-bottom: 2rem;'">
        <div class="row well" style="width: 100%;">
            <a class="col" target="_blank" href="http://walkonwalkstrong.com/wp-content/uploads/2016/05/Phase3.pdf">
                <q-btn color="grey" class="full-width">
                    <q-icon name="fa-external" /> 
                    <h6>Walk STRONG 2.0 calendar</h6>
                </q-btn>
            </a>
            <q-btn class="col" color="green" @click="addAllToCart()">
                <h6>Add All To Cart</h6>
            </q-btn>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        data() {
            return {
                productArr: []
            }
        },
        
        computed: {
            environmentProducts() {
                return this.$store.state.environmentProducts
            }
        },
        
        created() {
            k('componentData: ', this.componentData)
            if (this.environmentProducts) this.findStrongProducts()
        },
        
        watch: {
            environmentProducts() {
                if (this.environmentProducts) this.findStrongProducts()
            }
        },
        
        methods: {
            
            add2cart(product) {
                this.$store.commit('add2cart', product)
                this.$q.notify({
                    message: 'Added to cart!',
                    type: 'positive',
                    icon: 'fa-check-circle',
                    position: 'bottom-left'
                })
            },
            
            findStrongProducts() {
                this.componentData.productIDs.forEach((id) => {
                    this.environmentProducts.forEach((p) => {
                        if (id === p.productID) this.productArr.push(p)
                    })
                })
                
                k('productArr: ', this.productArr)
            },
            
            addAllToCart() {
                this.productArr.forEach((p) => {
                    this.add2cart(p)
                    this.$root.$emit('openShopCart', true)
                })
            }
            
        }
    }
</script>