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
            @ready="$emit('playerReady')"
        />

        <div id="playerTransport" class="row" style="position: relative;">
            <q-btn id="chapterMenuButton" flat size="lg" class="col bg-grey-4 transportButton" @click="openModal = true, $emit('togglePlay', true)">
                <q-icon name="fa-bars" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">chapters</span>
            </q-btn>

            <q-btn id="previousChapterButton" v-if="firstSelectableChapter" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('prevChapter')">
                <q-icon name="fa-step-backward" color="grey-9" />
            </q-btn>

            <q-btn id="playPauseButton" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('togglePlay')">
                <q-icon :name="videoPaused ? 'fa-play' : 'fa-pause'" color="grey-9" />
            </q-btn>

            <q-btn id="nextChapterButton" v-if="lastSelectableChapter" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('nextChapter')">
                <q-icon name="fa-step-forward" color="grey-9" />
            </q-btn>

            <q-btn id="advancedControlsButton" flat size="lg" class="col bg-grey-4 transportButton" @click="advancedPlaybackControls = !advancedPlaybackControls">
                <q-icon name="fa fa-cogs" style="margin-right: .5rem;" :color="advancedPlaybackControls ? 'primary' : 'grey-9'" />
                <span class="gt-sm">advanced</span>
            </q-btn>
        </div>

        <div v-if="advancedPlaybackControls" id="advancedControls" class="row" style="border-top: 1px solid #999;">
            <q-btn id="loopInBtn" flat size="lg" class="col bg-grey-4 transportButton" @click="setLoopIn()">
                <q-icon name="fa-undo" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">loop in</span>
                <span class="lt-md">in</span>
                <span v-if="loopInPoint" class="pchip" style="margin-left: .5rem;">
                    {{Math.round(loopInPoint)}}
                </span>
            </q-btn>

            <q-btn id="loopToggleBtn" flat size="lg" :class="'col transportButton ' + (loopOn ? 'bg-blue' : 'bg-grey-4')" @click="loopOn = !loopOn">
                <q-icon name="fa-sync-alt" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">toggle</span>
            </q-btn>

            <q-btn id="loopOutBtn" flat size="lg" class="col bg-grey-4 transportButton" @click="setLoopOut()">
                <q-icon name="fa-undo" style="margin-right: .5rem;" color="grey-9" />
                <span class="gt-sm">loop out</span>
                <span class="lt-md">out</span>
                <span v-if="loopOutPoint" class="pchip" style="margin-left: .5rem;">
                    {{Math.round(loopOutPoint)}}
                </span>
            </q-btn>

            <div id="videoSpeedBtn" class="col bg-grey-4 transportButton">
                <q-select
                    align="center"
                    class="full-width"
                    v-model="currentPlaybackRate"
                    :options="playbackRatesForSelection"
                    @input="changePlaybackRate"
                    style="padding: .25rem; font-size: 1rem;"
                />
            </div>
        </div>

        <div class="row" style="background: #fff; padding: 1rem;">
            <p id="currentChapterName" align="center" class="col-12" style="font-size: 140%;">{{currentChapter.displayName}}</p>
        </div>

        <div class="row" style="background: #1B1C1D; color: #fff; padding: 1rem;">
            <h5 id="currentProductName" align="center" class="col-12">{{currentProduct.productName}}</h5>
        </div>

        <div class="row" style="padding: 1rem; background: #fff;">
            <div class="row well">
                <p style="margin-top: 1rem;" v-html="currentProduct.moreInfo"></p>
            </div>
        </div>

    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import chapterMenu from '../../common/player/chapterMenu'
    import MediaMenu from '../../common/player/MediaMenu'
    import { videoPlayback } from '../../../mixins/videoPlayback'
    import { productInfoTools } from '../../../mixins/productInfoTools'

    export default {
        props: ['currentChapter', 'playerOptions'],

        mixins: [videoPlayback, productInfoTools],

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

    /*.video-js.vjs-custom-skin, .vjs-tech {*/
    /*    height: 100%;*/
    /*    max-height: 60vh !important;*/
    /*}*/

</style>
