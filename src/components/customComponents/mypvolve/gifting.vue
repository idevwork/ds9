<template>
    
    <div>
        <div :style="`background: ${componentData.backgroundColor || '#fff'};`">
            <div id="hero" v-if="windowWidth > 767" class="row" :style="heroStyle">
                
                <div id="headerColor" class="well">
                    <div style="margin: 1rem 0; max-width: 420px; position: relative;">
                        <div v-html="theGiftHeader"></div>
                    </div>
                </div>
            </div>
                
            <div id="hero" v-else class="row">
                <div style="margin: -5px auto;">
                    <img class="angled" :src="mobileHeroImageSrc" style="max-width: 100%;" />
                    <div class="" style="background: #FEF8F5; padding: 6rem 1rem 3rem 1rem; margin-top: -4rem;">
                        <div align="center" style="max-width: 420px; margin: 0 auto; position: relative;">
                            <div v-html="theGiftHeader"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="giveGift"> <!--under header -->
    
            <div v-if="!currentProductToAddToGiftBox && !giftAdded" class="row relative-position">
                <div class="col-12 monty bg-grey-1" align="center" style="padding: 1rem;">
                    <h2 :style="`margin: 1rem 0; text-transform: none; color: ${pvolveSalmon};`">Included in all plans:</h2>
                    
                    <div class="row well">
                        <!--<q-list-header>What they get:</q-list-header>-->
                        <q-item class="col-xs-12 col-sm-6 col-md-4" align="center" v-for="benefit in benefits" :key="benefit">
                            <q-item-side>
                                <q-icon name="fas fa-check" :style="`color: ${pvolveMintTitle};`" />
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>
                                    {{ benefit }}
                                </q-item-tile>
                            </q-item-main>
                        </q-item>
                    </div>
                </div>
                
                <div class="col-12 bg-grey-3" style="padding: 3rem 1rem;">
                    <div class="row well">
                        <div v-for="id in giftableProductIDs" :key="id" class="col-sm-12 col-md-6 col-lg-3 col-xl" style="padding: .5rem;">
                            
                            <div class="bg-white shadow-2" align="center">
                                <div style="padding: .7rem; color: #fff; background: #999;">
                                    <h2 class="thinHeader" style="text-transform: unset; margin: .7rem 0 0 0;">{{giftNames[id]}}</h2>
                                    <h5 class="text-grey-4":style="'font-size: ' + adaptiveFontSize(.8) + 'rem;'">membership</h5>
                                </div>
                                <div class="relative-position" style="padding: 1rem;">
                                    <p class="text-grey-6" style="font-size: .8rem;">unlimited access to all programs and features</p>
                                    <h4 class="thinHeader" style="margin: .5rem 0 0 0;">${{giftableProduct(id).productPrice}} <span v-if="discountedPrice[id]" style="text-decoration: line-through; color: #777; margin-left: .5rem;">${{discountedPrice[id]}}</span></h4>
                                </div>
                                <div class="row full-width justify-center">
                                    <div class="col-4" style="padding: 0 0 1rem 0;">
                                        <q-btn round size="xl" icon="fas fa-gift" color="grey-5"/>
                                    </div>
                                    <div class="col-12" style="padding: 1rem;">
                                        <q-btn flat size="lg" @click="addProductToGiftBox(id)" class="col-12 full-width" :style="`padding: .7rem; color: #fff; background: ${pvolveMintTitle};`">
                                            <h6 class="thickHeader text-white" style="font-size: .8rem; letter-spacing: 3px;">give this gift</h6>
                                        </q-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
            <div v-if="currentProductToAddToGiftBox" class="row relative-position">
                <div class="col-12" style="padding: 1rem;">
                    <q-btn flat class="bg-grey-3" @click="removeGiftBox(), currentProductToAddToGiftBox = ''">
                        <q-icon name="fas fa-chevron-left" style="margin-left: 0;" />
                        <h6>back</h6>
                    </q-btn>
                
                    <h2 align="center" :style="`margin: 1rem 0; text-transform: none; color: ${pvolveSalmon};`">{{giftAdded ? 'Review' : 'Enter'}} Gift Details</h2>
                    
                    <p align="center" class="monty" style="font-size: .9rem; margin: .5rem 0;">{{giftAdded ? 'Click the edit button if you need to make a change.' : 'Enter in someone\'s name and email who you would like to gift this.'}}</p>
                </div>
                
                <div class="col-12 bg-grey-3">
                    <div class="row well">
                        <div v-if="!giftAdded && currentProductToAddToGiftBox" class="col-12" style="padding: .5rem;">
                            <giftEdit :saveButtonText="'Save and Check Out'" :hideGiftProducts="true" :currentGiftBox="currentGiftBox" :currentGiftBoxProducts="currentGiftBoxProducts" :currentProductToAddToGiftBox="currentProductToAddToGiftBox" :singleGiftItem="singleGiftItem" :notEditable="notEditable" :inlineForm="inlineForm" :saveTheBox="saveTheBox" @closeEditGiftBox="saveGiftBox" :noToast="true" />
                        </div>
                        
                        <div v-if="giftAdded" class="col-12 row" style="padding: .5rem;">
                                
                            <div :class="`col-sm-12 col-md-6 row ${windowWidth < 768 ? 'justify-center' : 'justify-end'}`" style="padding: .5rem;">
                                <div v-for="(product, index) in currentGiftBoxProducts" :class="singleGiftItem ? '' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2'">
                                    
                                    <div class="bg-white shadow-2" align="center">
                                        <div style="padding: .7rem; color: #fff; background: #999;">
                                            <h2 class="thinHeader" style="text-transform: unset; margin: .7rem 0 0 0;">{{giftNames[product.productID]}}</h2>
                                            <h5 class="text-grey-4":style="'font-size: ' + adaptiveFontSize(.8) + 'rem;'">membership</h5>
                                        </div>
                                        <div class="relative-position" style="padding: 1rem;">
                                            <p class="text-grey-6" style="font-size: .8rem;">unlimited access to all programs and features</p>
                                            <h4 class="thinHeader" style="margin: .5rem 0 0 0;">${{giftableProduct(product.productID).productPrice}} <span v-if="discountedPrice[product.productID]" style="text-decoration: line-through; color: #777; margin-left: .5rem;">${{discountedPrice[product.productID]}}</span></h4>
                                        </div>
                                        <div class="row full-width justify-center">
                                            <div class="col-4" style="padding: 0 0 1rem 0;">
                                                <q-btn round size="xl" icon="fas fa-gift" color="grey-5"/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div class="col-sm-12 col-md-6 row" :align="windowWidth < 768 ? 'center' : 'left'" style="padding: .5rem;">
                                
                                <div class="col-xs-12" style="padding: .5rem;">
                                    <h6 style="font-size: .8rem;">To:</h6>
                                    <p style="margin: 0;">{{currentGiftBox.recipientName}}</p>
                                </div>
                                <div class="col-xs-12" style="padding: .5rem;">
                                    <h6 style="font-size: .8rem;">Email:</h6>
                                    <p style="margin: 0;">{{currentGiftBox.recipientEmail}}</p>
                                </div>
                                <div class="col-xs-12" style="padding: .5rem;">
                                    <h6 style="font-size: .8rem;">Your Name:</h6>
                                    <p style="margin: 0;">{{currentGiftBox.giftGiverFrom}}</p>
                                </div>
                                <div class="col-xs-12" style="padding: .5rem;">
                                    <h6 style="font-size: .8rem;">When:</h6>
                                    <p style="margin: 0;">{{moment(currentGiftBox.sendWhen).format('M/DD/YY')}}</p>
                                </div>
                                <div class="col-xs-12" style="padding: .5rem;">
                                    <h6 style="font-size: .8rem;">Message:</h6>
                                    <p style="margin: 0;">{{currentGiftBox.giftMessage}}</p>
                                </div>
                                    
                            </div>
                            
                            <div class="col-12" style="padding: .5rem 0;" align="center">
                                <q-icon name="fa-check" color="green" /> SAVED  
                            </div>
                            
                            <div class="col-12" style="padding: .5rem 0;" align="center">
                                <q-btn flat @click="removeGiftBox()" size="sm" :style="'background: ' + pvolveMintTitle + '; color: #fff;'">
                                    <q-icon name="fa-pencil-alt" style="margin-left: 0;" />
                                    <h6 style="font-size: .8rem;">Edit Gift</h6>
                                </q-btn>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div v-if="giftAdded" style="margin-bottom: 3rem;">

                <h6 align="center" style="margin: 2rem 0;">Continue with checkout:</h6>
                
                <div style="max-width: 500px; margin: 0 auto;">
                    <signUpOffer
                        :giftCheckout="giftCheckout" 
                        :offerProductID="offerProductID" 
                        :completeSignUpComponentData="completeSignUpComponentData" 
                        :buttonColor="pvolveSalmon"
                        :signUpBackgroundColor="'rgba(0,0,0,0)'"
                        :newUserSubHeader="'Use your email and create a password to give your gift.'"
                        :subscribeRoute="subscribeRoute" 
                        
                        :userEmailProp="userEmailInput"
                        :showCompleteSignUp="showCompleteSignUp"
                        
                        subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                        
                        @userHasAccess="showCompleteSignUp = true"
                        @userPreviouslyOwned="showCompleteSignUp = true"
                        @userNeedsToCheckout="showCompleteSignUp = true"
                    />
                </div>
                
            </div>
    
        </div>

    </div>
      
