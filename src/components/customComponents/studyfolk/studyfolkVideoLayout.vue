<template>

    <div style="background: #000;">

        <q-modal
          v-model="openModal"
          :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout>
                <chapterMenu
                    :currentChapter="currentChapter"
                    @selectChapter="$parent.selectChapter"
                    @selectChapterHeading="$parent.selectChapterHeading"
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
            @ready="$emit('playerReady')"
        />

        <div id="playerTransport" class="row" style="position: relative;">
            <q-btn id="chapterMenuButton" size="lg" color="light" class="col transportButton" @click="openModal = true, $parent.togglePlay(true)">
                <q-icon name="fa-bars" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">chapters</span>
            </q-btn>

            <q-btn id="previousChapterBUtton" v-if="firstSelectableChapter" size="lg" color="light" class="col transportButton" @click="$parent.prevChapter()">
                <q-icon name="fa-step-backward" color="grey-9" />
            </q-btn>

            <q-btn id="playPauseButton" size="lg" color="light" class="col transportButton" @click="$parent.togglePlay()">
                <q-icon :name="videoPaused ? 'fa-play' : 'fa-pause'" color="grey-9" />
            </q-btn>

            <q-btn id="nextChapterButton" v-if="lastSelectableChapter" size="lg" color="light" class="col transportButton" @click="$parent.nextChapter()">
                <q-icon name="fa-step-forward" color="grey-9" />
            </q-btn>

            <q-btn id="advancedControlsButton" size="lg" color="light" class="col transportButton" @click="advancedPlaybackControls = !advancedPlaybackControls">
                <q-icon name="fa fa-cogs" style="margin-right: .5rem;" :color="advancedPlaybackControls ? 'primary' : 'grey-9'" />
                <span class="gt-sm">advanced</span>
            </q-btn>
        </div>

        <div v-if="advancedPlaybackControls" id="advancedControls" class="row">
            <q-btn id="loopInBtn" size="lg" color="light" class="col transportButton" @click="setLoopIn()">
                <q-icon name="fa-undo" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">loop in</span>
                <span class="lt-md">in</span>
                <q-chip v-if="loopInPoint" color="primary" style="margin-left: .5rem;">
                    {{Math.round(loopInPoint)}}
                </q-chip>
            </q-btn>

            <q-btn id="loopToggleBtn" size="lg" :color="loopOn ? 'primary' : 'light'" class="col transportButton" @click="loopOn = !loopOn">
                <q-icon name="fa-sync-alt" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">toggle</span>
            </q-btn>

            <q-btn id="loopOutBtn" size="lg" color="light" class="col transportButton" @click="setLoopOut()">
                <q-icon name="fa-undo" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">loop out</span>
                <span class="lt-md">out</span>
                <q-chip v-if="loopOutPoint" color="primary" style="margin-left: .5rem;">
                    {{Math.round(loopOutPoint)}}
                </q-chip>
            </q-btn>

            <q-btn id="videoSpeedBtn" size="lg" color="light" class="col transportButton" @click="cyclePlaybackRate()">
                <q-icon name="fa-dashboard" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">video speed {{currentPlaybackRate + 'x'}}</span>
                <span class="lt-md">{{currentPlaybackRate + 'x'}}</span>
            </q-btn>
        </div>

        <div class="row" style="background: #fff; padding: 1rem;">
            <p id="currentChapterName" align="center" class="col-12" style="font-size: 140%;">{{currentChapter.displayName}}</p>
        </div>

        <div class="row" style="background: #1B1C1D; color: #fff; padding: 1rem;">
            <h5 id="currentProductName" align="center" class="col-12">{{currentProduct.productName}}</h5>
            <p v-html="currentProduct.byLine" />
            <p style="margin-top: 1rem; text-align: center;">Once you've completed this course, click <a :href="'https://studyfolkexams.com/' + currentProduct.productID" target="_blank">here to take the exam!</a></p>
        </div>

    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import chapterMenu from '../../common/player/chapterMenu'
    import MediaMenu from '../../common/player/MediaMenu'
    import { videoPlayback } from '../../../mixins/videoPlayback'

    export default {
        props: ['currentChapter', 'playerOptions'],

        mixins: [videoPlayback],

        components: {
            chapterMenu, MediaMenu, PurpleVideo
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
            }
        }

    }
</script>

<style scoped>
    #watch {
        width: 100%;
        margin: 0 auto;
        height: 100%;
        max-width: 1440px;
    }

    .transportButton {
        padding: .5rem;
        color: #000 !important;
    }

    .q-icon {
        font-size: 1rem;
    }

    .q-btn-big {
        min-height: 44px !important;
    }

    /*.video-js.vjs-custom-skin, .vjs-tech {*/
    /*    height: 100%;*/
    /*    max-height: 60vh !important;*/
    /*}*/

</style>
