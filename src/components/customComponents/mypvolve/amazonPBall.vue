<template>

    <div id="amazonPBallLayout" class="row">

        <div v-if="!signedUpForMailingList" id="pballOverlay" style="padding: 1rem; background: rgba(87, 197, 164, .95);">
            <div style="max-width: 600px; margin: 0 auto;" align="center">
                <!--<img class="full-width shadow-7" style="border-radius: .25rem;" src="https://vault.platformpurple.com/static/clients/mypvolve/pballSidelineWorkout_poster.jpg" />-->
                
                <h1 style="margin: 4rem 0 2rem 0; color: #fff; letter-spacing: .01rem;">ACCESS YOUR EXCLUSIVE <br /> <span class="thickHeader">P.BALL WORKOUT</span></h1>
                
                <h6 class="thickHeader text-white" style="letter-spacing: .01rem;">ENTER YOUR EMAIL TO UNLOCK</h6>
                
                <q-field 
                    :error="fieldError.userEmail"
                    error-label="Please fill in your email address"
                    align="left"
                    style="max-width: 400px;"
                >
                    <q-input
                        v-model="userEmail"
                        class="inputBox"
                        name="userEmail"
                        type="email"
                        :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                        color="grey-7"
                        float-label="your email"
                        @keydown.enter="signUpForNewsLetter"
                        @input="fieldError.userEmail = false"
                    />
                </q-field>
                
                <q-btn @click="signUpForNewsLetter" class="bg-white" :style="'margin-top: 1rem; color: ' + pvolveMintTitle + ';'">
                    <span class="monty" style="font-size: 140%;">
                        TO THE WORKOUT
                        <q-icon name="fa-caret-right" style="margin-left: 1rem; font-size: 2rem !important;" />
                    </span>
                </q-btn>
            </div>
        </div>
        
        <div class="col-12 row" style="padding: 2rem 0;">

            <div class="col-sm-12 col-lg-7" style="padding: 0 1rem;">
                
                <!--<h2 align="center" style="margin: 1rem;">Thanks for signing up!</h2>-->
                
                <purple-video
                    ref="videoPlayer" 
                    id="watch"
                    :options="pvolvePlayerOptions"
                    v-if="pvolvePlayerOptions.sources && pvolvePlayerOptions.sources.length"
                    @play="onPlayerPlay($event)" 
                    @pause="onPlayerPause($event)" 
                    @loadeddata="onPlayerLoadeddata($event)"
                    @playing="onPlayerPlaying($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @ended="onPlayerEnded($event)" 
                    @error="onPlayerError($event)"
                    @ready="$emit('playerReady')"
                />
                
                <!--<div align="center">-->
                <!--    <h3 :style="'margin: 1rem; color: ' + pvolveSalmon + ';'">p.ball Sideline Workout</h3>-->
                <!--</div>-->
                
            </div>
            
            <div class="col-sm-12 col-lg-5" style="padding: 1rem;">
                
                <div v-if="!authenticated">
                    <h1 style="letter-spacing: .01rem;">LOVE THIS? THERE'S SO MUCH MORE -</h1>
                    <h1 class="thickHeader" :style="'margin-top: 1rem; color: ' + pvolveMintTitle + '; letter-spacing: .01rem;'">START YOUR FREE TRIAL TODAY!</h1>
                    
                    <q-btn @click="route('/trial')" :style="'font-size: 1.25rem; margin: 2rem 0; color: #fff; background: ' + pvolveMintTitle + ';'">
                        <h6 class="thickHeader">SIGN UP</h6>
                        <q-icon name="fa-caret-right" />
                    </q-btn>
                </div>
                
                <div v-else>
                    <h1 style="letter-spacing: .01rem;">LOVE THIS? THERE'S SO MUCH MORE -</h1>
                    <h1 class="thickHeader" :style="'margin-top: 1rem; color: ' + pvolveMintTitle + '; letter-spacing: .01rem;'">ACCESS YOUR LIBRARY!</h1>

                    <q-btn @click="route('/library')" :style="'font-size: 1.25rem; margin: 2rem 0; color: #fff; background: ' + pvolveMintTitle + ';'">
                        <h6 class="thickHeader">GO</h6>
                        <q-icon name="fa-caret-right" />
                    </q-btn>
                </div>
                
                <div id="sharing">
                    <h5 :style="'color: ' + pvolveMintTitle + '; margin: 0;'">Sharing:</h5>
                    
                    <a id="share-email" href="mailto:?subject=Check out p.volve on demand!&body=I just finished my p.volve workout! Check out p.volve here: https://pvolve.com" target="_blank">
                        <q-btn size="md" round flat color="grey">
                            <q-icon name="fa-envelope" color="grey" />
                        </q-btn>
                    </a>
                    
                    <q-btn id="share-facebook" size="md" round flat @click="share2Facebook(currentProduct)" color="grey">
                        <q-icon name="fab fa-facebook-f" />
                    </q-btn>
                
                    <q-btn id="share-twitter" size="md" round flat @click="share2Twitter(currentProduct)" color="grey">
                        <q-icon name="fab fa-twitter" />
                    </q-btn>
                </div>
    
            </div>
            
        </div>
        
    </div>
    
