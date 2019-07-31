<template>

    <div style="background: #000;">
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
            @ready="playerIsReady"
        />
    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import { videoPlayback } from '../../../mixins/videoPlayback'

    export default {
        props: ['currentChapter', 'playerOptions', 'hideControls'],

        mixins: [videoPlayback],

        components: {
            PurpleVideo
        },

        data() {
          return {
            isDisplayingSubtitles: false,
            isMuted: false,
            player: null
          }
        },

        methods: {
          playerIsReady(player) {
            this.player = player
            this.$emit('playerReady', player)
          }
        },

        watch: {
            videoPaused() {
                k('videoPaused: ', this.videoPaused)
            }
        },

        created() {
            this.playerOptions.aspectRatio = '16:9'
        }

    }
</script>

<style scoped>
   #watch {
       width: 100%;
       height: 100%;
   }
</style>
