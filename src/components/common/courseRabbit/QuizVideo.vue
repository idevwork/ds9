<template>

    <div class="row justify-center">
        <div class="col-12" align="center" style="padding: 1rem 0;">
            <h4>{{currentContext.quizQuestionText}}</h4>
        </div>

        <div class="col-sm-12 col-md-6" style="padding: .5rem 1rem;">
            <Video
                :currentContext="currentContext"
                :componentData="componentData"
                :parentContext="parentContext"
                :hideControls="true"
                @playerIsReady="readyPlayer"
            />
            <q-btn
                label="Replay video"
                class="full-width"
                color="blue"
                icon="fa-redo"
                @click="replayVideo"
            />
        </div>

        <div class="col-sm-12 col-md-6" style="padding: .5rem .5rem 3.5rem .5rem;">
            <QuizAnswersList
                :currentContext="currentContext"
                :parentContext="parentContext"
                :isReviewMode="isReviewMode"
                @nextQuestion="nextQuestion"
            />
        </div>
    </div>

</template>

<script>
    import Video from "./Video"

    export default {
        props: [
            'currentContext',
            'parentContext',
            'nextQuestion',
            'isReviewMode',
            'componentData'
        ],

        data() {
            return {
                player: null
            }
        },

        components: {
            Video
        },

        created() {
            this.loadIt('QuizAnswersList', 'common/courseRabbit/QuizAnswersList')
        },

        methods: {
            replayVideo() {
                if (this.player) {
                    this.player.currentTime(0)
                    this.player.play()
                }
            },
            readyPlayer(player) {
                this.player = player
                
                if (this.currentContext.type === 'question') {
                    this.player.muted(true)
                }
            }
        }
    }
</script>

<style scoped>
    .quiz-video .video-js {
      min-height: 300px;
      height: 100% !important;
    }
    
    [data-v-bd477b5a] >>> .video-js .vjs-volume-panel {
        display: none;
    }
</style>
