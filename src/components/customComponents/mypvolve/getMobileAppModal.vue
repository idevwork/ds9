<template>

    <div id="pvolveMobileAppModal">
    
        <div style="max-width: 400px; position: relative; margin: 0 auto;">
                <img class="angled" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV081-18-P.jpg" style="max-width: 100%;" />
                
                <div align="right" style="position: absolute; top: .5rem; right: .5rem;">
                    <q-btn @click="$emit('close')" flat round style="padding: .5rem;">
                        <q-icon name="fa-times" color="white" />    
                    </q-btn>
                </div>
            </div>
            
            <div class="row" style="padding: 1rem; max-width: 400px; margin: 0 auto;">
                <div class="col-12" align="center">
                    <h5 class="thickHeader" style="letter-spacing: 0.05rem; color: #524F4C;">Introducing the <span :style="`color: ${pvolveSalmon};`">new</span></h5>
                    <h1 class="thickHeader" :style="`color: ${pvolveSalmon}; letter-spacing: 0.05rem;`">P.VOLVE APP</h1>
                    <p class="monty" style="margin: .5rem 0; color: #524F4C;">The ultimate app to lift, tighten and sculpt your entire body.</p>
                </div>
                
                <div v-if="$q.platform.is.desktop" class="row col-12" style="padding: 0 .5rem 2rem;">
                    <div v-if="!mobileAppTextSent" class="col-12">
                        <!--<h2 class="thickHeader" :style="`color: ${pvolveSalmon}; margin-bottom: 1rem;`">GET THE ULTIMATE SCULPTING & TONING APP!</h2>-->
                        <h6 class="thickHeader" align="center" :style="`color: ${pvolveSalmon}; text-transform: unset; margin: .5rem 0; line-height: 1.5rem;`">Enter your mobile number and we'll text you a link to download the app:</h6>
        
                        <q-input 
                            id="phoneNumber" 
                            v-model="phoneNumber" 
                            class="monty inputBox"
                            float-label="ENTER YOUR MOBILE PHONE #"
                            color="grey" 
                            v-mask="'###############'"
                            :attributes="{autocompletetype: 'tel', autocorrect: 'off'}" 
                            style="color: #777; margin: .5rem 0;"
                        />
                        <p style="font-size: .8rem; line-height: 1rem;">*If you are outside the U.S. please remember to enter your country code.</p>
                        
                        <div class="row" style="margin: -.5rem;">
                            <!--<h6 class="col-12 thickHeader" style="padding: 1rem;">Send me the app</h6>-->
                            <div class="col-sm-12" style="padding: .5rem;">
                                <q-btn outline class="full-width" :disable="!phoneNumber" @click="sendAppThroughSMS()" style="background: #fff !important; color: #333;">
                                    <h6 style="font-size: .8rem; letter-spacing: 1px;">
                                        Send me the app
                                    </h6>
                                </q-btn>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div v-else class="col-12" align="center">
                        <div style="max-width: 500px;">
                            <h3 class="thickHeader" :style="`color: ${pvolveSalmon};`">We Sent You A Text!</h3>
                            <p class="monty" style="color: #524F4C;">Hang on. This might take a minute.</p>
                        </div>
                    </div>
                </div>
                
                <div v-if="$q.platform.is.ios" class="row" align="center" style="padding: 0rem 1rem 2rem;">
                    <div style="max-width: 500px; margin: .5rem 0;">
                        <h6 class="thickHeader" :style="`color: ${pvolveSalmon}; text-transform: unset; line-height: 1.5rem;`">Tap the button below to get the P.volve mobile app from the iOS App Store:</h6>
                        
                        <a href="https://my.pvolve.com/app/iOS">
                            <q-btn flat style="max-width: 250px; margin: .5rem 0;">
                                <img src="https://vault.platformpurple.com/static/clients/common/download_on_app_store.png" style="max-width: 100%;" />
                            </q-btn>
                        </a>
                    </div>
                </div>
                    
                <div v-if="$q.platform.is.android" class="row" align="center" style="padding: 0rem 1rem 2rem;">
                    <div style="max-width: 500px; margin: .5rem 0;">
                        <h6 class="thickHeader" :style="`color: ${pvolveSalmon}; text-transform: unset; line-height: 1.5rem;`">Tap the button below to get the P.volve mobile app from the Google Play Store:</h6>
                        
                        <a href="https://my.pvolve.com/app/android">
                            <q-btn flat style="max-width: 250px; margin: .5rem 0;">
                                <img src="https://vault.platformpurple.com/static/clients/common/google-play-badge.png" style="max-width: 100%;" />
                            </q-btn>
                        </a>
                    </div>
                </div>
            </div>
    
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    
    export default {
        props: [],
        
        mixins: [ pvolveColors ],
    
        components: {
            
        },
    
        data() {
            return {
                phoneNumber: null,
                mobileAppTextSent: false
            }
        },
        
        computed: {
            environmentName() {
                return this.$store.state.environment.name
            }
        },
        
        watch: {
            userInfo() {
                if (this.userInfo && this.userInfo.phoneNum) {
                    this.phoneNumber = this.userInfo.phoneNum
                }
            },
        },
    
        methods: {
           sendAppThroughSMS(platform) {
                let req = {
                    environment: this.environmentName,
                    phoneNumber: this.phoneNumber,
                    // platform: platform
                }
                k('sendAppThroughSMS req: ', req)
                
                this.api.post(`${this.api.apiv4Route}api/sms/sendMobileAppLinks`, req, (res) => {
                    k('sendAppThroughSMS res: ', res)
                    this.mobileAppTextSent = true
                })
            }
        },
    
        created() {
            // console.log('componentData: ', this.componentData)
            if (this.userInfo && this.userInfo.phoneNum) {
                this.phoneNumber = this.userInfo.phoneNum
            }
        }
    }
</script>
