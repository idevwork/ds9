<template>

    <div v-if="videoReady">
        <video id="purpleVideo" class="video-js vjs-big-play-centered" ref="video"></video>
    </div>

</template>

<script>
    import _videojs from 'video.js'
    const videojs = window.videojs || _videojs
    import videojsCss from 'video.js/dist/video-js.css'

    // as of videojs 6.6.0
    const DEFAULT_EVENTS = [
        'loadeddata',
        'canplay',
        'canplaythrough',
        'play',
        'pause',
        'waiting',
        'playing',
        'ended',
        'error'
    ]

    export default {

        props: {
            options: {
                type: Object,
                required: true
            },

            customEventName: {
                type: String,
                default: 'statechanged'
            }
        },

        components: {

        },

        data() {
            return {
                player: '',
                videoReady: true
            }
        },

        computed: {
            sources() {
                return this.options.sources
            },

            start() {
                return this.options.start
            },

            videoChapterArrowNavigation() {
                return this.$store.state.environment.json.e.videoChapterArrowNavigation
            }
        },

        mounted() {
            k('playerOptions: ', this.options)

            if (!this.player) {
                this.initialize()
            }

            document.addEventListener('keyup', this.keydownHandler)
        },

        methods: {

            initialize() {

                // ios fullscreen
                if (this.playsinline) {
                    this.$refs.video.setAttribute('playsinline', this.playsinline)
                    this.$refs.video.setAttribute('webkit-playsinline', this.playsinline)
                }

                k('initialize player with options: ', this.options)

                // player
                const self = this
                this.player = videojs(this.$refs.video, this.options, function() {
                    // events
                    const events = DEFAULT_EVENTS.concat(self.events)

                    // watch events
                    const onEdEvents = {}
                    for (let i = 0; i < events.length; i++) {
                        if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
                            (event => {
                                onEdEvents[event] = null
                                this.on(event, () => {
                                    self.$emit(event, self.player)
                                })
                            })(events[i])
                        }
                    }

                    // watch timeupdate
                    this.on('timeupdate', function() {
                        self.$emit('timeupdate', this.currentTime())
                    })

                    // TODO: for some testing with time code chapters
                    // watch loaded data for new src and new start on mobile
                    this.on('loadeddata', function(e) {
                        document.getElementById('purpleVideo_html5_api').currentTime = self.start
                    })

                    // player readied
                    self.$emit('ready', this)

                    // no right click on video
                    var video = self.$refs.video

                    if (video.addEventListener) { // IE >= 9; other browsers
                        video.addEventListener('contextmenu', (e) => {
                            e.preventDefault()
                        }, false)
                    } else { // IE < 9
                        video.attachEvent('oncontextmenu', () => {
                            window.event.returnValue = false
                        })
                    }

                })
            },

            dispose(cb) {
                if (this.player && this.player.dispose) {
                    if (this.player.techName_ !== 'Flash') {
                        this.player.pause && this.player.pause()
                    }
                    this.player.dispose()
                    this.player = null

                    this.$nextTick(() => {
                        this.videoReady = false
                        this.$nextTick(() => {
                            this.videoReady = true
                            this.$nextTick(() => {
                                cb()
                            })
                        })
                    })
                }
            },

             arrowRight() {
                if (!this.videoChapterArrowNavigation && !this.player.paused()) {
                    let time = this.player.currentTime() + 10

                    this.player.currentTime(time)
                }
            },

            arrowLeft() {
                if (!this.videoChapterArrowNavigation && !this.player.paused()) {
                    let time = this.player.currentTime() - 10

                    this.player.currentTime(time)
                }
            },

            keydownHandler(evt) {
                if(evt.key == 'ArrowRight') this.arrowRight()
                if(evt.key == 'ArrowLeft') this.arrowLeft()
            }

        },

        watch: {
            sources() {
                kw('sources has changed: ', this.sources)
                this.dispose(() => {
                    if (this.sources && this.sources.length) {
                        this.initialize()
                    }
                })
            },
            // @vcpablo - 05/03/19
            // It seems that this method is not being called anywhere and, we cannot have a methods with the same name of a computed property
            // start() {
            //     kw('start has changed: ', this.start)
            //     document.getElementById('purpleVideo_html5_api').currentTime = this.start
            //     if (document.getElementById('purpleVideo_html5_api').paused) document.getElementById('purpleVideo_html5_api').play()
            // }
        },

        beforeDestroy() {
            this.dispose(() => {})

            document.removeEventListener('keyup', this.keydownHandler)
        }
    }
</script>

<style>
</style>
