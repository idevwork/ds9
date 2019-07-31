<template>
  <div>

    <h1> HEY </h1>

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

  </div>
</template>

<script>
    import c from '../js/logs'

    import PurpleVideo from '../components/common/player/PurpleVideo'
    import { videoPlayback } from '../mixins/videoPlayback'
    import { videoTools } from '../mixins/videoTools'

    export default {
        data() {
            return {
                startDate: ''
            }
        },
        
        mixins: [ videoPlayback, videoTools ],
        
        components: {
            PurpleVideo  
        },

        created() {
            this.playerOptions.sources.push({
                type: 'video/mp4',
                src: 'https://vault.platformpurple.com/static/clients/mypvolve/CEL032519B_Pball_Pmat_032719_MD_STEMS.mov'
            })
        }
    }
</script>