</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    import giftEdit from '../../common/shop/giftEdit.vue'
    
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { pvolveColors } from './pvolveColors'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    import { impactTools } from './impactTools'
    
    export default {
        props: ['componentData'],
        
        components: {
            signUpOffer,
            giftEdit
        },
        
        mixins: [globalComputedData, pvolveColors, designTools, impactTools, pvolveSignUpTools],
        
        data() {
            return {
                giftableProductIDs: [148014, 149461, 149297, 149320],
                
                giftNames: {
                     148014: "1 Month",
                     149461: "3 Months",
                     149297: "6 Months",
                     149320: "1 Year",
                },
                
                discountedPrice: {
                     148014: "",
                     149461: "",
                     149297: "179.94",
                     149320: "359.88",
                },          
                
                chipText: {
                     148014: "",
                     149461: "",
                     149297: "most popular",
                     149320: "best value",
                },
                
                benefits: [
                    'P’s method tutorials',
                    'hundreds of workout videos',
                    '3 to 30 day programs that work',
                    'personalized workout calendar',
                    'progress tracking',
                    'much much more!'
                ],
                
                
                giftableProduct(productID) {
                    return this.environmentProducts ? this.environmentProducts.find(product => {
                        return productID === product.productID
                    }) : ''
                },
                
                giftAdded: false,
                saveTheBox: false,
                showCompleteSignUp: false,

                offerProductID: null,
                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Payment information',
                    componentName: 'PvolveCreditCardForm',
                    componentPath: 'mypvolve/PvolveCreditCardForm',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    submitButtonLabel: 'Submit',
                    noToast: true
                },
                
                heroUnitComponentData: {
                    backgroundImageURL: 'mypvolve/PLV003-17-PP_Bannerimages_Short_SignUp.jpg',
                    padding: '3rem',
                    textColor: '#fff',
                    heroTitle: "<h1 class='thickHeader' style='margin: 0; letter-spacing: .01rem;'>give the gift of feeling good!</h1>"
                },
                
                currentGiftBox: {
                    recipientName: '',
                    recipientEmail: '',
                    sendWhen: new Date(),
                    giftMessage: '',
                    giftGiverFrom: ''
                },
                
                giftCheckout: true,
                currentGiftBoxProducts: '',
                currentProductToAddToGiftBox: '',
                singleGiftItem: true,
                notEditable: true,
                inlineForm: true
            }
        },

        computed: {
            theGiftHeader() {
                return `<h2 style="margin-top: 1rem;">Give the gift of</h2>
                        <h1 class="thickHeader" style="color: ${ this.pvolveSalmon };">FIT & FABULOUS</h1>
                        <h4 style="margin-top: 1rem; text-transform: none;">Send the gift of transformation to someone special.</h4>`
            },

            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/mypvolve/Pvolve-Streaming-Signup.png'
            },
                
            mobileHeroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/mypvolve/PLV133-18-Trial-Landing_VIP_3.png'
            },
            
            heroTitleStyle() {
                return `color: ${this.componentData.textColor}; ${this.componentData.textShadow ? `text-shadow: 0px 0px 10px ${this.componentData.textShadow};` : ``} ${this.windowWidth < 768 ? `font-size: 2rem;` : ''}`
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += "background: url(" + this.heroImageSrc + ");"
                styleStr += this.componentData.headerColor ? "background-color: " + this.componentData.headerColor + "; " : ""
                styleStr += `background-position: ${this.windowWidth > 1200 ? '50% 50%' : this.windowWidth > 992 ? '35% 50%' : '0% 50%'};`
                styleStr += "background-size: " + (this.componentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.componentData.heroHeight ? "height: " + this.componentData.heroHeight + "; " : ""
                styleStr += this.componentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: " + (this.windowWidth > 992 && !this.showGeoBlock ? "4rem 3rem" : "8rem 2rem") + ";"
                // k('styleStr: ', styleStr)
                return styleStr
            }
        },

        methods: {
            
            addProductToGiftBox(productID) {
                this.currentProductToAddToGiftBox = this.environmentProducts.find((product) => {
                    return product.productID === productID
                })
                this.currentGiftBoxProducts = [this.currentProductToAddToGiftBox]
                this.giftAdded = false
                
                this.$nextTick(() => {
                    this.scrollIt('giveGift', false, 50)
                })
            },
            
            saveGiftBox() {
                k('currentGiftBox: ', this.currentGiftBox)
                
                this.localStorage.set('pvolveSubscriptionGiftBox', this.currentGiftBox)
                this.giftAdded = true
            },
            
            removeGiftBox() {
                this.$store.commit('clearCart')
                this.localStorage.set('pvolveSubscriptionGiftBox', '')
                this.saveTheBox = false
                this.giftAdded = false
            },
            
            initPurchaseSuccessHandler() {
                this.$root.$off('purchaseSuccess')
                
                this.$root.$on('purchaseSuccess', (res) => {
                    k('subway purchase success!')
                    
                    this.localStorage.set('pvolveSubscriptionGiftBox', '')
                    
                    this.trackImpactSale()
                    
                    this.$root.$off('purchaseSuccess')
                })
            }
        },
        
        watch: {
            environmentJSON() {
                k('environmentJSON watch: ', this.environmentJSON)
                this.footerData = this.$root.homePageSectionFromID('footer')
                k('footerData watch: ', this.$root.homePageSectionFromID('footer'))
            }
        },
        
        created() {
            k('offerProductID: ', this.offerProductID)
            
            k('initialParameters: ', this.initialParameters)
            if (this.initialParameters && this.initialParameters.payPalReturnCode) {
                this.giftAdded = true
            } else {
                this.$store.commit('clearCart')
            }
            
            if (this.localStorage.get('pvolveSubscriptionGiftBox')) {
                this.currentGiftBox = this.localStorage.get('pvolveSubscriptionGiftBox')
                // this.giftAdded = true
                this.saveTheBox = true
            }
            
            this.initPurchaseSuccessHandler()
        }
    }
</script>

<style scoped>
    .angled {
        clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
    }    
    
    .angledUp {
        -webkit-clip-path: polygon(0% 10%, 50% 0%, 550% 100%, 0% 100%);
         clip-path: polygon(0% 10%, 50% 0%, 550% 100%, 0% 100%);
    }
    
    .pchip {
        width: fit-content; 
        width: -moz-fit-content;
        /*color: #fff;*/
        /*background: #fff;*/
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
        position: absolute;
        top: .5rem;
        right: .5rem;
    }
    
    .centerList {
        width: fit-content; 
        width: -moz-fit-content;
    }
</style>