<template>
    
    <div>
        <div class="row full-width">
            <div class="col full-width">
                <heroUnit :componentData="heroUnitComponentData" />
            </div>
        </div>

        <div class="row" :style="'max-width: 1200px; margin: 0 auto;' + (windowWidth > 767 ? 'padding: 1rem;' : '')"> <!--under header -->
        
            <div class="col-sm-12 col-lg-7" style="padding: 1rem;">
                
                <div>
                    <img
                        src="https://vault.platformpurple.com/static/clients/mypvolve/giltcityLogo.png"
                        style="max-width: 70%;"
                    />
                </div>
                
                <div class="monty thickHeader" style="font-size: 3.40241rem; color: rgb(245, 152, 118); letter-spacing: -2px;">
                    VIP STREAMING ACCESS
                </div>
                
                <div class="monty" style="color: #777; line-height: 2rem; margin-top: 1rem;">
                    <p style="font-size: 1rem;">We're so excited to give friends of Gilt City special access to P.'s online streaming workouts. We're dedicated to helping you achieve your fitness dreams with our revolutionary pre-hab approach, which is proven to create long, lean bodies and lifted booties. Our workouts are accessible any time, anywhere, with our streaming program designed to support you every step of your fitness evolution.</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Unlimited access to all streaming workouts</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Stream on any device</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />New weekly workouts</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />The ability to set up workout goals and track your progress</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Weekly progress reports</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Custom workout reminders</p>
                </div>
                
            </div>
    
            <div class="col-sm-12 col-lg-5" style="padding: 1rem;"> <!--left block -->

                <signUpOfferOld 
                    v-if="localOfferProductID"
                    :offerProductID="localOfferProductID" 
                    :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                    :completeSignUpComponentData="completeSignUpComponentData" 
                    :buttonColor="pvolveSalmon" 
                    :signUpBackgroundColor="'#FFF1F0'" 
                    :subscribeRoute="subscribeRoute"
                    subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                    @userHasAccess="route('/library')"
                />
              
            </div>
    
        </div>

    </div>
      
</template>

<script>
    // import testimonialCarousel from '../../common/testimonialCarousel.vue'
    import signUpOfferOld from '../../common/showcase/signUpOfferOld.vue'
    import heroUnit from '../../common/showcase/heroUnit.vue'
    import pvolveFooter from './pvolveFooter.vue'
    
    import { designTools } from '../../../mixins/designTools'
    import { pvolveColors } from './pvolveColors'
    import { impactTools } from './impactTools'
    
    export default {
        props: ['componentData'],
        components: {
            // testimonialCarousel,
            signUpOfferOld,
            heroUnit,
            pvolveFooter
        },

        data() {
            return {
                footerData: '',

                // productIDsToCheck: ['149001', '148014', '149297', '149320', '149461'],
                localOfferProductID: null,
                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Step 2: Enter your VIP access code',
                    componentName: 'ActivateForm',
                    addToMailingList: true,
                    productInfo: '',
                    loadHook: 'addProductInfoToCompleteSignUpComponentData',
                    submitButtonLabel: 'Apply code',
                    noToast: true
                },
                
                heroUnitComponentData: {
                    backgroundImageURL: 'mypvolve/PLV003-17-PP_Bannerimages_Short_SignUp.jpg',
                    padding: '3rem',
                    textColor: '#fff',
                    heroTitle: "<h1 class='thickHeader' style='margin: 0;'>welcome to p.volve!</h1>"
                }
            }
        },
        
        mixins: [pvolveColors, designTools, impactTools],

        computed: {
            environmentJSON() {
                return this.$root.$store.state.environment.json
            },
            
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
            
            userInfo() {
                return this.$root.$store.state.user.info
            },
            
            offerProductID() {
                return this.$root.$store.state.offerProductID
            },
        },

        methods: {
            initPurchaseSuccessHandler() {
                this.$root.$off('purchaseSuccess')
                
                this.$root.$on('purchaseSuccess', (res) => {
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
        
        mounted() {
            k('offerProductID: ', this.offerProductID)
            
            if (!this.offerProductID) {
                // no productID to use
                // this.$store.commit('addKeyPathInStore', { keyPath: 'offerProductID', value: String(148014) })
                this.localOfferProductID = 148014
            } else {
                this.localOfferProductID = this.offerProductID    
            }
            
            k('localOfferProductID: ', this.localOfferProductID)
            
            this.initPurchaseSuccessHandler()
            
            if (this.environmentJSON) {
                k('environmentJSON init: ', this.environmentJSON)
                this.footerData = this.$root.homePageSectionFromID('footer')
                k('footerData init: ', this.$root.homePageSectionFromID('footer'))
            }
        }
    }
</script>

<style>
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
</style>