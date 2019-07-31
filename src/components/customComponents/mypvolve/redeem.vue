<template>
    
    <div>
        <div class="row full-width">
            <div class="col full-width">
                <heroUnit :componentData="heroUnitComponentData" />
            </div>
        </div>

        <div class="row" :style="'max-width: 1200px; margin: 0 auto;' + (windowWidth > 767 ? 'padding: 1rem;' : '')"> <!--under header -->
        
            <div class="col-sm-12 col-lg-7" style="padding: 1rem;">
                
                <div class="monty thinHeader text-grey-7" :style="'font-size: ' + adaptiveFontSize(2.5) + 'rem; letter-spacing: -2px;'">
                    UNATTAINABLE DEFINITION & TONE
                    <span class="monty thickHeader" :style="'font-size: ' + adaptiveFontSize(2.5) + 'rem; color: ' + pvolveSalmon + ';'">
                        — UNTIL NOW
                    </span>
                </div>
                
                <div class="monty" style="color: #777; line-height: 2rem; margin-top: 1rem;">
                    <p style="font-size: 1rem;">Don't miss out on the workouts trusted by Victoria’s Secret™ models - INSTANTLY ACCESS all of P's workouts for a lifted booty, defined inner/outer thighs and whole body lengthening and tone.</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Unlimited access to all streaming workouts</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Stream on any device</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />New weekly workouts</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />The ability to set up workout goals and track your progress</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Weekly progress reports</p>
                    <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Custom workout reminders</p>
                </div>
                
                <div :style="'border-left: 10px solid ' + pvolveSalmon + '; padding: 1rem 3rem 1rem 2rem;'">
                    <h4 class="thinHeader" :style="'margin-top: 0; letter-spacing: -1px; line-height: 2rem; color: ' + pvolveSalmon + ';'">"... after just a few weeks of training, <span class="thickHeader">butts begin to lift, biceps take form, and abdomen grooves appear"</span></h4>
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/ELLE_Magazine_Logo.svg" style="width: 7rem;" />
                </div>
                
            </div>
    
            <div class="col-sm-12 col-lg-5" style="padding: 1rem;"> <!--left block -->

                <signUpOfferOld 
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
    import { pvolveColors } from './pvolveColors'
    import { designTools } from '../../../mixins/designTools'
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

                localOfferProductID: '',
                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Step 2: Enter your VIP access code',
                    componentName: 'ActivateForm',
                    addToMailingList: true,
                    productInfo: '',
                    loadHook: 'addProductInfoToCompleteSignUpComponentData',
                    submitButtonLabel: 'Apply code'
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