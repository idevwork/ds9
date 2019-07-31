<template>
    
    <div>
        
        <div class="row full-width">
            <div class="col full-width">
                <stHeroUnit :componentData="heroUnitComponentData" />
            </div>
        </div>

        <div class="full-width" style="background: #f3f3f3; padding: 2rem; border-top: #ccc 1px solid; border-bottom: #ccc 1px solid;">
            <div align="center" :style="'color: #2881c0; font-weight: 700; font-size: ' + adaptiveFontSize(2) + 'rem;'" class="monty allCaps">Subscribe now and save!</div>
            <div align="center" class="monty" style="padding: 1rem;">
                Get total access to all your favorite Signing Time lessons with Rachel plus a whole lot more!
            </div>
        </div>

        <div class="row" :style="windowWidth > 767 ? 'padding: 1rem;' : ''">

            <div class="col-lg-6 col-md-12 relative-position"> <!--right block -->
                
                <q-inner-loading :visible="!environmentProducts" />
                
                <div v-if="environmentProducts" class="row items-stretch justify-center">
                    
                    <div class="col-sm-6 col-md-4" style="padding: .5rem;">
                        <div :is="'productCard'" class="productCard" :componentData="productFromProductID(offerProductID)" notSelectable="true" />
                    </div>
                    
                    <ol class="col-sm-6 col-md-7 monty" style="color: #777; line-height: 2rem; margin-top: 1rem; padding: 0 2rem;">
                        <li>Enter your email to sign in/sign up</li>
                        <li>Fill in your payment details or use PayPal for your new subscription</li>
                        <li>You will be charged {{currencyFormat(productFromProductID(offerProductID).productPrice)}} a month</li>
                        <li>You will receive an email confirming your subscription</li>
                        <li>Access your new content immediately!</li>
                    </ol>
                </div>
                
            </div>
            
            <div class="col-lg-6 col-md-12" style="padding: 1rem;"> <!--left block -->
            
                <signUpOfferOld 
                    :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                    :offerProductID="offerProductID" 
                    :completeSignUpComponentData="completeSignUpComponentData" 
                    :buttonColor="brandColor" 
                    :signUpBackgroundColor="'#fff'"
                    @userHasAccess="route('/library')"
                />
              
            </div>

        </div>

    </div>
      
</template>

<script>
    import signUpOfferOld from '../../common/showcase/signUpOfferOld.vue'
    import productCard from '../../common/productCard/productCard.vue'
    import stHeroUnit from './stHeroUnit.vue'
    import { designTools } from '../../../mixins/designTools'
    
    export default {
        props: ['componentData'],
        
        components: {
            productCard,
            signUpOfferOld,
            stHeroUnit
        },

        data() {
            return {
                offerProductID: 16008,
                subscribeRoute: '',
                
                heroUnitComponentData: {
                    "id": "hero",
                    "component": "stHeroUnit",
                    "componentPath": "mysigningtime/stHeroUnit.html",
                    "backgroundImageURL": "mysigningtime/img/my-signing-time-hero-image.jpg",
                    "logoURL": "https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/mysigningtime.png",
                    "academyLogoURL": "https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/signingtimeacademy.png",
                    "visibility": {
                        "showcase": true,
                        "subscribeMonthly": true,
                        "subscribeYearly": true
                    }
                },
                
                productFromProductID(id) {
                    // k('productFromProductID ID: ', id)
                    var productFromProductID = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', id)
                    // k('productFromProductID: ', productFromProductID)
                    return productFromProductID
                },
                
                completeSignUpComponentData: {
                    header: 'Step 2: Payment information',
                    // description: 'We ask for payment information so your subscription can continue without interruption at the end of your trial period. An authorization for $1 will appear on your account, but you will not be charged anything during the initial time period. You can easily cancel anytime by clicking “account” in the top bar.',
                    componentName: 'CreditCardForm',
                    loadHook: 'addProductToCart',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    submitButtonLabel: 'Activate Subscription'
                }
            }
        },
        
        mixins: [ designTools ],

        computed: {
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            environmentJSON() {
                return this.$root.$store.state.environment.json
            },
            
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
            
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            }
        },

        methods: {
            selectSub(productID) {
                k('select sub: ', productID)
                this.offerProductID = productID
            }
        },
       
        mounted() {
            
        }
    }
</script>

<style scoped>
    .moLineSpace {
        line-height: 3rem !important;
    }
    .smallHead {
        font-family: 'Montserrat', 'sans-serif';
        font-size: 1.2rem;
        margin: 0;
    }
    .headerBkgd {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/sign-up-now-header-fpo.jpg') no-repeat center center;
        background-position: top;
        -webkit-background-size: contain;
        -moz-background-size: contain;
        -o-background-size: contain;
        background-size: 100vw auto;
        max-width: 100%;
      }
      h1, h2, h3, h4, h5, h6 {
          text-transform: none;
      }
</style>
