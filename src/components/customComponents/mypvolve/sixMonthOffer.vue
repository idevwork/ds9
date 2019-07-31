<template>

    <div>

        <div id="hero" class="row" style="background: url(&quot;https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/6monthoffer-promo-image.jpg&quot;) 50% center / contain no-repeat;">
            <div style="width: 100%; text-align: center; padding: 10vw; background: rgba(255, 255, 255, 0.7);">
                <div style="color: #333;">
                    <h1 :style="'font-weight: 800; font-size: ' + adaptiveFontSize(2.2) + 'rem; margin-bottom: 3rem;'" class="monty">
                        Get your DREAM body, <span :style="'color: ' + pvolveSalmon + ';'">NOW!</span>
                    </h1>
                    <p :style="'font-size: ' + adaptiveFontSize(1.2) + 'rem;'" class="monty">Commit to changing your body—and get noticed!</p>
                </div>
            </div>
        </div>

        <div class="full-width moLineSpace" style="background: #f3f3f3; padding: 3rem; border-top: #ccc 1px solid; border-bottom: #ccc 1px solid;">
            <div :style="'font-size: ' + adaptiveFontSize(2) + 'rem;'" class="monty allCaps">Our gift to you:</div>
            <div class="monty allCaps" style="line-height: 2rem !important;">
                Purchase 6 months of streaming now, get one month
                <span :style="'font-weight: 799; color: ' + pvolveMintTitle + ';'">free</span>
                , and get a set of P.volve gliders, a P.volve tote & towel (over $60 value)
                <span :style="'font-weight: 799; color: ' + pvolveMintTitle + ';'">free</span>
                with purchase!
            </div>

        </div>

        <div class="row full-width justify-around" style="padding: 1rem;">
            <div class="col-sm-4 col-xs-12" align="center">
                <img style="height: 12rem;" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/gliders.jpg" />
                <p class="monty">P.volve Gliders</p>
            </div>
            <div class="col-sm-4 col-xs-12" align="center">
                <img style="height: 12rem;" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/towel.jpg" />
                <p class="monty">P.volve Towel</p>
            </div>
            <div class="col-sm-4 col-xs-12" align="center">
                <img style="height: 12rem;" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/tote.jpg" />
                <p class="monty">P.volve Tote</p>
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
                    <li>You will be charged $149.95 for 6 months access to P.volve workouts, plus free gifts&#8212;the entire package is over $240 total value!</li>
                    <li>You will receive an email from help@pvolve.com asking for your address so we can send out your free gifts.</li>
                    <li>Your FREE gifts will ship on us&#8212;FREE SHIPPING!*</li>
                </ol>
                <p class="monty" style="font-size: .8rem;">
                    *Free shipping only provided in the US; International customers will be charged shipping (for gifts only).
                    <br />
                    **After 6 months, your subscription will auto bill monthly at $29.99.
                </p>
            </div>

        </div>

        <div class="full-width row" :style="'background: ' + pvolveMintBG + '; padding: 2rem; text-align: center;'">

            <pvolveTestimonials />

        </div>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import signUpOfferOld from '../../common/showcase/signUpOfferOld.vue'
    import pvolveTestimonials from './pvolveTestimonials'
    import { designTools } from '../../../mixins/designTools'

    export default {
        props: ['componentData'],

        components: {
            pvolveTestimonials,
            signUpOfferOld
        },

        data() {
            return {
                // productIDsToCheck: ['149001', '148014', '149297', '149320', '149461'],
                offerProductID: 149297,
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