</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import { pvolveColors } from './pvolveColors'
    import { videoPlayback } from '../../../mixins/videoPlayback'
    import { social } from '../../../mixins/social'

    export default {

        mixins: [pvolveColors, videoPlayback, social],
        
        components: { PurpleVideo },

        data() {
            return {
                signedUpForMailingList: false,
                
                userEmail: '',
                
                fieldError: {
                    userEmail: false
                },
                
                playerOptions: {

                    // component options
                    start: 0,
                    playsinline: true,

                    // videojs options
                    fluid: false,
                    autoplay: false,
                    controls: true,
                    muted: false,
                    language: 'en',
                    playbackRates: [0.5, 0.7, 1, 1.5, 2],
                    sources: [{
                        type: 'video/mp4',
                        src: 'https://vault.platformpurple.com/static/clients/mypvolve/pballSidelineWorkout.mp4'
                    }],
                    tracks: [],
                    height: '100%',
                    aspectRatio: "16:9"
                },
            }
        },

        computed: {
            
            pvolvePlayerOptions() {
                let pvolvePlayerOptions = this.playerOptions || {}
                    pvolvePlayerOptions.aspectRatio = '16:9'
                return pvolvePlayerOptions
            },
            
            currentProduct() {
                return this.$store.state.currentProduct
            },
            
            authenticated() {
                return this.$store.state.user.authenticated
            },
            
            userInfo() {
                return this.$store.state.user.info
            }
        },
        
        watch: {
            userInfo() {
                k('amazonPBall userInfo watch')
                this.userEmail = this.userInfo.userEmail
                this.signUpForNewsLetter()
            }
        },

        methods: {
            signUpForNewsLetter() {
                k('signUpForNewsLetter a6984d2cfe')
                
                // a6984d2cfe
                var req = {
                    userEmail: this.userEmail,
                    listID: 'a6984d2cfe',
                    mergeFields: {
                       FNAME: this.userInfo.firstName,
                       LNAME: this.userInfo.lastName
                    }
                }
                
                this.api.post(this.api.apiv4Route + 'api/client/mypvolve/subscribeUser2MailingList', req, (res) => {
                    k('subscribeUser2MailingList: ', res)
                    
                    if (res.status === 'subscribed') {
                        this.signedUpForMailingList = true
                        this.localStorage.set('signedUpForPBallMailingList', true)
                    }
                })
            }
        },
        
        created() {
            k('amazonPBall created: ', this.userInfo)
            
            var userAlreadySignedUp = this.localStorage.get('signedUpForPBallMailingList')
            k('userAlreadySignedUp: ', userAlreadySignedUp)
            
            if (userAlreadySignedUp) {
                k('signedUpForPBallMailingList localStorage found')
                this.signedUpForMailingList = true
            } 
            
            if (!userAlreadySignedUp && this.userInfo) {
                k('amazonPBall userInfo init: ', this.userInfo.userEmail)
                this.userEmail = this.userInfo.userEmail
                this.signUpForNewsLetter()
            }
        }
        
    }
</script>

<style>
    .transportButton {
        padding: .5rem;
        color: #000 !important;
    }

    .video-js {
        /*height: 50vh;*/
    }
    
    #pballOverlay {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 999;
    }
</style>
