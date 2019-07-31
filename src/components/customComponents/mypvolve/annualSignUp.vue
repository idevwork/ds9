<template>
    
    <div>
        
        <div id="hero" class="row" style="background: url(&quot;https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV003-17-PP_Bannerimages_Short_account.jpg&quot;) 50% center / cover no-repeat;">
            <div style="width: 100%; text-align: center; padding: 10vw;">
                <div style="color: #333;">
                    <h1 :style="'font-weight: 800; color: white; font-size: ' + adaptiveFontSize(2.2) + 'rem; margin-bottom: 3rem;'" class="monty">
                        Sign up for a year of P.volve workouts and get <br /><span :style="'font-size: 3rem; color: ' + pvolveMintTitle + ';'">2 months FREE!</span>
                    </h1>
                    <p :style="'font-size: ' + adaptiveFontSize(1.2) + 'rem;'" class="monty text-white">Commit to changing your body—and get noticed!</p>

                </div>
            </div>
        </div>

        <div class="row" :style="windowWidth > 767 ? 'padding: 1rem;' : ''">
    
            <div class="col-lg-6 col-md-12" style="padding: 1rem;"> <!--left block -->
            
                <signUpOfferOld 
                    :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                    :offerProductID="offerProductID" 
                    :completeSignUpComponentData="completeSignUpComponentData" 
                    :buttonColor="pvolveSalmon" 
                    :signUpBackgroundColor="'#FFF1F0'" 
                    :subscribeRoute="subscribeRoute" 
                    subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                    @userHasAccess="route('/library')"
                />
              
            </div>

            <div class="col-lg-6 col-md-12" style="padding: 1rem; line-height: 3rem;"> <!--right block -->
                <div class="monty thinHeader allCaps text-grey-7" style="font-size: 3rem;">how does this</div>
                <div class="monty thickHeader allCaps" :style="'font-size: 3rem; color: ' + pvolveSalmon + ';'">
                    work?
                </div>
                
                <ol class="monty" style="color: #777; line-height: 2rem; margin-top: 1rem;">
                    <li>Sign up or sign in</li>
                    <li>Click "next step" and fill in payment details</li>
                    <li>You will be charged $299.95 for a full year access to P.volve workouts (including 30 Day Evolution and Precision Sculpt—normally $383.86)</li>
                    <li>After 12 months, your subscription will auto bill monthly at $29.99.</li>
                </ol>

            </div>

        </div>
        
        <div class="full-width" :style="'background: ' + pvolveMintBG + '; padding: 2rem; text-align: center;'">
            
            <pvolveTestimonials />
            
        </div>
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import signUpOfferOld from '../../common/showcase/signUpOfferOld'
    import pvolveTestimonials from './pvolveTestimonials'
    import { designTools } from '../../../mixins/designTools'
    
    export default {
        props: ['componentData'],
        
        components: {
            signUpOfferOld,
            pvolveTestimonials
        },

        data() {
            return {
                // productIDsToCheck: ['149001', '148014', '149297', '149320', '149461'],
                offerProductID: 149320,
                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Step 2: Payment information',
                    description: '',
                    componentName: 'CreditCardForm',
                    loadHook: 'addProductToCart',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    submitButtonLabel: 'let’s do this!',
                    noToast: true
                }
            }
        },
        
        mixins: [pvolveColors, designTools],

        computed: {
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
            
            environmentJSON() {
                return this.$root.$store.state.environment.json
            }
        },

        methods: {

        },

        mounted() {
            k('mounted')
            
            // console.log('componentData: ', this.componentData)
        }
    }
</script>

<style>
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
</style>
