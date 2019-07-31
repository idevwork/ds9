<template>
    <div :style="styleCurrentContext">

        <q-inner-loading :visible="showLoader" />

        <div class="top-navigation gt-sm">
            <q-slide-transition>
                <div class="search" v-if="showSearch">
                    <q-search v-model="word" :after="[{
                            icon: 'fa-times',
                            content: true,
                            handler() {
                                word = '';
                                showSearch = false
                            }
                        }]"
                    />
                </div>
            </q-slide-transition>

            <div class="row justify-center" style="border-bottom: 2px solid rgba(34, 36, 38, 0.15);">
                <q-btn v-for="filter in topFilters" no-ripple class="no-shadow text-bold" :label="filter" @click="filterByFilter(filter)" :class="{'active': filter === selectedFilter}" :key="filter" />
                <q-btn class="no-shadow" icon="fa-search" @click="showSearch = !showSearch" style="padding: .5rem;" />
            </div>

            <div class="row flex-auto-grow" style="border-bottom: 2px solid rgba(34, 36, 38, 0.15);">
                <div v-for="source in topSources" :key="source.id">
                    <q-btn class="no-shadow full-width text-bold" no-ripple :class="{'active': source.id === selectedSource.id}" @click="filterBySource(source)" :style="{color: source.color}">
                        <span style="text-transform: initial;">{{source.name}}</span>
                    </q-btn>
                </div>
            </div>

        </div>

        <div class="mobile-menu lt-md" style="padding-top: 10px;">
            <div class="row">
                <div class="col-xs-6">
                    <q-btn @click="showMobileMenu = true" flat class="lt-md full-width">
                        <q-icon name="fa-filter" style="font-size: 1.5rem !important;" /> Filters

                        <span class="mobile-selected-filters" v-if="selectedFilter !== 'All' || selectedSource.id !== 'all'">
                            &nbsp;(<span v-if="selectedFilter !== 'All'">{{selectedFilter}}</span><span v-if="selectedSource.id !== 'all'">{{selectedSource.name}}</span>)
                        </span>
                    </q-btn>
                </div>
                <div class="col-xs-6">
                    <q-btn @click="showSearch = !showSearch" flat class="lt-md full-width">
                        <q-icon name="fa-search" style="font-size: 1.5rem !important;" /> Search
                    </q-btn>
                </div>
            </div>

            <q-modal v-model="showMobileMenu" :style="{ backgroundColor: navBackgroundColor }" maximized content-classes="text-white bg-dark" content-css="padding: 2rem;">
                <div class="text-right">
                    <q-btn @click="showMobileMenu = false" flat>
                        <q-icon name="fa-times" />
                    </q-btn>
                </div>

                <div class="row gutter-sm" style="margin-top: 10px;">
                    <div class="col-xs-3" v-for="filter in topFilters" :key="filter" style="margin-top: 5px;">
                        <q-btn class="full-width" :outline="filter !== selectedFilter" :color="filter !== selectedFilter ? 'white' : 'primary'" :label="filter" @click="filterByFilter(filter); showMobileMenu=false;" style="text-transform: unset;" />
                    </div>
                </div>

                <div class="row gutter-sm" style="margin-top: 30px;">
                    <div class="col-xs-6" v-for="source in topSources" :key="source.id" style="margin-top: 5px;">
                        <q-btn :outline="source.id !== selectedSource.id" class="full-width" :color="source.id !== selectedSource.id ? 'white' : 'primary'" :label="source.name" @click="filterBySource(source); showMobileMenu=false;" style="text-transform: unset;" />
                    </div>
                </div>
            </q-modal>
        </div>

        <div v-if="!showLoader" class="page-container q-pa-lg" style="overflow: auto; height: calc(100vh - 14rem);">
            <div class="dictionary-videos">
                <div class="row gutter-sm" v-if="dictionaryVideos.length">
                    <div class="video col-sm-4 col-md-3 col-lg-2" v-for="(video, index) in dictionaryVideos" :key="index">
                        <q-btn class="full-width no-shadow relative text-white" :style="{backgroundColor: topSources.find(s => s.id === video.source).color}" @click="displayVideo(video)" style="text-transform: unset; border-radius: .5rem;">
                            <q-icon name="fa-play" class="absolute absolute-left absolute-middle" style="font-size: 1rem;" /> {{video.word}}
                        </q-btn>
                    </div>
                    <h3 v-if="!dictionaryVideos.length" class="text-center full-width"> No items match your criteria!</h3>
                </div>
            </div>
        </div>

        <q-modal v-model="showVideoModal" @hide="hideVideoModal" content-css="padding: 20px; min-width: 50vw;">
            <div class="middle-content" v-if="selectedVideo">
                <h4 class="modal-title text-bold relative-position">
                    {{selectedVideo.word}}
                    <q-btn flat class="absolute absolute-right absolute-middle" @click="showVideoModal = false">
                        <q-icon name="fa-times" />
                    </q-btn>
                </h4>
                <div class="modal-video">
                    <Video
                        :options="playerOptions"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                        @loadeddata="onPlayerLoadeddata($event)"
                        @playing="onPlayerPlaying($event)"
                        @timeupdate="onPlayerTimeupdate($event)"
                        @ended="onPlayerEnded($event)"
                        @error="onPlayerError($event)"
                        @ready="readyPlayer"
                    />
                </div>
            </div>

            <q-btn label="Replay video" class="full-width" color="blue" icon="fa-redo" @click="replayVideo" />
        </q-modal>
    </div>
