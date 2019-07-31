<template>

    <div v-if="equipmentUsed && equipmentUsed.length" class="row well" style="padding-bottom: 1rem;">
        <div class="col-12">
            <h5 :style="'letter-spacing: -1px; color: ' + pvolveMintTitle + '; text-transform: none; padding: 1rem;'" class="monty">Equipment used</h5>

            <div class="row items-stretch" style="padding: 0;">
                <!--<h4 class="full-width">{{ equipmentUsed }} Mini Shop</h4>-->

                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 bg-white" v-for="item in equipmentUsed" style="padding: .5rem;">

                    <div align="center" class="relative-position" style="height: 100%; padding-bottom: 2rem;">

                        <h6 style="text-align: center; margin-bottom: 1rem;">
                            {{ item.title }}
                        </h6>

                        <img :src="item.image" style="max-width: 100%;" />

                        <div align="center" style="position: absolute; bottom: 0; width: 100%;">
                            <q-btn outline size="sm" @click="goTo(item)" class="full-width" style="background: #fff !important; color: #333;">
                                <h6 style="font-size: .9rem; letter-spacing: 1px; margin: 0;">shop</h6>
                            </q-btn>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['equipmentUsed'],

        mixins: [ pvolveColors, globalComputedData ],

        data() {
            return {

            }
        },

        components: {

        },

        computed: {

        },

        methods: {
            goTo(item) {
                window.open(item.link)
            },

            getShopifyLink(item) {
                k('getShopifyLink: ', item.handle)

                // TODO: for dev testing
                let link = `https://pvolve-staging.myshopify.com/products/${item.handle}`

                // let link = `https://www.pvolve.com/products/${item.handle}`

                if (!this.userLoginToken) {
                    window.open(link)
                } else {
                    let req = {
                        "userLoginToken": this.userLoginToken,
                        "return_to": link
                    }
                    k('getShopifyLink req: ', req)

                    this.api.post(`${this.api.apiv4Route}api/client/mypvolve/shopifyUserRedirectURL`, req, (res) => {
                        k('getShopifyLink res: ', res)

                        if (res.success) {
                            window.open(res.url)
                        }
                    })
                }
            }
        },

        mounted() {
            k('mini shop data: ', this.equipmentUsed)
        }
    }
</script>

<style scoped>

    .cardStyle {
        position: relative;
        background: #fff;
        height: 100%;
        padding-bottom: 2rem;
        border: 1px solid #c7c7c7;
        cursor: pointer;
    }
</style>
