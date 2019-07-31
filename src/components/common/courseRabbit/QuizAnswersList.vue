<template>
    <div class="row quiz-answers">
        <div
            v-for="(answer, index) in currentContext.quizAnswers"
            :class="answer.answerType === 'image' ? `col-sm-12 col-md-6 col-lg-3` : 'col-12'"
            :key="index"
            @click="saveUserAnswer(answer)">

            <image-loader v-if="answer.answerType === 'image'" :url="getImageUrl(answer)"/>

            <q-btn
                :class="buttonColor(answer)"
                class="no-shadow"
                :style="{ width: '100%', padding: '.5rem .5rem .5rem 1.5rem' }">
                <div v-if="!answer.answerType" style="position: absolute; left: .5rem;">{{index + 1}}.</div>
                    <q-icon name="fa fa-check" v-if="isReviewMode && answer.rightAnswer" />
                    <q-icon name="fa fa-times" v-if="isReviewMode && answer.userChoice && !answer.rightAnswer" />
                    <h6 style="text-transform: initial;">{{answer.answerText}}</h6>
            </q-btn>
        </div>
        <q-inner-loading :visible="showLoader" />
    </div>
</template>

<script>
import c from '../../../js/logs'
import ImageLoader from './ImageLoader'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { courseRabbitTools } from '../../../mixins/courseRabbitTools'

export default {
    props: ['currentContext', 'parentContext', 'isReviewMode'],

    data() {
        return {
            showLoader: false,
            baseImageUrl: 'http://vault.platformpurple.com/static',
        }
    },

    mixins: [ globalComputedData, courseRabbitTools ],

    components: {
        ImageLoader,
    },

    methods: {
        buttonColor(answer) {
            if (this.isReviewMode) {
                if (answer.rightAnswer) return 'bg-green'
                if (!answer.userChoice && !answer.rightAnswer) return 'bg-grey-4'
                if (!answer.rightAnswer) return 'bg-red'
            }
            return 'bg-grey-4'
        },
        
        saveUserAnswer(answer) {
            if (this.isReviewMode) {
                if (answer.rightAnswer) {
                    this.$emit('nextQuestion')
                }
                return
            }

            let userAnswers = this.localUserAnswers()
            k('userAnswers: ', userAnswers)

            const logEventObj = {
                eventType: 'quizResponse',
                productID: this.currentProduct.productID,
                userID: this.$store.state.user.info.userID,
                quizID: this.parentContext.id,
                questionID: this.currentContext.id,
                answerID: answer.id,
                answerCorrect: Boolean(answer.rightAnswer),
            }
            k('logEventObj: ', logEventObj)

            if (!userAnswers) {
                userAnswers = [logEventObj]
            } else {
                const sameAnswerIndex = userAnswers.findIndex(ans => {
                    return (
                        ans.productID === this.currentProduct.productID &&
                        ans.userID === this.$store.state.user.info.userID &&
                        ans.quizID === this.parentContext.id &&
                        ans.questionID === this.currentContext.id &&
                        ans.answerID === answer.id
                    )
                })

                if (sameAnswerIndex !== -1) {
                    userAnswers[sameAnswerIndex] = logEventObj
                } else {
                    userAnswers.push(logEventObj)
                }
            }

            k('userAnswers: ', userAnswers)
            this.localStorage.set('user_answers', userAnswers)

            this.api.sendEvent(logEventObj)
            this.$emit('nextQuestion')
        },
        
        getImageUrl(answer) {
            return `${this.baseImageUrl}${answer.remotePath}${answer.fileName}`
        }
    }
}
</script>

<style scoped>
.quiz-answers .bg-red,
.quiz-answers .bg-green {
    color: #ffffff;
}

img {
    max-width: 100%;
}

.quiz-answers > div {
    padding: 0.5rem;
    width: 100%;
}

.quiz-answers .image-answer {
    display: inline-block;
    max-width: 25%;
}
</style>
