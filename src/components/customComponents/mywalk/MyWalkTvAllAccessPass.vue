<template>
    <div>
        <!--<div class="row" style="padding: 6rem 0 20rem; background: url('https://vault.platformpurple.com/static/clients/mywalk/walkathome-hero-darker.jpg') 50% center / cover no-repeat rgba(0, 0, 0, .5);">-->
        <div class="row bg-grey-3" style="padding: 6rem 0 10rem;">
            <div class="col-12" align="center">
                <img src="https://vault.platformpurple.com/static/shopLogos/mywalk.png" style="width: 100%; max-width: 710px;"/>
            </div>
        </div>
        
        <div class="bg-grey-3" style="margin-top: -10rem;">
            
            <div class="well row">
                <div align="center" class="col-12" style="margin: 1rem 0;">
                    <h1 class="thickHeader" style="margin: 1rem; color: #545454; font-size: 3rem; text-transform: uppercase;">7 Day Free Trial</h1>
                    <h5 style="margin: 1rem; color: #545454;">Get full access to the entire Walk At Home library on demand. Cancel anytime within the 7 days and you will not be charged.</h5>
                </div>
                
                <div class="col-12 row shadow-12" :style="mywalktvCardStyle">
                    <div class="col-md-12 col-lg-3" style="padding: 1rem;">
                        <img src="https://vault.platformpurple.com/static/clients/mywalk/all-access-pass-gold.jpg" style="width: 100%; max-width: 250px; display: block; margin: 0 auto;" />
                    </div>
                    <div class="col-md-12 col-lg-4" style="padding: 1rem;">
                        <h2 style="margin-bottom: 1rem; color: #f7ad00;">You asked for it... we delivered!</h2>
                        <p>
                            For the first time in Walk At Home history, we are excited to announce the
                            <strong><span style="color: #f7ad00;">MyWalk.TV All Access Pass,</span></strong> giving you
                            <strong><span style="color: #f7ad00;">instant, total access</span></strong> to
                            <strong><span style="color: #f7ad00;">every video workout</span></strong> in the Walk At Home library!
                        </p>
                        
                        <p>
                            Walk At Home has been producing some of the most inspiring,
                            most motivating, and most popular fitness video workouts for decades.
                        </p>
                        <p>
                            <strong><span style="color: #f7ad00;">Get it all</span></strong> for one low monthly price, or  
                            <strong><span style="color: #f7ad00;">save $$$</span></strong> with an annual pass.
                        </p>
                    </div>
                    
                    <div class="col-md-12 col-lg-5" style="padding: 1rem;">
                        <h6 align="center" class="thickHeader" style="color: #545454;">Choose a monthly or yearly subscription:</h6>
                        
                        <div class="row" align="center" style="margin: 0 -.5rem;">
                            <div class="col" style="padding: 1rem .5rem;">
                                <q-btn @click="selectSubscriptionItem(149295)" class="full-width" :color="localOfferProductID === 149295 ? 'green' : 'grey-4'" style="padding: 1rem;">
                                    <h6 class="full-width" :style="`color: ${localOfferProductID === 149295 ? '#fff' : '#545454'};`"><span class="thickHeader" >monthly</span> ($8.25)</h6>
                                </q-btn>  
                            </div>
                            <div class="col" style="padding: 1rem .5rem;">
                                <q-btn @click="selectSubscriptionItem(149296)" class="full-width" :color="localOfferProductID === 149296 ? 'green' : 'grey-4'" style="padding: 1rem;">
                                    <h6 class="full-width" :style="`color: ${localOfferProductID === 149296 ? '#fff' : '#545454'};`"><span class="thickHeader">yearly</span> ($89.99)</h6>
                                </q-btn>  
                            </div>
                        </div>
                        
                        <signUpOffer 
                            v-if="localOfferProductID" 
                            :productIDsToCheck="[149295, 149296]" 
                            :offerProductID="localOfferProductID" 
                            :completeSignUpComponentData="completeSignUpComponentData" 
                            :buttonColor="'#f7bf3c'"
                            :showCompleteSignUp="showCompleteSignUp"
                            
                            @userHasAccess="route('/library')"
                            @userPreviouslyOwned="showCompleteSignUp = true"
                            @userNeedsToCheckout="showCompleteSignUp = true"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row" style="margin-top: -18rem; padding: 6rem 0 40rem; background: url('https://vault.platformpurple.com/static/clients/mywalk/walkathome-hero-darker.jpg') 50% center / cover no-repeat rgba(0, 0, 0, .5);">
            <div class="col-12" align="center">
                <!--<img src="https://vault.platformpurple.com/static/shopLogos/mywalktv.png" style="width: 100%; max-width: 500px;"/>-->
            </div>
        </div>
        
        <div class="row well" style="background: #fff; width: 100%; padding: 3rem;">
            <div class="col-lg-12 col-xl-7">
                <h5><strong><span style="color: #f7ad00; margin-left: 1rem;">Benefits:</span></strong></h5>
                <ul>
                    <li style="margin-bottom: .5rem;">
                        Enjoy on <strong><span style="color: #f7ad00;">all your devices</span></strong>—laptops, tablets, smartTVs, smartphones, Roku or PlayStation
                    </li>
                    <li style="margin-bottom: .5rem;">
                        Access through the <strong><span style="color: #f7ad00;">Walk At Home app</span></strong>, or from any compatible browser, anytime, anywhere!
                    </li>
                    <li style="margin-bottom: .5rem;">
                        Includes <strong><span style="color: #f7ad00;">all chapters and bonus features</span></strong> from the DVDs
                    </li>
                    <li style="margin-bottom: .5rem;">
                        Also includes <strong><span style="color: #f7ad00;">Your Daily Walk</span></strong> monthly preplanned workout program!
                    </li>
                    <li style="margin-bottom: .5rem;">
                        <strong><span style="color: #f7ad00;">New workouts</span></strong> are added to your subscription automatically
                    </li>
                    <li style="margin-bottom: .5rem;">
                        Keep your workouts <strong><span style="color: #f7ad00;">fresh and fun</span></strong> with a different workout every day!
                    </li>
                </ul>
            </div>
            
            <div class="col-lg-12 col-xl-5">
                <img src="https://vault.platformpurple.com/static/clients/mywalk/all-access-pass-screens-sm.jpg" style="width: 100%; max-width: 500px; margin: 0 auto; display: block; padding: 1rem;" />
            </div>   
            
            <div class="col-lg-12" align="center">
                <h5>Watch <strong><span style="color: #f7ad00;">any</span></strong> video from the entire Walk At Home library
                anytime, anywhere, on demand for as low as $7.50/month (over $650 if purchased separately)!</h5>
            </div>
        </div>

    </div>
