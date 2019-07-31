<template>
    <div
        :currentChapter="currentChapter"
        :playerOptions="playerOptions"
        :is="videoLayout"
        @setVideoID="setVideoID"
        @playerReady="playerReady"
        @togglePlay="togglePlay"
        @nextChapter="nextChapter"
        @prevChapter="prevChapter"
        @selectChapter="selectChapter"
        @selectChapterHeading="selectChapterHeading"
    />
</template>

<script>
    import DefaultVideoLayout from './DefaultVideoLayout'
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
    import { videoTools } from '../../../mixins/videoTools'
    import c from '../../../js/logs'

    export default {

        props: ['videoLayout'],

        components: {
            DefaultVideoLayout
        },

        mixins: [mediaTimeTracking, videoTools],

        mounted() {
            k('videoHold mounted: ', this.chapterIndexToStartFrom)
            this.$store.commit('setCurrentChapter', '')
            this.$store.commit('setCurrentChapterIndex', '')

            this.initPlayback()

            this.generateNestedChapters()

            document.addEventListener('keyup', this.keydownHandler)
        },

        watch: {
            chapterIndexToStartFrom() {
                k('watch chapterIndexToStartFrom: ', this.chapterIndexToStartFrom)
                if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.initPlayback()
            }
        },

        computed: {
            videoChapterArrowNavigation() {
                return this.$store.state.environment.json.e.videoChapterArrowNavigation
            }
        },

        methods:{
            arrowRight(){
                if (this.videoChapterArrowNavigation){
                    this.nextChapter()
                }
            },

            arrowLeft(){
                if (this.videoChapterArrowNavigation){
                    this.prevChapter()
                }
            },

            keydownHandler(evt){
                if(evt.key == 'ArrowRight') this.arrowRight()
                if(evt.key == 'ArrowLeft') this.arrowLeft()
            },
        },

        beforeDestroy() {
            this.$store.commit('setCurrentChapter', '')
            this.$store.commit('setCurrentChapterIndex', '')
            this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
            document.removeEventListener('keyup', this.keydownHandler)
        }

    }
</script>

<style>

</style>
