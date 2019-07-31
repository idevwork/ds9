<template>
    <div id="productPreview" class="layout-view">
        <q-inner-loading :visible="!productPreviewData" style="z-index: 999;" />

        <div v-if="productPreviewData">
            <div class="row" style="padding: 1.5rem;padding-bottom: 0px;">
                <div class="col-xs-12 col-sm-2">
                    <img :src="coverImageUrl(productPreviewData)" style="max-width: 100%; padding-right: 1rem;" class="sm-centered" />
                </div>
                <div class="col-xs-12 col-sm-10">
                    <h3 style="margin: 0px">{{ productPreviewData.productName }}</h3>
                    <div style="margin-top: 0.5rem;" v-if="productPreviewData" class="bundle-description" v-html="productPreviewData.productBlurb"></div>
                </div>
            </div>

            <div class="row wrap">

                <div class="col-lg-6" style="padding: 1.5rem;">
                    <div v-html="howItWorksHTML"></div>

                    <q-list v-if="!owned" class="lt-md" link style="margin-top: 1rem;">
                        <q-item tag="label">
                            <q-item-side>
                                <q-radio v-model="payingCustomPrice" :val="false" />
                            </q-item-side>
                            <q-item-main>
                                <div class="row items-center">
                                    <div class="col-sm-2">
                                        <q-item-tile label><strong>{{numeral(productPreviewData.pwyw_currentAvgPrice || productPreviewData.pwyw_startingPrice).add(0.01).format('$0.00')}}</strong></q-item-tile>
                                    </div>
                                    <div class="col-sm-10">
                                        <q-item-tile label>Beat The Average Price</q-item-tile>
                                        <q-item-tile sublabel>Beat the average to get all {{ uniqueFullAccessProducts.length + partialAccessProducts.length }} products</q-item-tile>
                                    </div>
                                </div>
                            </q-item-main>
                        </q-item>
                        <q-item tag="label">
                            <q-item-side>
                                <q-radio v-model="payingCustomPrice" :val="true" />
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile label>Pay what you want</q-item-tile>
                                <q-input prefix="$" v-if="payingCustomPrice" v-model="customPrice" type="number" placeholder="Enter custom amount" stack-label="Custom amount" @blur="formatCustomPrice()" />
                            </q-item-main>
                        </q-item>
                    </q-list>

                    <div v-if="productIsInShop" class="col-md-12 col-xl-6">
                        <div class="lt-lg" style="margin-bottom: 1rem;">
                            <q-btn size="lg" v-if="!owned && !inCart" :disable="disableAddToCart" @click="add2cart" id="add2cart" color="green" class="full-width margin-top" icon="fa-cart-plus">
                                <h6>Add To Cart</h6>
                            </q-btn>

                            <q-btn size="lg" v-if="inCart && !owned" @click="removeFromCart" id="removeFromCart" color="red" class="full-width margin-top" icon="fa-times">
                                <h6>Remove From Cart</h6>
                            </q-btn>

                            <q-btn size="lg" v-if="owned" color="purple" class="full-width margin-top" icon="fa-check-circle" @click="">
                                <h6>Owned</h6>
                            </q-btn>

                            <div v-if="!productIsInShop && environmentProductAndTagState === 'fetched'" class="full-width" align="center">
                                <h6>This product is not available for purchase.</h6>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <h4>Included in this bundle</h4>
                    </div>

                    <q-list striped class="pwyw-list">
                        <q-item class="pwyw-list__total" separator>
                            <q-item-side>
                                Unlocked Total
                            </q-item-side>
                            <q-item-main>
                            </q-item-main>
                            <q-item-side>
                                {{numeral(pwywBundleProductsValue).format('$0.00')}} Value
                            </q-item-side>
                        </q-item>

                        <div class="row pwyw-list__item items-center" v-for="(product, index) in partialAccessProducts" :key="product.productID + index + Math.random()" :class="{ 'selected': selectedProduct && selectedProduct.productID == product.productID, 'active': !payingCustomPrice || customPriceIsBeatingMinPrice }"
                            @click="selectProduct(product)">

                            <div class="col-2">
                                <div class="row items-center">
                                    <div class="col-3">
                                        <q-item-side>
                                            <q-icon :name="!payingCustomPrice || customPriceIsBeatingMinPrice ? 'fas fa-unlock' : 'fas fa-lock'" />
                                        </q-item-side>
                                    </div>
                                    <div class="col-3">
                                        <q-item-side>
                                            {{ index + 1 }}
                                        </q-item-side>
                                    </div>
                                    <div class="col-6">
                                        <q-item-side class="list-item__img">
                                            <img style="width: 35px" :src="coverImageUrl(product)" alt="">
                                        </q-item-side>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8" style="padding-left: 1rem;">
                                {{product.productName}}
                            </div>
                            <div class="col-2" style="padding-left: .5rem;">
                                {{numeral(product.productPrice).format('$0.00')}} Value
                            </div>

                        </div>

                        <div class="row pwyw-list__item items-center" v-for="(product, index) in uniqueFullAccessProducts" :key="product.productID + index + Math.random()" :class="{ 'active': customPriceIsBeatingAvgPrice, 'selected': selectedProduct && selectedProduct.productID == product.productID }"
                            @click="selectProduct(product)">
                            <div class="col-2">
                                <div class="row items-center">
                                    <div class="col-3">
                                        <q-item-side>
                                            <q-icon :name="customPriceIsBeatingAvgPrice ? 'fas fa-unlock' : 'fas fa-lock'" />
                                        </q-item-side>
                                    </div>
                                    <div class="col-3">
                                        <q-item-side>
                                            {{ index + 1 + partialAccessProducts.length }}
                                        </q-item-side>
                                    </div>
                                    <div class="col-6">
                                        <q-item-side class="list-item__img">
                                            <img style="width: 35px" :src="coverImageUrl(product)" alt="">
                                        </q-item-side>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8" style="padding-left: 1rem;">
                                {{product.productName}}
                            </div>
                            <div class="col-2" style="padding-left: .5rem;">
                                {{numeral(product.productPrice).format('$0.00')}} Value
                            </div>

                        </div>
                    </q-list>
                </div>

                <div class="col-lg-6" style="padding: 1.5rem;">

                    <q-list v-if="!owned" class="gt-md" link>
                        <q-item tag="label">
                            <q-item-side>
                                <q-radio v-model="payingCustomPrice" :val="false" />
                            </q-item-side>
                            <q-item-main>
                                <div class="row items-center">
                                    <div class="col-sm-2">
                                        <q-item-tile label><strong>{{numeral(productPreviewData.pwyw_currentAvgPrice || productPreviewData.pwyw_startingPrice).add(0.01).format('$0.00')}}</strong></q-item-tile>
                                    </div>
                                    <div class="col-sm-10">
                                        <q-item-tile label>Beat The Average Price</q-item-tile>
                                        <q-item-tile sublabel>Beat the average to get all {{ uniqueFullAccessProducts.length + partialAccessProducts.length }} products</q-item-tile>
                                    </div>
                                </div>
                            </q-item-main>
                        </q-item>
                        <q-item tag="label">
                            <q-item-side>
                                <q-radio v-model="payingCustomPrice" :val="true" />
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile label>Pay what you want</q-item-tile>
                                <q-input prefix="$" v-if="payingCustomPrice" v-model="customPrice" type="number" stack-label="Custom amount" class="inputBox" @blur="formatCustomPrice()" />

                                <small class="text-red text-center block" v-if="payingCustomPrice && Number(customPrice) < productPreviewData.pwyw_startingPrice">
                                  This minimum price for this mini bundle is {{numeral(productPreviewData.pwyw_startingPrice).format('$0.00')}}.<br>
                                  To get the full bundle, you must at least beat the average price!
                                </small>
                                <small class="text-red text-center block" v-if="customPrice !== null && customPrice >= productPreviewData.pwyw_startingPrice && customPrice < productPreviewData.pwyw_currentAvgPrice">
                                  You will not unlock the full bundle unless you beat {{numeral(productPreviewData.pwyw_currentAvgPrice).format('$0.00')}}!
                                </small>
                            </q-item-main>
                        </q-item>
                    </q-list>

                    <div class="sale-interval text-black" align="right">
                        <q-icon name="fa-clock" /> Ending in: {{saleInterval}}
                    </div>

                    <div v-if="productIsInShop" class="col-md-12 col-xl-6">
                        <div class="gt-sm">
                            <q-btn size="lg" v-if="!owned && !inCart" :disable="disableAddToCart" @click="add2cart" id="add2cart" color="green" class="full-width margin-top" icon="fa-cart-plus">
                                <h6>Add To Cart</h6>
                            </q-btn>

                            <q-btn size="lg" v-if="inCart && !owned" @click="removeFromCart" id="removeFromCart" color="red" class="full-width margin-top" icon="fa-times">
                                <h6>Remove From Cart</h6>
                            </q-btn>

                            <q-btn size="lg" v-if="owned" color="purple" class="full-width margin-top" icon="fa-check-circle" @click="">
                                <h6>Owned</h6>
                            </q-btn>

                            <div v-if="!productIsInShop && environmentProductAndTagState === 'fetched'" class="full-width" align="center">
                                <h6>This product is not available for purchase.</h6>
                            </div>
                        </div>

                        <div class="scroll" style="margin-top: 1rem; max-height: 30rem;">
                            <h5 style="margin: .5rem 0;">Leaderboard</h5>

                            <q-list v-if="leaderBoardData && leaderBoardData.length > 0" class="pwyw-list pwyw-leaderboard" striped-odd>
                                <q-item v-for="(person, index) in leaderBoardData" :class="{ 'pwyw-list__first-place': index === 0 }" :key="person.name" separator>
                                    <q-item-side>
                                        <div class="circled-number" style="background-color: rgb(40, 82, 131); color: white;">
                                            {{ index + 1 }}
                                        </div>
                                    </q-item-side>
                                    <q-item-main>
                                        {{ person.firstName }} {{ person.lastName }}
                                    </q-item-main>
                                    <q-item-side>
                                        {{numeral(person['amount paid']).format('$0.00')}}
                                    </q-item-side>
                                </q-item>
                            </q-list>
                        </div>

                        <div class="product-preview" style="margin-top: 2rem;">
                            <div class="navigation">
                                <div class="row items-center">
                                    <div class="col-sm-6">
                                        <h5>Product Details</h5>
                                    </div>
                                    <div class="col-sm-6 text-right">
                                        <q-btn icon="fa-angle-left" @click="selectPrevProduct(selectedProductIndex)" v-if="selectedProductIndex > 0" style="padding: .5rem;" />
                                        <span style="margin: .5rem;">{{selectedProductIndex + 1}} of {{partialAccessProducts.length + uniqueFullAccessProducts.length}}</span>
                                        <q-btn icon="fa-angle-right" @click="selectNextProduct(selectedProductIndex)" v-if="selectedProductIndex < partialAccessProducts.length + uniqueFullAccessProducts.length - 1" style="padding: .5rem;" />
                                    </div>
                                </div>
                                <product-details v-if="selectedProduct" :productDetailsData="selectedProduct" :hideClose="true" :allowPurchase="false" style="margin-top: 1rem;"></product-details>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import productCard from "../../common/productCard/productCard"
    import giftDetail from "../../common/shop/giftDetail"
    import productDetails from "../../common/shop/productDetails"

    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ["componentData"],

        components: {
            productCard,
            giftDetail,
            productDetails
        },

        mixins: [productPreviewTools, globalComputedData],

        data() {
            return {
                videoID: "",
                showGift: "",
                relatedProducts: "",
                partialAccessProductsTemp: [],
                fullAccessProducts: [],
                payingCustomPrice: false,
                customPrice: null,
                selectedProduct: null,
                howItWorksHTML: howItWorksHTML,
                leaderBoardData: null,

                coverImageUrl(product) {
                    return `https://vault.platformpurple.com/static/previews/${product.productSKU}/${product.productSKU}_image_cover.png`
                }
            }
        },

        computed: {
            disableAddToCart() {
                return this.payingCustomPrice && Number(this.customPrice) < Number(this.productPreviewData.pwyw_startingPrice)
            },

            selectedProductIndex() {
                const partialIndex = this.partialAccessProducts.findIndex(
                    item => item.productID === this.selectedProduct.productID
                )
                const fullIndex = this.uniqueFullAccessProducts.findIndex(
                    item => item.productID === this.selectedProduct.productID
                )
                if (partialIndex > -1) {
                    return partialIndex
                }
                return this.partialAccessProducts.length + fullIndex
            },

            customPriceIsBeatingMinPrice() {
                return (
                    this.payingCustomPrice &&
                    this.customPrice !== null &&
                    Number(this.customPrice) >= Number(this.productPreviewData.pwyw_startingPrice)
                )
            },

            saleInterval() {
                const [number, type] = this.productPreviewData.pwyw_saleInterval.split(" ")
                const now = this.moment(new Date()) //todays date
                const end = this.moment(this.productPreviewData.pwyw_saleStartDate).add(
                    number,
                    `${type.toLowerCase()}s`
                ) // another date
                const duration = this.moment.duration(end.diff(now))
                const days = duration.asDays()
                if (days < 1) {
                    const hours = duration.asHours()
                    return `${Math.ceil(hours)} hours`
                }
                return `${Math.ceil(days)} days`
            },

            pwywBundleProductsValue() {
                return this.customPriceIsBeatingAvgPrice ?
                    this.fullAccessProducts
                        .concat(this.partialAccessProducts)
                        .reduce((totalVal, product) => {
                            return totalVal + parseFloat(product.productPrice)
                        }, 0)
                    : this.customPriceIsBeatingMinPrice ?

                    this.partialAccessProducts
                        .reduce((totalVal, product) => {
                            return totalVal + parseFloat(product.productPrice)
                        }, 0)
                    : 0
            },

            customPriceIsBeatingAvgPrice() {
                return (
                    this.customPrice >=
                    parseFloat(
                        this.productPreviewData.pwyw_currentAvgPrice || this.productPreviewData.pwyw_startingPrice
                    ) +
                    0.01 || !this.payingCustomPrice
                )
            },

            payingPrice() {
                return this.payingCustomPrice ?
                    this.customPrice :
                    parseFloat(
                        this.productPreviewData.pwyw_currentAvgPrice || this.productPreviewData.pwyw_startingPrice
                    ) + 0.01
            },

            productTags() {
                let productTagReturn = null

                if (this.environmentTags && this.productPreviewData.tags) {

                    productTagReturn = []

                    var productTagNames = this.productPreviewData.tags
                        .split(",")
                        .map(tagID => {

                            return this.environmentTags[tagID] ?
                                this.environmentTags[tagID].tagName :
                                false
                        })
                    productTagNames.forEach(tagName => {
                        if (tagName && !productTagReturn.includes(tagName)) {
                            productTagReturn.push(tagName)
                        }
                    })
                }

                return productTagReturn
            },

            productIsInShop() {
                var available = false
                var product = this.environmentProducts && this.environmentProducts.length ? this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productID2Preview)) : false
                if (product && product.available4Sale) available = true
                return available
            },

            owned() {
                var active = false
                var product = this.environmentProducts && this.environmentProducts.length ? this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productID2Preview)) : false
                if (product && product.userActiveProduct) active = true
                return active
            },

            inCart() {
                var product = this.productPreviewData
                var inCart = false
                this.cart.forEach(item => {
                    if (item.productID == product.productID && !item.recipientName) {
                        inCart = true
                    }
                })
                if (product.recipientName) inCart = false
                return inCart
            },

            productPreviewModalOpen() {
                return this.$store.state.productPreviewModalOpen
            },

            // partial access products must be only from full access products
            partialAccessProducts() {
                return this.partialAccessProductsTemp.filter(p => this.fullAccessProducts.find(prod => prod.productID === p.productID))
            },

            uniqueFullAccessProducts() {
                let productNotInPartialAccessProducts = product =>
                    !this.partialAccessProducts.some(
                        partialAccessProduct =>
                        partialAccessProduct.productID === product.productID
                    )
                return this.fullAccessProducts.filter(productNotInPartialAccessProducts)
            }
        },

        methods: {
            formatCustomPrice() {
                k('format custom price: ', this.customPrice)
                this.customPrice = Number(this.customPrice).toFixed(2)
            },

            selectPrevProduct(currentIndex) {
                let nextProduct = this.partialAccessProducts[currentIndex - 1]
                if (!nextProduct) {
                    nextProduct = this.uniqueFullAccessProducts[
                        currentIndex - 1 - this.partialAccessProducts.length
                    ]
                }
                this.selectedProduct = nextProduct
            },

            selectNextProduct(currentIndex) {
                let nextProduct = this.partialAccessProducts[currentIndex + 1]
                if (!nextProduct) {
                    nextProduct = this.uniqueFullAccessProducts[
                        currentIndex + 1 - this.partialAccessProducts.length
                    ]
                }
                this.selectedProduct = nextProduct
            },

            openGift() {
                this.showGift = !this.showGift
                document.getElementById(this.videoID).pause()
            },

            add2cart() {
                if (this.inCart) {
                    k("already in cart")
                    return false
                }

                if (!this.productIsInShop) {
                    this.$q.notify({
                        message: "This product is not available for purchase.",
                        type: "negative",
                        icon: "fa-exclamation-circle",
                        position: "bottom-left"
                    })
                    return false
                }

                var logEventObj = {
                    eventType: "pwywBid",
                    userEmail: this.userInfo.userEmail,
                    userID: this.userInfo.userID,
                    eventDesc: `User bid $${this.payingPrice} for product ${
                          this.productPreviewData.productName
                        }`,
                    productID: this.productID2Preview,
                    bidPrice: Number(this.payingPrice),
                    currentAvgPrice: Number(this.productPreviewData.pwyw_currentAvgPrice) || Number(this.productPreviewData.pwyw_startingPrice)
                }

                this.api.sendEvent(logEventObj, res => {
                    kw("pwyw bid res", res)

                    if (res.success) {
                        if (!this.environmentJSON.e.hideNotifyAddCart) {
                            this.$q.notify({
                                message: 'Added product to cart!',
                                type: 'positive',
                                icon: 'fa-check-circle',
                                position: 'bottom-left'
                            })
                        }

                        if (this.productPreviewModalOpen) {
                            this.$root.$emit("closeProductPreview")
                            this.$root.$on("closedProductPreview", () => {
                                this.$root.$off("closedProductPreview")
                                this.$root.$emit("openShopCart")
                            })
                        }
                        else {
                            this.$root.$emit("openShopCart")
                        }

                        var productInfo = this.j_.queryArrayFirstMatch(
                            this.environmentProducts,
                            "productID",
                            Number(this.productID2Preview)
                        )

                        productInfo.pwywBid = {
                            productID: this.productID2Preview,
                            bidID: res.body._id,
                            pwywPrice: Number(this.payingPrice)
                        }

                        productInfo.pwywPrice = this.payingPrice

                        this.$store.commit("add2cart", productInfo)
                    }
                })
            },

            removeFromCart() {
                this.$store.commit("removeFromCart", this.productPreviewData)
                this.$q.notify({
                    message: "Removed product from cart!",
                    type: "positive",
                    icon: "fa-check-circle",
                    position: "bottom-left"
                })
            },

            getPartialAccessProducts() {
                this.api.get(
                    this.api.apiv4Route +
                    "api/productBundle/componentProductsMetadata?productID=" +
                    this.productPreviewData.pwyw_partialAccessProductID,
                    res => {
                        kw("partial access product res", res)
                        if (res.products) {
                            this.partialAccessProductsTemp = res.products
                            this.selectedProduct = res.products[0]
                        }
                    }
                )
            },

            getFullAccessProducts() {
                this.api.get(
                    this.api.apiv4Route +
                    "api/productBundle/componentProductsMetadata?productID=" +
                    this.productPreviewData.pwyw_fullAccessProductID,
                    res => {
                        kw("full access product res", res)
                        if (res.products) {
                            this.fullAccessProducts = res.products
                            if (!this.selectProduct) {
                                this.selectedProduct = res.products[0]
                            }
                        }
                    }
                )
            },

            selectProduct(product) {
                this.selectedProduct = product
            },

            getLeaderBoardData() {
                kw("getLeaderBoardData ran")
                let req = {
                    environment: this.environmentData.environmentName,
                    productID: this.productID2Preview,
                    limit: 5
                }

                this.api.post(
                    this.api.apiv4Route + "api/reports/pwywLeaderboard",
                    req,
                    res => {
                        k('leaderBoardData res: ', res)
                        this.leaderBoardData = res.data
                    }
                )
            }
        },

        watch: {
            productID2Preview() {
                kw("productID2Preview: ", this.productID2Preview)
                if (this.productID2Preview) {
                    this.getPartialAccessProducts()
                    this.getFullAccessProducts()
                }
            },

            environmentProducts() {
                if (this.productPreviewData) this.generateRelatedProducts(this.productPreviewData)
            },

            payingCustomPrice(value) {
                if (!value) {
                    this.customPrice = null
                }
            }
        },

        mounted() {
            kw("productID2Preview init: ", this.productID2Preview)
            if (this.productID2Preview) {
                this.getLeaderBoardData()
                this.getPartialAccessProducts()
                this.getFullAccessProducts()
            }

            this.$root.$on("closeGiftDetail", () => {
                this.showGift = false
            })

            kw("pwyw product: ", this.productPreviewData)
        },

        beforeDestroy() {
            this.$store.commit("setProductPreviewData", "")
            this.$store.commit("setProductID2Preview", "")
        }
    }

    const howItWorksHTML = `
        <div class="row full-width">
            <h5>Win no matter what you bid</h5>
        </div>

        <div class="row full-width">
            <div class="col-sm-1 col-xs-2" style="width: 500px;">
                <div class="q-chip row no-wrap inline items-center bg-grey-5 text-white">1</div>
            </div>
            <div class="col-sm-11 col-xs-10" style="padding-left: .5rem;">
                <p style="font-size: .8rem;">Any bid: if it's below the average bid, you're not going home empty handed</p>
            </div>
        </div>

        <div class="row full-width">
            <div class="col-sm-1 col-xs-2">
                <div class="q-chip row no-wrap inline items-center bg-grey-5 text-white">2</div>
            </div>
            <div class="col-sm-11 col-xs-10" style="padding-left: .5rem;">
                <p style="font-size: .8rem;">Competitive bid: if it's above the average bid, you get the whole collection</p>
            </div>
        </div>

        <div class="row full-width">
            <div class="col-sm-1 col-xs-2">
                <div class="q-chip row no-wrap inline items-center bg-grey-5 text-white">3</div>
            </div>
            <div class="col-sm-11 col-xs-10" style="padding-left: .5rem;">
                <p style="font-size: .8rem;">Winner's bid: if it's the top price, you get the collection, featured on the Top 10 Scoreboard and entered into a raffle of incredible goodies</p>
            </div>
        </div>
    `
