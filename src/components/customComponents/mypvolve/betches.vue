<template>
    
    <div>
        <div class="row full-width">
            <div class="col full-width">
                <heroUnit :componentData="heroUnitComponentData" />
            </div>
        </div>

        <div class="row" :style="'max-width: 1200px; margin: 0 auto;' + (windowWidth > 767 ? 'padding: 1rem;' : '')"> <!--under header -->
        
            <div class="col-sm-12 col-lg-7" style="padding: 1rem;">
                
                <div class="row" style="padding: .5rem 0;">
                    <!--<div class="col-5">-->
                    <!--    <img-->
                    <!--        src="https://vault.platformpurple.com/static/clients/mypvolve/Betches_Main_Logo.png"-->
                    <!--        style="max-width: 100%;"-->
                    <!--    />-->
                    <!--</div>-->
                    <!--<div class="col-7" :style="`padding: ${windowWidth > 552 ? '1rem' : '.5rem'};`">-->
                    <!--    <h1 :style="`font-size: ${windowWidth > 552 ? '2.5rem' : '1.5rem'}; vertical-align: baseline;`"><q-icon name="fa-heart" color="pink" :style="`font-size: ${windowWidth > 552 ? '2.5rem' : '2rem'}; vertical-align: baseline;`" />'s P.volve</h1>-->
                    <!--</div>-->
                    <div class="col-12">
                        <img
                            src="https://vault.platformpurple.com/static/clients/mypvolve/Betches_Main_Logo_heart.png"
                            style="max-width: 100%;"
                        />
                    </div>
                </div>
                
                <h1 class="thickHeader" :style="`color: ${pvolveSalmon}; letter-spacing: 1px;`">
                    VIP STREAMING ACCESS-
                </h1>
                
                <h1 style="color: #777; letter-spacing: 1px;">Get 30 days free!</h1>
                
                <div class="monty" style="color: #777; line-height: 2rem; margin-top: 1rem;">
                    <p style="font-size: 1rem;">We're so excited to give friends of <span :style="`color: ${pvolveSalmon};`">Betches</span> special access to P.'s online streaming workouts. We're dedicated to helping you achieve your fitness dreams with our revolutionary pre-hab approach, which is proven to create long, lean bodies and lifted booties. Access our workouts any time, anywhere!</p>
                    <h5 class="thickHeader" :style="`color: ${pvolveSalmon};`">What To Expect</h5>
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
                    :offerProductID="offerProductID" 
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

                offerProductID: 148014,
                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Step 2: Enter your VIP access code',
                    componentName: 'ActivateForm',
                    addToMailingList: true,
                    productInfo: '',
                    loadHook: 'addProductInfoToCompleteSignUpComponentData',
                    submitButtonLabel: 'Access now',
                    noToast: true
                },
                
                heroUnitComponentData: {
                    backgroundImageURL: 'mypvolve/PLV003-17-PP_Bannerimages_Short_SignUp.jpg',
                    padding: '3rem',
                    mobilePadding: '2rem',
                    textColor: '#fff',
                    heroTitle: "<h1 style='margin: 0;'>welcome to p.volve!</h1><h1 class='thickHeader'>Try us for 30 days - FREE!</h1>"
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