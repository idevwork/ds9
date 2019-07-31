<template>

    <div style="background: #000;">

        <q-modal
          v-model="openModal"
          :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout>
                <chapterMenu
                    :currentChapter="currentChapter"
                    @selectChapter="$emit('selectChapter', $event)"
                    @selectChapterHeading="$emit('selectChapterHeading', $event)"
                    @closeChapters="openModal = false"
                />
            </q-modal-layout>
        </q-modal>

        <MediaMenu v-if="currentMediaType !== 'html5'" slot="header" style="z-index: 0;" />

        <q-inner-loading :visible="!currentChapter" style="z-index: 999;" />

        <purple-video
            ref="videoPlayer"
            id="watch"
            :options="playerOptions"
            v-if="playerOptions.sources && playerOptions.sources.length"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @playing="onPlayerPlaying($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @ended="onPlayerEnded($event)"
            @error="onPlayerError($event)"
            @ready="playerReady($event)"
        />

        <div id="playerTransport" class="row" style="position: relative;">
            <q-btn id="chapterMenuButton" v-if="!hideChapterSelect" flat size="lg" class="col bg-grey-4 transportButton" @click="openModal = true, $emit('togglePlay', true)">
                <q-icon name="fa-bars" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">chapters</span>
            </q-btn>

            <q-btn id="previousChapterButton" v-if="firstSelectableChapter" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('prevChapter')">
                <q-icon name="fa-step-backward" color="grey-9" />
            </q-btn>

            <q-btn id="playPauseButton" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('togglePlay')">
                <q-icon v-if="videoPaused" name="fa-play" color="grey-9" />
                <q-icon v-if="!videoPaused" name="fa-pause" color="grey-9" />
            </q-btn>

            <q-btn id="nextChapterButton" v-if="lastSelectableChapter" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('nextChapter')">
                <q-icon name="fa-step-forward" color="grey-9" />
            </q-btn>

            <q-btn id="advancedControlsButton" v-if="!hideAdvancedControls" flat size="lg" class="col bg-grey-4 transportButton" @click="advancedPlaybackControls = !advancedPlaybackControls">
                <q-icon name="fa fa-cogs" style="margin-right: .5rem;" :color="advancedPlaybackControls ? 'primary' : 'grey-9'" />
                <span class="gt-sm">advanced</span>
            </q-btn>
        </div>

        <div v-if="advancedPlaybackControls" id="advancedControls" class="row" style="border-top: 1px solid #999;">
            <div class="col-12 bg-grey-2" v-if="advancedPlaybackControlDesc">
                <div style="padding: 1rem;">
                    <p style="margin: 0; font-size: .9rem;" align="center">
                        The advanced controls allow you to set an in point <q-icon name="fas fa-undo" style="margin-right: .5rem;" color="grey-9" />LOOP IN, set an out point <q-icon name="fas fa-undo" style="margin-right: .5rem;" color="grey-9" />LOOP OUT and toggle looping on and off <q-icon name="fas fa-sync-alt" style="margin-right: .5rem;" color="grey-9" />TOGGLE.
                        <span v-if="showSpeedControl" style="margin: 0; font-size: .9rem;">You can also select the playback speed of the video.</span>
                    </p>
                </div>
            </div>

            <q-btn id="loopInBtn" flat size="lg" class="col bg-grey-4 transportButton" @click="setLoopIn()">
                <q-icon name="fas fa-undo" color="grey-9" style="font-size: .8rem; margin-right: .5rem;" />
                <span class="gt-sm">loop in</span>
                <span class="lt-md" style="font-size: .8rem;">in</span>
                <span v-if="loopInPoint" class="pchip" style="margin-left: .5rem;">
                    {{ Math.round(loopInPoint) }}
                </span>
            </q-btn>

            <q-btn id="loopToggleBtn" flat size="lg" :class="'col transportButton ' + (loopOn ? 'bg-blue' : 'bg-grey-4')" @click="loopOn = !loopOn">
                <q-icon name="fas fa-sync-alt" style="font-size: .8rem; margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">toggle</span>
            </q-btn>

            <q-btn id="loopOutBtn" flat size="lg" class="col bg-grey-4 transportButton" @click="setLoopOut()">
                <q-icon name="fas fa-undo" color="grey-9" style="font-size: .8rem; margin-right: .5rem;" />
                <span class="gt-sm">loop out</span>
                <span class="lt-md" style="font-size: .8rem;">out</span>
                <span v-if="loopOutPoint" class="pchip" style="margin-left: .5rem;">
                    {{ Math.round(loopOutPoint) }}
                </span>
            </q-btn>

            <div v-if="showSpeedControl" id="videoSpeedBtn" class="col bg-grey-4 transportButton">
                <q-select align="center" class="full-width" v-model="currentPlaybackRate" :options="playbackRatesForSelection" @input="changePlaybackRate" style="padding: .25rem; font-size: 1rem;" />
            </div>

            <div class="col-2 bg-grey-4 transportButton" align="center">
                <q-btn id="advancedPlaybackControlBtn" flat round size="sm" @click="advancedPlaybackControlDesc = !advancedPlaybackControlDesc" :style="`background: ${brandColor};`">
                    <q-icon name="fas fa-question" style="margin-right: .5rem; font-size: .9rem;" :color="advancedPlaybackControlDesc ? 'blue' : 'white'" />
                </q-btn>
            </div>
        </div>

        <div class="row" style="background: #fff; padding: 1rem;">
            <h5 id="currentChapterName" align="center" class="col-12">{{currentChapter.displayName}}</h5>
        </div>

        <div class="row" style="background: #1B1C1D; color: #fff; padding: 1rem;">
            <h5 id="currentProductName" align="center" class="col-12">{{currentProduct.productName}}</h5>
        </div>

    </div>

</template>

<script>
    import PurpleVideo from './PurpleVideo'
    import chapterMenu from './chapterMenu'
    import MediaMenu from './MediaMenu'
    import { videoPlayback } from '../../../mixins/videoPlayback'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['currentChapter', 'playerOptions', 'hideAdvancedControls', 'hideChapterSelect'],

        mixins: [videoPlayback, globalComputedData],

        components: {
            chapterMenu, MediaMenu, PurpleVideo
        },

        data() {
            return {
                layoutExtraHeight: 268
            }
        },

        computed: {
            nestedChapters() {
                return this.$store.state.nestedChapters
            },

            currentChapterIndex() {
                return this.$store.state.currentChapterIndex
            },

            firstSelectableChapter() {
                let nonMovieChapter = this.nestedChapters[0] && this.nestedChapters[0].nonMovieChapter
                let firstSelectableChapter = nonMovieChapter ? this.currentChapterIndex > 1 : this.currentChapterIndex > 0

                return firstSelectableChapter
            },

            lastSelectableChapter() {
                let lastChapter = this.currentChapterIndex < this.chapters.length - 1

                return lastChapter
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
            }
        },

        methods: {
            playerReady() {
                this.onResize()
                this.$emit('playerReady')
            },

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
        }

    }
</script>

<style scoped>
    #watch {
        width: 100%;
        margin: 0 auto;
        /*height: 100%;*/
        /*max-width: 1440px;*/
        /*max-height: calc(100vh - 268px) !important;*/
        /*overflow: hidden;*/
    }

    .pchip {
        font-size: .8rem;
        background: #2196f3;
        color: #000;
        padding: .1rem .3rem;
        /*margin: .25rem;*/
        border-radius: .2rem;
        /*float: right;*/
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