</template>

<script>
    import Video from "../../common/player/PurpleVideo"
    import { videoPlayback } from "../../../mixins/videoPlayback"
    import { topNavTools } from "../../../mixins/topNavTools"
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { courseRabbitTools } from '../../../mixins/courseRabbitTools';

    export default {
        props: ["currentContext", "parentContext", "courseID"],

        components: {
            Video
        },

        mixins: [ globalComputedData, courseRabbitTools, videoPlayback, topNavTools ],

        data() {
            return {
                mediaUrl: "http://vault.platformpurple.com/static/productfiles/azst_signitasl-575/media",

                showLoader: false,

                showVideoModal: false,
                showSearch: false,

                topFilters: ["All"],

                topLessons: ["All"],

                topSources: [{
                    id: "All",
                    name: "All"
                },
                {
                    id: "sit",
                    name: "Sign It!",
                    color: "#3399cc"
                },
                {
                    id: "rts",
                    name: "TreeSchoolers Science",
                    color: "#9933ff"
                },
                {
                    id: "bst",
                    name: "Baby Signing Time!",
                    color: "#99cc33"
                }],

                videos: [],

                word: undefined,
                player: undefined,
                selectedVideo: undefined,
                selectedSource: {
                    id: "All",
                    name: "All"
                },
                selectedFilter: "All",
                selectedLesson: 'All'
            }
        },

        computed: {

            styleCurrentContext() {

                const background = this.currentContext.backgroundColor
                    ? this.currentContext.backgroundColor
                    : this.courseGlobal.defaultBackgroundColor

                return `min-height: calc(100vh - 150px); background: ${background};`
            },

            dictionaryVideos() {
                const { word, selectedFilter, selectedSource, selectedLesson } = this
                return this.videos.filter(v => {
                    return (
                        (word && word.length ?
                            v.word.toLowerCase().includes(word.toLowerCase()) :
                            true)
                        && (selectedFilter !== "All" ?
                            v.word.startsWith(selectedFilter) :
                            true)
                        && (selectedSource.id !== "All" ?
                            v.source === selectedSource.id :
                            true)
                        && (selectedLesson !== "All" ?
                            v.lesson == selectedLesson :
                            true)
                    )
                    // return true
                })
            },

            playerOptions() {
                const playerOptions = {

                    // component options
                    start: 0,
                    playsinline: true,

                    // videojs options
                    fluid: false,
                    autoplay: true,
                    controls: !this.hideControls,
                    muted: false,
                    language: 'en',
                    playbackRates: [0.5, 0.7, 1, 1.5, 2],
                    sources: [],
                    tracks: [],
                    height: '100%',
                    aspectRatio: '16:9'
                }

                if (this.selectedVideo) {
                    playerOptions.sources = [{
                        type: "video/mp4",
                        src: this.mediaUrl + this.selectedVideo.filename
                    }]
                }

                return playerOptions
            }
        },

        methods: {
            getDictionaryData(cb) {
                this.showLoader = true

                this.api.get(`${this.api.apiv4Route}api/client/signitasl/dictionaryJSON`, res => {
                    kw("SIGNIT DICTIONARY DATA: ", res)

                    this.showLoader = false
                    cb(res)
                })
            },

            filterBySource(source) {
                this.selectedSource = source
            },

            filterByFilter(filter) {
                this.selectedFilter = filter
            },

            filterByLesson(lesson) {
                this.selectedLesson = lesson
            },

            displayVideo(video) {
                kw('currentContext! ', this.currentContext)
                this.selectedVideo = video
                this.showVideoModal = true
            },

            replayVideo() {
                if (this.player) {
                    this.player.currentTime(0)
                    this.player.play()
                }
            },

            readyPlayer(player) {
                this.player = player
                player.play()
            },

            hideVideoModal() {
                this.selectedVideo = null
            },

            filterVideos(res) {
                var hashVideos = res.filter((v) => {
                    return v.word[0] == '#'
                })

                var dollarSignVideos = res.filter((v) => {
                    return v.word[0] == '$'
                })

                var filterVideos = res.filter((v) => {
                    return v.word[0] != '#' && v.word[0] != '$'
                })

                filterVideos = filterVideos.concat(hashVideos).concat(dollarSignVideos)
                k('filterVideos: ', filterVideos)

                this.videos = filterVideos
            },

            generateTopFilters(res) {
                // TODO: add dynamic sources like filters
                res.forEach(v => {
                    if (!this.topFilters.includes(v.word[0].toLowerCase())) {
                        this.topFilters.push(v.word[0].toLowerCase())
                    }
                    if (!this.topLessons.includes(v.lesson)) {
                        this.topLessons.push(v.lesson)
                    }
                })

                // TODO: make this dynamic
                var hashIndex = this.topFilters.indexOf('#')
                this.topFilters.splice(hashIndex, 1)
                this.topFilters.push('#')

                var dollarSignIndex = this.topFilters.indexOf('$')
                this.topFilters.splice(dollarSignIndex, 1)
                this.topFilters.push('$')

                // sort lessons
                this.topLessons.sort((a, b) => {
                    return a - b
                })
                k('topLessons: ', this.topLessons)
            }
        },

        mounted() {
            this.getDictionaryData(res => {
                k('get dictionary data: ', res)
                
                if (res.success) {
                    this.filterVideos(res.data)
    
                    this.generateTopFilters(res.data)
                }
            })
        }
    }
</script>

<style scoped>

    .dictionary-videos button {
        margin-bottom: 10px;
    }

    .flex-auto-grow>div {
        flex-grow: 1;
    }

    .top-navigation button {
        border-bottom: 2px solid transparent;
        border-radius: 0;
        margin-bottom: -2px;
    }

    .top-navigation button.active {
        border-color: #1b1c1d;
    }

    .search {
        padding: 1rem;
        background: #f8f8f9;
    }

    .modal-title {
        border-bottom: 1px solid #1b1c1d;
        margin-bottom: 10px;
    }

    .modal-video .video-js {
        max-width: 100%;
    }

    .mobile-menu {
        margin-bottom: 30px;
    }

    .mobile-selected-filters span:nth-child(n+2):before {
        content: ',';
    }

    @media screen and (max-width: 767px) {
        .modal-video .video-js {
            height: 300px;
        }
    }

    #watch {
       width: 100%;
       height: 100%;
    }

    .video-js {
        width: 100% !important;
        height: 100%
    }
</style>
