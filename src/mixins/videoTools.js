export const videoTools = {
    data() {
        return {
           videoID: '',
           playerOptions: {
                // component options
                start: 0,
                playsinline: true,

                // videojs options
                fluid: false,
                autoplay: true,
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.5, 0.7, 1, 1.5, 2],
                sources: [],
                tracks: [],
                height: '100%',
                aspectRatio: "16:9"
            },
           firstChapterPlayed: true
        }
    },

    mixins: [],

    computed: {
        currentProduct() {
            return this.$store.state.currentProduct
        },

        chapters() {
            return this.$store.state.currentProduct.productJSON.video
        },

        currentChapter() {
            return this.$store.state.currentChapter
        },

        currentChapterIndex() {
            return this.$store.state.currentChapterIndex
        },

        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },

        chapterIndexToStartFrom() {
            return this.$store.state.chapterIndexToStartFrom
        },

        chapterStartSecondsToPlayFrom() {
            return this.$store.state.chapterStartSecondsToPlayFrom
        },

        nestedChapters() {
            return this.$store.state.nestedChapters
        },

        windowHeight() {
            return this.$store.state.windowHeight
        },

        homePageData() {
            return this.$store.state.environment.json
        },
    },

    methods: {
        initPlayback() {
            k('initPlayback! ', this.chapters, this.chapterIndexToStartFromz)

            if (!this.chapters[this.chapterIndexToStartFrom || 0]) {
                this.$q.notify({
                    message: 'There is a problem with the product media. Please contact support.',
                    type: 'negative',
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-left'
                })
                this.route('/library')
            } else {
                this.playChapter(this.chapterIndexToStartFrom || 0)
            }
            if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.$store.commit('chapterIndexToStartFrom', '')
        },

        playerReady() {
            kw('READY!')
        },

        setVideoID(id) {
            k('setVideoID: ', id)
            this.videoID = id

            // this.setVideoHeight()
        },

        togglePlay(pauseOnly) {
            var el = document.getElementById(this.videoID)
            kw('togglePlay: ', this.videoID)
            k('videoPaused: ', el.paused, pauseOnly)

            if (el.paused && !pauseOnly) {
            // if (this.videoPaused) {
                el.play()
            } else {
                el.pause()
            }
        },

        prevChapter() {
            var prevChapterIndex = this.currentChapterIndex - 1
            // k('prevChapterIndex: ', prevChapterIndex)
            if (prevChapterIndex <= -1) prevChapterIndex = 0
            if (prevChapterIndex > -1) this.playChapter(prevChapterIndex)
        },

        nextChapter() {
            if (this.videoID && document.getElementById(this.videoID) && !document.getElementById(this.videoID).paused) {
                this.togglePlay(true)
            }

            var nextChapterIndex = this.currentChapterIndex + 1
            k('nextChapterIndex: ', this.currentChapterIndex, nextChapterIndex)

            if (this.chapters[nextChapterIndex]) {
                this.playChapter(nextChapterIndex)
            } else {
                if (this.homePageData && this.homePageData.hooks && this.homePageData.hooks.productComplete) this.$store.commit('openPlayerModal', true)
                var route = this.environmentJSON && this.environmentJSON.e.afterActivateRoute ? this.environmentJSON.e.afterActivateRoute : '/library'
                this.route(this.$store.state.comingFrom !== '/signin' && !this.$store.state.comingFrom.includes('play') ? this.$store.state.comingFrom : route)
            }
        },


        selectChapterHeading(index) {
            k('selectChapterHeading: ', index)

            this.nestedChapters[index].showNested = !this.nestedChapters[index].showNested
            this.$store.commit('nestedChapters', this.nestedChapters)
            k('nestedChapters: ', this.nestedChapters[index])
        },

        selectChapter(chapter) {
            if (chapter.chapterOffset) chapter.chapterStartSeconds = chapter.chapterOffset
            // nestedChapters make the index return incorrectly, find correct index
            for (var i = 0; i < this.chapters.length; i++) {
                if (this.chapters[i].chapterOffset) this.chapters[i].chapterStartSeconds = this.chapters[i].chapterOffset
                if (this.chapters[i].fileName === chapter.fileName && this.chapters[i].chapterStartSeconds === chapter.chapterStartSeconds) {
                    break;
                }
            }

            this.playChapter(i)
        },

        playChapter(newChapterIndex) {
            var chapterIsPrevious = newChapterIndex < this.currentChapterIndex
            var previousChapterIndex = this.currentChapterIndex
            k('playChapter: ', previousChapterIndex, newChapterIndex, this.chapters[newChapterIndex])

            this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event

            if (!this.chapters[newChapterIndex].fileName || this.chapters[newChapterIndex].nonMovieChapter) {
                k('not a movie chapter: ', chapterIsPrevious)
                this.$store.commit('setCurrentChapter', this.chapters[newChapterIndex])
                this.$store.commit('setCurrentChapterIndex', newChapterIndex)

                if (chapterIsPrevious) {
                    this.prevChapter()
                } else {
                    this.nextChapter()
                }


            } else {
                k('is a movie chapter: ', previousChapterIndex, newChapterIndex, this.chapters[newChapterIndex].fileName)

                var need2signURL = (previousChapterIndex || previousChapterIndex === 0) ? (this.chapters[newChapterIndex].fileName !== this.chapters[previousChapterIndex].fileName) : true
                kw('need to sign url?: ', need2signURL)

                if (need2signURL) {
                    // new movie; need to sign url
                    this.playNewChapterSource(newChapterIndex)
                } else {
                    this.$store.commit('setCurrentChapter', this.chapters[newChapterIndex])
                    this.$store.commit('setCurrentChapterIndex', newChapterIndex)
                    this.setStartSeconds()
                }
            }
        },

        playNewChapterSource(newChapterIndex) {
            this.api.signURL(this.currentProduct.productSKU, this.chapters[newChapterIndex].fileName, this.userLoginToken, 'video', (res) => {
                k('signURL res: ', j(res))

                if (!res.signedURL) {
                    // k('signURL res no url: ', res)

                    var message = 'There was a problem getting the media for this product. Please contact support.'
                    if (res.messageCode && res.messageCode === "userDoesNotHaveAccess") message = 'You do not have access to this product. Please contact support if you are experiencing an issue.'

                    this.$q.notify({
                        message: message,
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })

                } else {
                    this.$store.commit('setCurrentChapter', this.chapters[newChapterIndex])
                    this.$store.commit('setCurrentChapterIndex', newChapterIndex)

                    this.startMediaPlayEvent(0, 'video')

                    this.addCaptionTracks(res)
                    this.addVideoSources(res)
                    this.setStartSeconds()
                }
            })
        },

        setStartSeconds() {
            k('set start seconds: ', this.currentChapter)
            // k('chapterStartSecondsToPlayFrom: ', this.chapterStartSecondsToPlayFrom)
            // k('chapterStartSeconds: ', this.currentChapter.chapterStartSeconds)
            // k('chapterOffset: ', this.currentChapter.chapterOffset)
            // k('firstChapterPlayed: ', this.firstChapterPlayed)
            // k('are there chapterStartSecondsToPlayFrom? ', this.chapterStartSecondsToPlayFrom)

            if (!this.firstChapterPlayed) {
                var startPosition = this.chapterStartSecondsToPlayFrom || this.currentChapter.chapterStartSeconds || this.currentChapter.chapterOffset || 0
                kw('set new playhead position: ', startPosition)

                document.getElementById('purpleVideo_html5_api').currentTime = startPosition

                // TODO: find out why setting this.playerOptions.start does not work in all cases
                this.playerOptions.start = startPosition
            } else {
                this.playerOptions.start = 0
                this.firstChapterPlayed = false
            }

            if (this.chapterStartSecondsToPlayFrom) this.$store.commit('chapterStartSecondsToPlayFrom', '')
        },

        addVideoSources(res) {
            kw('add video sources')

            this.playerOptions.sources = []
            this.playerOptions.sources.push({
                type: 'video/mp4',
                src: res.signedURL
            })
        },

        addCaptionTracks(res) {
            k('vtt subtitles: ', res.subtitles)

            this.playerOptions.tracks = []

            if (res.subtitles && res.subtitles.length) {
                // this.playerOptions.tracks = []

                res.subtitles.forEach((captionObj) => {
                    k('captionObj: ', captionObj)
                    captionObj.src = captionObj.file
                    this.playerOptions.tracks.push(captionObj)
                })
            } else {
                k('no vtt subtitles')
            }
        },

        generateNestedChapters() {
            k('generateNestedChapters: ', this.currentProduct.productJSON.video)

            var array = JSON.parse(JSON.stringify(this.currentProduct.productJSON.video))

            var max = 0
            for (var i = 0; i < array.length; i++) {
                array[i].expanded = false
                if (max < array[i].nestLevel) {
                    max = array[i].nestLevel
                }
                if (!array[i].children) {
                    array[i].children = []
                }
                if (!array[i].showNested) {
                    array[i].showNested = false
                }
            }
            for (max; max > 0; max--) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].nestLevel) {
                        while (array[i] && max == array[i].nestLevel) {
                            array[i - 1].children.push(array[i])
                            array.splice(i, 1)
                        }
                    }
                }
            }

            k('nestedChapters: ', array)
            this.$store.commit('nestedChapters', array)
        },
    },

    watch: {
       currentProduct() {
           k('currentProduct WATCH: ', this.currentProduct)
       }
    }
}
