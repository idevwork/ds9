<template>

    <div style="background: #000;">
        <purple-video
            id="watch"
            ref="videoPlayer"
            v-if="playerOptions.sources && playerOptions.sources.length"
            :options="playerOptions"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @playing="onPlayerPlaying($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @ended="onPlayerEnded($event)"
            @error="onPlayerError($event)"
            @ready="playerIsReady" />

        <div v-if="!hideControls" id="playerTransport" class="row" style="position: relative;">
            <div class="col-xs-3 col-sm-3 col-md-3">
                <q-btn class="full-width" color="blue" @click="goBackward">
                    <q-icon name="fa-step-backward" />
                    <h6 class="gt-sm thickHeader">10 sec</h6>
                </q-btn>
            </div>
            <div class="col-xs-3 col-sm-3 col-md-3">
                <q-btn class="full-width" :color="isDisplayingSubtitles ? 'green' : 'grey'" @click="toggleSubtitles">
                    <q-icon name="fa-file-alt" />
                    <h6 class="gt-sm thickHeader">Text on/off</h6>
                </q-btn>
            </div>
            <div class="col-xs-3 col-sm-3 col-md-3">
                <q-btn class="full-width" :color="!isMuted ? 'green' : 'grey'" @click="toggleVoice">
                    <q-icon :name="isMuted ? 'fa-microphone-slash' : 'fa-microphone'" />
                    <h6 class="gt-sm thickHeader">Voice on/off</h6>
                </q-btn>
            </div>
            <div class="col-xs-3 col-sm-3 col-md-3">
                <q-btn class="full-width" color="green" @click="userTappedNextChapter">
                    <h6 class="gt-sm thickHeader">Next chapter</h6>
                    <q-icon name="fa-angle-right" />
                </q-btn>
            </div>
        </div>
    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import { videoPlayback } from '../../../mixins/videoPlayback'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['currentChapter', 'playerOptions', 'hideControls'],

        mixins: [videoPlayback, globalComputedData],

        components: {
            PurpleVideo
        },

        data() {
            return {
                isDisplayingSubtitles: false,
                isMuted: false,
                player: null,
                layoutExtraHeight: 191
            }
        },

        methods: {
            goBackward() {
                if (this.player) {
                    const now = this.player.currentTime()
                    const backwardSeconds = 10
                    const timeToSet = now > backwardSeconds ? now - backwardSeconds : 0
                    this.player.currentTime(timeToSet)
                    this.player.play()
                }
            },

            toggleSubtitles() {
                k('toggleSubtitles: ', this.player)

                if (this.player) {
                    let tracks = this.player.textTracks().tracks_
                    k('subtitle tracks: ', tracks)

                    if (tracks.length === 0) {
                        this.$q.dialog({
                            title: 'Sorry!',
                            message: 'This video has no subtitles!',
                            color: 'blue',
                        })
                        return
                    }

                    this.isDisplayingSubtitles = !this.isDisplayingSubtitles

                    tracks.forEach((track) => {
                        track.mode = this.isDisplayingSubtitles ? 'showing' : 'hidden'
                    })
                
                    this.localStorage.set('signItisDisplayingSubtitles', this.isDisplayingSubtitles)
                }
            },

            toggleVoice() {
                if (this.player) {
                    this.isMuted = !this.isMuted
                    this.player.muted(this.isMuted)

                    this.localStorage.set('signItIsMuted', this.isMuted)
                }
            },

            userTappedNextChapter() {
              this.$emit('nextChapter')
            },

            playerIsReady(player) {
                this.player = player
                this.isMuted = false
                this.isDisplayingSubtitles = false
                this.playerOptions.tracks = []

                this.onResize()

                const videoElement = document.getElementById('purpleVideo_html5_api')

                this.player.textTracks().on('change', () => {
                    let tracks = this.player.textTracks().tracks_
                    this.isDisplayingSubtitles = tracks.some(track => track.mode === 'showing')
                    
                    this.localStorage.set('signItisDisplayingSubtitles', this.isDisplayingSubtitles)
                })

                document.getElementsByClassName('vjs-mute-control')[0].addEventListener('click', () => {
                    this.toggleVoice()
                })

                this.$emit('playerReady', player)
            },

            // onResize() {
            //     let videoElement = document.getElementById('purpleVideo_html5_api')
            //     let videoWrapper = document.getElementById('purpleVideo')
            //     k('onResize: ', videoWrapper, videoWrapper.style)
                
            //     k('sizes ~ ', this.windowHeight - this.layoutExtraHeight, videoWrapper.offsetHeight, this.windowHeight - this.layoutExtraHeight > videoWrapper.offsetHeight)

            //     if (videoElement && videoWrapper) {
            //         if (this.windowHeight - this.layoutExtraHeight > videoWrapper.offsetHeight) {
            //             videoWrapper.style.paddingTop = ''
            //         } else {
            //             videoWrapper.style.paddingTop = `${this.windowHeight - this.layoutExtraHeight}px`
            //         }
            //     }
            // },
            
            onResize() {
                let videoContainer = document.getElementById('watch')
                let videoWrapper = document.getElementById('purpleVideo')
                let videoElement = document.getElementById('purpleVideo_html5_api')
                // k('onResize: ', videoWrapper, videoWrapper.style)
                
                let minPaddingTop = 230
                let maximumMaxHeight = 1080
                let paddingTop = this.windowHeight - this.layoutExtraHeight
                // k('sizes ~ ', paddingTop, videoWrapper.offsetHeight, paddingTop > videoWrapper.offsetHeight)
                
                // k('paddingTop: ', paddingTop)

                if (videoElement && videoWrapper) {
                    if (paddingTop > videoWrapper.offsetHeight) {
                        // k('window is bigger than video')
                        
                        let heightVal = paddingTop > maximumMaxHeight ? maximumMaxHeight : paddingTop
                        // k('heightVal: ', heightVal)
                        
                        videoContainer.style.maxHeight = `${heightVal}px`
                        videoWrapper.style.paddingTop = `${paddingTop > maximumMaxHeight ? maximumMaxHeight : this.windowWidth > this.windowHeight ? paddingTop : ''}px`
                        
                    } else {
                        // k('window is smaller than video')
                        
                        videoContainer.style.maxHeight = `${paddingTop > minPaddingTop ? paddingTop : minPaddingTop}px`
                        videoWrapper.style.paddingTop = `${paddingTop > minPaddingTop ? paddingTop : minPaddingTop}px`
                    }
                }
            }
        },

        watch: {
            videoPaused() {
                k('videoPaused: ', this.videoPaused)
            },
            
            windowWidth() {
                this.onResize()
            },
            
            windowHeight() {
                this.onResize()
            },

            player() {
                let savedIsMuted = this.localStorage.get('signItIsMuted')
                let savedIsDisplayingSubtitles = this.localStorage.get('signItisDisplayingSubtitles')

                if (savedIsDisplayingSubtitles && !this.isDisplayingSubtitles) this.toggleSubtitles()
                if (savedIsMuted && !this.isMuted) this.toggleVoice()
            }
        }

    }
</script>

<style scoped>
    #watch {
        width: 100%;
        margin: 0 auto;
        /*height: 100%;*/
        /*max-width: 1440px;*/
        max-height: calc(100vh - 191px) !important;
        /*overflow: hidden;*/
    }

    #playerTransport button {
        border-radius: 0px;
        box-shadow: none;
    }

    #playerTransport {
        background: transparent;
    }

    .pchip {
        font-size: .8rem;
        background: #2196f3;
        color: #000;
        padding: .1rem .3rem;
        border-radius: .2rem;
    }

    .transportButton {
        padding: .25rem;
        border-radius: 0 !important;
        color: #000 !important;
    }

    .transportButton span {
        font-size: 1rem;
    }

    .q-icon {
        margin: .5rem;
        font-size: 1rem;
    }

    .q-btn-big {
        min-height: 44px !important;
    }
</style>