</script>

<style scoped>
    .bundle-description>>>p {
        margin-bottom: 0px;
    }

    .sale-interval {
        padding: 15px 0;
        border-bottom: 1px solid #e0e0e0;
    }

    .padded {
        padding: 0.5rem;
    }

    .margin-top {
        margin-top: 15px;
    }

    .video-js {
        height: 50vh;
    }

    .pchip {
        background: #fff;
        color: #000;
        font-size: 0.8rem;
        margin: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.2rem;
        width: fit-content;
    }

    .pwyw-list {
        padding: 0px;
    }

    .pwyw-list .pwyw-list__item {
        cursor: pointer;
        padding-top: 1px;
        padding-bottom: 1px;
    }

    .pwyw-list .pwyw-list__item.active {
        background-color: #fff;
    }

    .pwyw-list .pwyw-list__item {
        font-size: 13px;
    }

    .pwyw-list .pwyw-list__item .q-item-label {
        padding-left: 25px;
    }

    .list-item__img>img {
        height: 35px;
        border-radius: 100%;
        margin-top: 5px;
        margin-left: 10px;
    }

    .pwyw-list__item {
        opacity: .5;
    }

    .pwyw-list__item.active {
        opacity: 1;
    }

    .pwyw-list .pwyw-list__item.selected {
        background-color: #426bb4;
        color: white;
    }

    .pwyw-list__item.selected .q-item-side.q-item-section.q-item-side-left,
    .pwyw-list__item.selected .fa-unlock.q-item-icon {
        color: #fff !important;
    }

    .pwyw-list .pwyw-list__total {
        background-color: black;
    }

    .pwyw-list .pwyw-list__total .q-item-section {
        color: #fff;
    }

    .pwyw-list.q-list-striped>.pwyw-list__item.q-item:nth-child(even):not(.selected),
    .q-list-striped-odd>.q-item:nth-child(odd):not(.selected) {
        background-color: #f6f6f6;
    }

    .pwyw-list .pwyw-list__first-place {
        padding-bottom: 20px;
    }

    .pwyw-list .pwyw-list__first-place .q-item-main {
        font-weight: 600;
    }

    .pwyw-list.pwyw-leaderboard .q-item-main {
        margin-left: 30px;
    }

    .pwyw-list .circled-number {
        border-radius: 100%;
        background-color: #f6f6f6;
        color: #333;
        width: 30px;
        height: 30px;
        text-align: center;
        padding-top: 3px;
        margin-left: auto;
        margin-right: auto;
    }

    .pwyw-list .q-item-side-left {
        text-align: center;
    }

    .pwyw-list.pwyw-how-it-works .q-item {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .pwyw-list.pwyw-how-it-works .q-item-main {
        margin-left: 30px;
    }

    .bundle-description {
        margin-bottom: 0px;
    }

    @media screen and (max-width: 768px) {
        .sm-centered {
            display: block;
            margin: 0 auto 1.5rem;
        }
        h3 {
            line-height: 1.2;
        }
        .pwyw-list__item .items-center>div:nth-child(2) {
            display: none;
        }
        .pwyw-list__item {
            position: relative;
            padding-right: 3rem;
        }
        .pwyw-list__item .items-center>div:first-child {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(0, -50%);
            display: inline-block;
            width: auto;
            text-align: right;
        }
        .pwyw-list .q-item-side-left {
            text-align: left;
        }
        .pwyw-list .q-item-side>img {
            /*width: auto !important;*/
            /*max-width: 80px;*/
            /*height: auto;*/
            /*margin: 1rem 0;*/
        }
        .pwyw-list .pwyw-list__item .q-item-label {
            padding-left: 0;
        }

        .pwyw-list .q-item-main .q-item-label {
            margin-bottom: 0.5rem;
            font-size: 1rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .pwyw-list .item-price {
            font-weight: bold;
            margin-bottom: 1rem;
        }
    }
</style>
