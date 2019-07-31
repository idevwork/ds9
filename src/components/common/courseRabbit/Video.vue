<template>
    <div
        class="col-12"
        :is="videoLayout"
        :playerOptions="playerOptions"
        :hideControls="hideControls"
        :currentChapter="currentChapter"
        :currentContext="currentContext"
        @setVideoID="setVideoID"
        @playerReady="playerReady"
        @togglePlay="togglePlay"
        @nextChapter="$emit('nextSibling')"
        @prevChapter="$emit('previousSibling')"
    />
</template>

<script>
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import DefaultVideoLayout from '../player/DefaultVideoLayout'
    import c from '../../../js/logs'
    import { courseRabbitTools } from '../../../mixins/courseRabbitTools';
    import { videoTools } from '../../../mixins/videoTools';

    export default {
        props: [
            'componentData',
            'courseID',
            'courseContextID',
            'currentContext',
            'parentContext',
            'hideControls'
        ],

        components: {
            DefaultVideoLayout
        },

        mixins: [mediaTimeTracking, globalComputedData, courseRabbitTools, videoTools],

        data() {
            return {
                videoLayout: ''
            }
        },

        computed: {
            chapters() {
                return this.parentContext.children
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
            }
        },

        methods: {

            initPlayback() {

                k('initPlayback!')
                this.playChapter(this.chapterIndexToStartFrom || 0)
            },

            playerReady(player) {

                kw('playerIsReady')
                this.$emit('playerIsReady', player)
            },

            setVideoID(id) {

                k('videoID', id)
                this.videoID = id
            },

            togglePlay(pauseOnly) {

                let el = document.getElementById(this.videoID)

                kw('togglePlay: ', this.videoID)
                k('videoPaused: ', el.paused, pauseOnly)

                if (el.paused && !pauseOnly) {
                    el.play()
                } else {
                    el.pause()
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

                for (let i = 0; i < this.chapters.length; i++) {
                    if (this.chapters[i].chapterOffset) this.chapters[i].chapterStartSeconds = this.chapters[i].chapterOffset
                    if (this.chapters[i].fileName === chapter.fileName && this.chapters[i].chapterStartSeconds === chapter.chapterStartSeconds) {
                        break;
                    }
                }

                this.playChapter(i)
            },

            playChapter(newChapterIndex) {
                k('playChapter: ', this.courseMedia, this.currentContext)
                this.$store.commit('setCurrentChapter', this.currentContext)

                let videoFileFromMediaIndex = -1
                let videoFileFromMediaObj

                if (this.courseMedia.video) {
                    videoFileFromMediaIndex = this.courseMedia.video.findIndex(video => {
                        return this.currentContext.fileName ?
                            video.fileName === this.currentContext.fileName :
                            video.parent === this.currentContext.id
                    })
                    videoFileFromMediaObj = this.courseMedia.video[videoFileFromMediaIndex]
                
                    this.$store.commit('setCurrentChapterIndex', videoFileFromMediaIndex)
                }

                let route = `${this.api.apiv4Route}api/product/signedCourseURL`

                var req = {
                    mediaType: 'video',
                    productSKU: this.currentProduct.productSKU,
                    // url: `http://vault.platformpurple.com${videoFileFromMediaObj.remotePath}`,
                    fileName: videoFileFromMediaObj.fileName,
                    userLoginToken: this.userLoginToken
                }
                k('signURL req: ', j(req))

                this.api.post(route, req, (res) => {
                    k('signURL res: ', j(res))

                    if (!res.signedURL) {

                        let message = 'There was a problem getting the media for this product. Please contact support.'
                        if (res.messageCode && res.messageCode === "userDoesNotHaveAccess") message = 'You do not have access to this product. Please contact support if you are experiencing an issue.'

                        this.$q.notify({
                            message: message,
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                        return false
                    }

                    this.startMediaPlayEvent(0, 'video')

                    this.addCaptionTracks(res)
                    this.addVideoSources(res)
                    this.setStartSeconds()
                })
            },

            setStartSeconds() {

                k('set start seconds: ', this.currentChapter)
                k('firstChapterPlayed: ', this.firstChapterPlayed)
                k('are there chapterStartSecondsToPlayFrom? ', this.chapterStartSecondsToPlayFrom)

                if (!this.firstChapterPlayed) {
                    this.playerOptions.start = this.chapterStartSecondsToPlayFrom || this.currentChapter.chapterStartSeconds || this.currentChapter.chapterOffset || 0
                } else {
                    this.playerOptions.start = 0
                    this.firstChapterPlayed = false
                }

                if (this.chapterStartSecondsToPlayFrom) this.$store.commit('chapterStartSecondsToPlayFrom', '')
            },

            addVideoSources(res) {
                kw('add video sources: ', res)
                this.playerOptions.sources = []

                this.$nextTick(() => {
                    this.playerOptions.sources.push({
                        type: 'video/mp4',
                        src: res.signedURL
                    })
                })
            },

            addCaptionTracks(res) {
                k('vtt subtitles: ', res.subtitles)
    
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
            }
        },

        created() {

            kw('created Video: ', this.currentContext, this.componentData)

            this.videoLayout = 'DefaultVideoLayout'

            if(this.currentContext.hasOwnProperty('fileName')) {
                this.videoLayout = this.currentContext.videoLayout
                this.loadIt(this.videoLayout, this.currentContext.videoLayoutPath)
            } else if(this.componentData.videoLayout) {
                this.videoLayout = this.componentData.videoLayout
                this.loadIt(this.videoLayout, this.componentData.videoLayoutPath)
            }

            k('VIDEO FILENAME: ', this.componentData.fileName)
            k('VIDEO chapters: ', this.chapters)
            this.initPlayback()
        },

        // change video source on current context change
        watch: {
            currentContext() {
                k('currentContext: ', this.currentContext, this.componentData.component)
                this.initPlayback()
            }
        },

        beforeDestroy() {
            this.sendCurrentMediaPlayEventIfExists()
        }
    }
</script>

<style>
    
</style>