</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    
    export default {
        
        components: {
            signUpOffer
        },
        
        data() {
            return {
                userEmail: '',
                nextStep(){},
                newUser: '',
                
                localOfferProductID: 149295,
                showCompleteSignUp: false,
                
                completeSignUpComponentData: {
                    header: 'Step 2: Payment information',
                    componentName: 'CreditCardForm',
                    productInfo: '',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    showCodeFields: false,
                    loadHook: 'addProductToCart',
                    submitButtonLabel: 'Submit',
                    promoCodeText: '7dayfree'
                },
            }
        },
        computed: {
            environmentJSON() {
                return this.$store.state.environment.json    
            },
            
            inlineAAPstyle() {
                return this.windowWidth < 993 ? 'width: 50%;' : 'width: 80%;'
            },
            
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            mywalktvCardStyle() {
                return 'background: #fff; border-radius: .25rem; height: 100%; width: 100%;' + (this.windowWidth > 1200 ? 'padding: 3rem' : 'padding: 1rem;')
            }
        },
        methods: {
            selectSubscriptionItem(productID) {
                k('selectSubscriptionItem: ', productID)
                
                this.localOfferProductID = ''
                this.$nextTick(() => {
                    this.localOfferProductID = productID
                })
            }
        }
    }
    
</script>

<style>
</style>

