import { mediaTimeTracking } from './mediaTimeTracking'

export const videoPlayback = {
    props: ['currentContext'],

    data() {
        return {
            playerID: '',
            openModal: false,
            advancedPlaybackControls: false,
            currentPlaybackRate: 1,
            loopOn: '',
            loopInPoint: '',
            loopOutPoint: '',
            seeking: false,
            currentPlayheadTime: 0,
            lastTimeSaved: 0,
            lastTimeSent: 0,
            videoPaused: true,
            currentTime: 0,
            advancedPlaybackControlDesc: true
        }
    },

    mixins: [mediaTimeTracking],

    computed: {

        currentProduct() {
            return this.$store.state.currentProduct
        },

        currentMediaType() {
            return this.$store.state.currentMediaType
        },

        chapters() {
            return this.$store.state.currentProduct.productJSON ? this.$store.state.currentProduct.productJSON.video : []
        },

        playbackRatesForSelection() {
            return this.playerOptions.playbackRates.map(rate => {
                return {
                    label: 'Speed x' + String(rate),
                    value: rate
                }
            })
        }
    },

    methods: {
        cyclePlaybackRate() {
            var currentPlaybackRateIndex = this.playerOptions.playbackRates.indexOf(document.getElementById(this.playerID).playbackRate)
            k('currentPlaybackRateIndex: ', currentPlaybackRateIndex)

            var nextPlaybackRateIndex = currentPlaybackRateIndex + 1
            if (nextPlaybackRateIndex >= this.playerOptions.playbackRates.length) nextPlaybackRateIndex = 0
            k('next playback rate: ', nextPlaybackRateIndex, this.playerOptions.playbackRates.length, this.playerOptions.playbackRates[nextPlaybackRateIndex])

            document.getElementById(this.playerID).playbackRate = this.playerOptions.playbackRates[nextPlaybackRateIndex]
            this.currentPlaybackRate = this.playerOptions.playbackRates[nextPlaybackRateIndex]
        },

        changePlaybackRate(rate) {
            k('changePlaybackRate: ', rate)

            document.getElementById(this.playerID).playbackRate = rate
            this.currentPlaybackRate = rate
        },

        setLoopIn() {
            k('setLoopIn: ', document.getElementById(this.playerID).currentTime)

            if (!this.loopInPoint) {
                this.loopInPoint = document.getElementById(this.playerID).currentTime
            } else {
                this.loopInPoint = ''
                this.loopOn = false
            }
        },

        setLoopOut() {
            k('setLoopOut: ', document.getElementById(this.playerID).currentTime)

            if (!this.loopOutPoint) {
                this.loopOutPoint = document.getElementById(this.playerID).currentTime
                if (this.loopInPoint) this.loopOn = true
            } else {
                this.loopOutPoint = ''
                this.loopOn = false
            }
        },

        // listen event
        onPlayerPlay(player) {
            k('player play!', player)
            this.videoPaused = false

            k('player play: seeking?' + this.seeking)

            if (this.seeking) {
                // user has stopped seeking
                kw('seeking complete')
                this.seeking = false

                // this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                // this.currentPlayheadTime = this.currentTime
            }
        },

        onPlayerPause(player) {
            k('player pause!', player)
            this.videoPaused = true
        },

        onPlayerLoadeddata(player) {
            k('player loadeddata!', player)
            this.currentPlayheadTime = 0
            this.currentTime = 0
            this.playerID = player.id_ + '_html5_api'

            document.getElementById(this.playerID).onseeking = (player) => {
                kw('on seeking ... player seeking?: ' + this.seeking)
                if (!this.seeking && Math.abs(this.currentPlayheadTime - this.currentTime) > 10) {
                    kw('set player seeking')
                    this.seeking = true // set to true and then once seeking done; "play" listener is triggered to signal seeking over
                    this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                    document.getElementById(this.playerID).play()
                }
            }

            // autoplay on mobile
            // if (this.$q.platform.is.mobile) {
            //     console.warn('HEY YALL')
            //     document.getElementById(this.playerID).muted = true
            //     document.getElementById(this.playerID).play()
            // }
        },

        onPlayerPlaying(player) {
            k('player playing!', player)
            this.videoPaused = false

            k('player playing: seeking?' + this.seeking)

            if (this.seeking) {
                // user has stopped seeking
                kw('seeking complete')
                this.seeking = false

                // this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                // this.currentPlayheadTime = this.currentTime
            }

            // get the current players AudioTrackList object
            let tracks = player.audioTracks();
            kw('audioTRACKS: ', tracks)

            // listen to the change event
            tracks.addEventListener('change', function() {

                // print the currently enabled AudioTrack label
                for (let i = 0; i < tracks.length; i++) {
                    let track = tracks[i];

                    if (track.enabled) {
                        k(track.label);
                        return;
                    }
                }
            });
        },

        onPlayerTimeupdate(currentTime) {

            // k('player timeupdate!', currentTime, this.currentPlayheadTime)

            this.currentTime = currentTime

            // used for looping
            if (this.loopOutPoint &&
                this.loopInPoint &&
                this.loopOn &&
                currentTime > this.loopOutPoint) {
                k('set loop point')
                document.getElementById(this.playerID).currentTime = this.loopInPoint
            }

            // var currentTime = document.getElementById(this.playerID).currentTime

            if (Math.abs(this.currentPlayheadTime - currentTime) > 10) {
                kw('setting seeking flag')
                k(currentTime)
                k(this.currentPlayheadTime)
                this.seeking = true // this is for jumping in media (vs scrubbing)
                this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                let el = document.getElementById(this.playerID)
                el.play()
            }

            // only update media play event end time if not seeking

            // k('update playhead tracking')
            this.currentPlayheadTime = currentTime // update current playhead tracking

            if (!this.seeking && this.currentChapter) { // seeked events are handled separately
                // see if new chapter has been reached
                if (this.currentChapter.chapterStartSeconds || this.currentChapter.chapterStartSeconds == 0) {
                    // this is a timecode chapter
                    var seeked2ChapterIndex = this.chapterIndexForTimecode(this.chapters, this.currentChapter.fileName, currentTime)
                    k('seeked2ChapterIndex: ', seeked2ChapterIndex, this.$store.state.currentChapterIndex)

                    if (seeked2ChapterIndex != this.$store.state.currentChapterIndex) {
                        // kw('new chapter reached: ', seeked2ChapterIndex)
                        this.$store.commit('setCurrentChapterIndex', seeked2ChapterIndex)
                        this.$store.commit('setCurrentChapter', this.chapters[seeked2ChapterIndex])
                        // k('next chapter info set')
                        
                        this.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event
                        this.sendChapterCompleteIfCurrentChapterExists()

                        // kw('start new play event now')
                        this.startMediaPlayEvent(0, 'video')
                    }
                }
            }

            // k('lastTimeSaved:' + this.lastTimeSaved)
            // k('currentPlayheadTime:' + this.currentPlayheadTime)
            // if (Math.abs(this.lastTimeSaved - this.currentPlayheadTime) > 3) {
            //     // kw('update end')
            //     // update event end time in local storage
            //     this.lastTimeSaved = currentTime
            //     this.updateMediaPlayEvent(currentTime)
            // }

            if (Math.abs(this.lastTimeSaved - this.currentPlayheadTime) > 1) {
                this.lastTimeSaved = currentTime
                this.updateMediaPlayEvent(currentTime)
            }

            if (Math.abs(this.lastTimeSent - this.currentPlayheadTime) > 300) {
                kw('update end')
                // update event end time in local storage
                this.lastTimeSent = currentTime
                // this.updateMediaPlayEvent(currentTime)
                this.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event

                k('start new play event now')
                this.startMediaPlayEvent(this.lastTimeSent, 'video')
            }
        },

        onPlayerEnded(player, emitNextChapter = true) {
            k('player ended: ', this.currentChapter, this.currentProduct)
            
            if (emitNextChapter) {
                this.$emit('nextChapter')
            }

            // this.endMediaTrackSegment(this.currentPlayheadPosition)
            this.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event

            this.sendChapterCompleteIfCurrentChapterExists()
        },

        onPlayerError(player) {
            this.api.sendEvent({
                eventType: 'mediaError',
                eventDesc: 'error while playing media file for ' + this.currentProduct.productName,
                productSKU: this.currentProduct.productSKU,
                productID: this.currentProduct.productID,
                fileName: this.currentChapter.url,
                errorMsg: player.error_ ? player.error_.message : ''
            })
        },
        
        sendChapterCompleteIfCurrentChapterExists() {
            if (this.currentChapter && this.currentChapter.type !== 'question' && this.currentProduct) {
                const logEventObj = {
                    eventType: 'chapterComplete',
                    eventDesc: `user completed chapter ${this.currentChapter.displayName} in ${this.currentProduct.productName}`,
                    productSKU: this.currentProduct.productSKU,
                    productID: this.currentProduct.productID,
                    userID: this.$store.state.user.info.userID,
                    contextID: this.currentContext ? this.currentContext.id : '',
                    chapterTitle: this.$store.state.currentChapter ? this.$store.state.currentChapter.displayName : ''
                }
                
                k('chapter complete log: ', logEventObj, this.currentChapter, this.currentProduct)
                this.api.sendEvent(logEventObj, () => {
                    this.$root.$emit('chapterComplete')
                })
            } else {
                k('no current chapter')
            }
        }
    },

    watch: {
        playerID() {
            this.$emit('setVideoID', this.playerID)
        },

        // seeking() {
        //     if (this.seeking) {
        //         this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')

        //     }
        // }
    }
}
