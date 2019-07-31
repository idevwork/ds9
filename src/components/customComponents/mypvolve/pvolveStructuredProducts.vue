<template>

    <div id="pvolveStructuredProducts" :style="`background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'};`">
        <div v-if="componentData.heading" class="row well">
            <h2 class="col-12 dividerHeader" align="center">
                <span :style="`color: ${componentData.headingColor ? componentData.headingColor : pvolveMintTitle}; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'}`">{{componentData.heading}}</span>
            </h2>
        </div>

        <div v-if="!$q.platform.is.mobile && structuredProductsForDisplay.length" class="row well">

            <div v-for="item in structuredProductsForDisplay" @click="shelfAction(item)" :class="componentData.columnClass ? componentData.columnClass : 'col-xs-12 col-sm-6 col-md-3'" style="padding: .5rem; cursor: pointer; position: relative;" align="center">
                <img style="max-width: 100%;" :src="coverImageURL(item)" />
                <h6 style="margin: .5rem 0;">{{ item.productName }}</h6>
            </div>
        </div>

        <div v-if="$q.platform.is.mobile">
            <div v-if="structuredProductsForDisplay.length" id="mobileCards" class="relative-position">
                <div
                    class="mobileCard"
                    v-for="item in structuredProductsForDisplay"
                    align="center"
                    @click="shelfAction(item)"
                    style="padding: 1rem;"
                >
                    <img style="max-width: 100%;" :src="coverImageURL(item)" />
                    <h6 style="margin: .5rem 0;">{{ item.productName }}</h6>
                </div>
            </div>

        </div>

        <q-modal
            v-model="showStructuredProductDetails"
            :content-css="{minWidth: '50vw', minHeight: '80vh'}"
            @hide="resetCurrentProduct()"
        >
            <q-modal-layout id="structuredProductDetails" v-if="showStructuredProductDetails">
                <div align="right" slot="header" style="background: #FFF8F5;">
                    <q-btn @click="showStructuredProductDetails = false" flat round>
                        <q-icon name="fa-times" />
                    </q-btn>
                </div>

                <pvolveStructuredProductPreview />

                <div align="right" slot="footer" style="background: #FFF8F5; padding: 1rem;">
                    <div v-if="userAccessToShelfItem(currentProduct)" align="right">
                        <q-btn v-if="currentProduct.webplayer" outline @click="goToStructuredProduct(currentProduct)" :style="`background: #fff !important; color: #333;`">
                            <h6 style="margin: 1rem 0; letter-spacing: 1px;">
                                Start Program
                            </h6>
                        </q-btn>

                        <q-btn v-else outline disabled @click="goToStructuredProduct(currentProduct)" :style="`background: #fff !important; color: #333;`">
                            <h6 style="margin: 1rem 0; letter-spacing: 1px;">
                                Available Soon!
                            </h6>
                        </q-btn>
                    </div>

                    <div v-if="!userAccessToShelfItem(currentProduct) && !previouslyOwnedTrial" align="center">
                        <q-btn outline @click="route('/trial')" style="background: #fff !important; color: #333; min-width: 12rem;">
                            <h6 style="margin: 1rem 0; letter-spacing: 1px;">
                                Sign up for a free trial!
                            </h6>
                        </q-btn>
                    </div>

                    <div v-if="!userAccessToShelfItem(currentProduct) && previouslyOwnedTrial" align="center">
                        <q-btn outline @click="goToSignUpNow()" style="background: #fff !important; color: #333; min-width: 12rem;">
                            <h6 style="margin: 1rem 0; letter-spacing: 1px;">
                                Sign up for a subscription!
                            </h6>
                        </q-btn>
                    </div>
                </div>

            </q-modal-layout>
        </q-modal>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'

    import pvolveStructuredProductPreview from './pvolveStructuredProductPreview.vue'

    export default {
        props: [ 'componentData' ],

        components: {
            pvolveStructuredProductPreview
        },

        mixins: [ pvolveColors, userAndProductInfo, productInfoTools, pvolveProductSectionTools ],

        data() {
            return {
                showStructuredProductDetails: false,

                coverImageURL(item) {
                    return `https://vault.platformpurple.com/static/previews/${item.productSKU}/${item.productSKU}_500px_cover.png`
                },

                addParamsIfNeeded(route) {
                    return window.location.search ? route + window.location.search : route
                },

                userAccessToShelfItem(item) {
                    return this.userHasAccess([item.productID])
                }
            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            authenticated() {
                return this.$store.state.user.authenticated
            },

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            previouslyOwnedTrial() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
            },

            subscriptionAccessType() {
                return this.userSubscriptionProductStatusHistory &&
                    this.userSubscriptionProductStatusHistory.length ?
                    this.userSubscriptionProductStatusHistory[0].accessType : ''
            },

            structuredProductsForDisplay() {
                k('structuredProductsForDisplay: ', this.componentData.products)
                return this.componentData.products
            },

            specialProductRoutes() {
                return this.environmentJSON.e.specialProductRoutes
            },

            userHasAccessToAnyShelfItems() {
                let structuredProductsIDs = this.structuredProductsForDisplay.map((product) => {
                    return product.productID
                })
                return this.userHasAccess(structuredProductsIDs)
            },

            beginnerProgramProductInfo() {
                return this.structuredProducts ? this.structuredProducts.find((product) => product.productID === 155882) : ''
            }
        },

        created() {
            kw('pvolveStructuredProducts! ', this.structuredProductsForDisplay)
            k('userSubscriptionProductStatusHistory: ', this.userSubscriptionProductStatusHistory)

            this.$root.$on('showBeginnerProgram', () => {
                if (this.beginnerProgramProductInfo) this.shelfAction(this.beginnerProgramProductInfo)
            })

            let userCameFromPvolveStructuredProducts = this.localStorage.get('userCameFromPvolveStructuredProducts')
            kw('userCameFromPvolveStructuredProducts: ', userCameFromPvolveStructuredProducts)

            if (userCameFromPvolveStructuredProducts) {
                this.$nextTick(() => {
                    this.scrollIt('pvolveStructuredProducts', '', 50)
                    this.localStorage.set('userCameFromPvolveStructuredProducts', false)
                })
            }
        },

        watch: {
            environmentProducts() {
                k('structuredProducts: ', this.structuredProducts)
            },

            showStructuredProductDetails() {
                if (!this.showStructuredProductDetails) {
                    this.$store.commit('setProductID2Preview', '')
                }
            },

            currentProduct() {
                kw('currentProduct pvolve: ', this.currentProduct)
            }
        },

        methods: {
            shelfAction(item) {
                k('shelfAction: ', item)

                this.$store.commit('setProductID2Preview', item.productID)
                this.showStructuredProductDetails = true
            },

            goToStructuredProduct(item) {
                k('goToStructuredProduct: ', this.specialProductRoutes, String(item.productID), this.specialProductRoutes[String(item.productID)])
                this.localStorage.set('userCameFromPvolveStructuredProducts', true)

                if (this.userAccessToShelfItem(item)) {
                    this.$store.commit('setProductLaunchContext', 'productCard')
                    this.route(this.addParamsIfNeeded(this.specialProductRoutes[String(item.productID)]))
                }

                this.$store.commit('setProductID2Preview', '')
            },

            resetCurrentProduct() {
                k('resetCurrentProduct!')
                this.$store.commit('setCurrentProduct', '')
            },

            goToSignUpNow() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
                this.route('/offer/special?signUpNow=true')
            }
        }
    }
</script>

<style scoped>

    .floatingBadge {
        position: absolute;
        right: 0;
        top: 0;
        padding: .25rem .5rem;
        color: #fff;
        font-size: .8rem;
        font-weight: 700;
        border: 2px solid white;
    }

    #mobileCards {
        min-width: 100%;
        min-height: 5rem;
        display: flex;
        overflow-x: scroll;
        overflow: -moz-scrollbars-none;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
    }

    .mobileCard {
        min-width: 20rem;
        max-width: 20rem;
    }

    #mobileCards::-webkit-scrollbar {
        display: none;
    }
</style>
