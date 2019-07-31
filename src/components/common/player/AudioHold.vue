<template>
        
    <div 
        ref="audioLayout" 
        :currentTrack="currentTrack" 
        :playerOptions="playerOptions" 
        :audioSrc="audioSrc" 
        :audioZipURL="audioZipURL" 
        :is="audioLayout"
        
        @prevTrack="prevTrack"
        @nextTrack="nextTrack"
        @togglePlay="togglePlay"
        @playTrack="playTrack"
    />
        
</template>

<script>
    import DefaultAudioLayout from './DefaultAudioLayout'
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'

    export default {
        
        props: ['audioLayout'],
        
        components: {
            DefaultAudioLayout
        },
        
        mixins: [mediaTimeTracking],

        data() {
            return {
                // audioLayout: '',
                currentTrack: '',
                audioSrc: '',
                audioZipURL: '',
                switchingChapters: false,
                playerOptions: {
                    playbackRates: [0.5, 0.7, 1, 1.5, 2],
                    start: 0
                },
            }
        },

        computed: {
            homePageData() {
                return this.$store.state.environment.json
            },

            currentProduct() {
                return this.$store.state.currentProduct
            },
            
            currentChapter() {
                return this.$store.state.currentChapter
            },

            tracks() {
                return this.$store.state.currentProduct.productJSON.audio
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            chapterIndexToStartFrom() {
                return this.$store.state.chapterIndexToStartFrom
            },
                        
            chapterStartSecondsToPlayFrom() {
                return this.$store.state.chapterStartSecondsToPlayFrom
            }
        },

        methods: {
            initPlayback() {
                if (!this.tracks[this.chapterIndexToStartFrom || 0]) {
                    this.$q.notify({
                        message: 'There is a problem with the product media. Please contact support.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    this.route('/library')
                } else {
                    this.playTrack(this.chapterIndexToStartFrom || 0)
                }
                
                if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.$store.commit('chapterIndexToStartFrom', '')
            },
            
            togglePlay() {
                var el = document.getElementById('listen')
                k('audio paused? ', el.paused)
                
                if (el.paused) {
                    el.play()
                } else {
                    el.pause()
                }
            },

            prevTrack() {
                var prevTrackIndex = this.tracks.indexOf(this.currentTrack) - 1
                k('prevTrackIndex: ', prevTrackIndex)
                if (prevTrackIndex <= -1) prevTrackIndex = 0
                if (prevTrackIndex > -1) this.playTrack(prevTrackIndex)
            },

            nextTrack() {
                var nextTrackIndex = this.tracks.indexOf(this.currentTrack) + 1
                k('nextTrackIndex: ', nextTrackIndex)
                
                if (this.tracks[nextTrackIndex]) {
                    this.playTrack(nextTrackIndex)
                } else {
                    if (this.homePageData && this.homePageData.hooks && this.homePageData.hooks.productComplete) this.$store.commit('openPlayerModal', true)
                    this.route(this.$store.state.comingFrom !== '/signin' ? this.$store.state.comingFrom : '/library')
                }
            },

            playTrack(trackIndex) {
                k('playTrack: ', trackIndex)
                
                this.audioSrc = ''
                this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
                
                if (this.currentTrack) this.switchingChapters = true
                
                this.$store.commit('setCurrentChapter', '')
                
                this.api.signURL(this.currentProduct.productSKU, this.tracks[trackIndex].fileName, this.userLoginToken, 'audio', (res) => {
                    // k('signURL res: ', res)
                    
                    if (!res.signedURL) {
                        k('signURL res no url: ', res)
                        this.$q.notify({
                            message: 'There was a problem getting the media for this product. Please contact support.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                        return false
                    }
                    
                    this.currentTrack = this.currentProduct.productJSON.audio[trackIndex]
                    this.audioSrc = res.signedURL
                    
                    this.$store.commit('setCurrentChapter', this.currentTrack)
                    this.$store.commit('setCurrentChapterIndex', trackIndex)
                    
                    this.setStartSeconds()
                    
                    // if (switchingChapters) {
                    //     kw('do not start new media event') // bc seek listener is triggered when it plays
                    // } else {
                        this.startMediaPlayEvent(0, 'audio')
                    // }

                })
            },
            
            setStartSeconds() {
                k('set start seconds: ', this.currentChapter)
                k('are there chapterStartSecondsToPlayFrom? ', this.chapterStartSecondsToPlayFrom)
                
                this.playerOptions.start = this.chapterStartSecondsToPlayFrom || this.currentChapter.chapterStartSeconds || this.currentChapter.chapterOffset || 0
                // document.getElementById('listen').currentTime = (this.chapterStartSecondsToPlayFrom || this.currentChapter.chapterStartSeconds || this.currentChapter.chapterOffset || 0)
                
                if (this.chapterStartSecondsToPlayFrom) this.$store.commit('chapterStartSecondsToPlayFrom', '')
            },

            requestAudioZip() {
                var req = {
                    "productName": this.currentProduct.productName,
                    "userLoginToken": this.userLoginToken,
                    "productSKU": this.currentProduct.productSKU,
                    "mediaType": "audioZipFile"
                }
                
                k('requestAudioZipRequest req: ', req)
                
                this.api.post(this.api.apiv4Route + 'api/product/signedURL', req, (res) => {
                    k('requestAudioZipRequest res: ', res)
                    
                    if (res.signedURL) this.audioZipURL = res.signedURL
                })
            }
        },

        mounted() {
            k('this is current player instance object', document.getElementById('listen'))
            
            this.initPlayback()
            
            if (this.currentProduct.downloadAllowed) this.requestAudioZip()
        },
        
        watch: {
            chapterIndexToStartFrom() {
                k('watch chapterIndexToStartFrom: ', this.chapterIndexToStartFrom)
                if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.initPlayback()
            }
        },
        
        beforeDestroy() {
            this.$store.commit('setCurrentChapter', '')
            this.$store.commit('setCurrentChapterIndex', '')
            this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
        }

    }
</script>

<style>
    .transportButton {
        padding: .5rem;
        color: #000 !important;
    }
    
    #listen {
        width: 100%;
    }
    
    audio::-internal-media-controls-download-button {
        display:none;
    }
    
    audio::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
    
    audio::-webkit-media-controls-panel {
        width: calc(100% + 30px); /* Adjust as needed */
    }
</style>