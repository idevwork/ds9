<template>
    <div class="well row">
        <div class="col-12">
            <div class="text-center">
                <h1 class="score-title text-bold">{{percentageCorrect}}%</h1>
                <h2 class="score-subtitle">
                    <q-icon name="fa fa-check" color="green" />
                    Your quiz is complete! You got {{userCorrectAnswers.length}}/{{quizQuestions.length}} correct.
                </h2>
            </div>
        </div>

        <div class="col-12" style="padding: .5rem;">
            <h3>Overview:</h3>

            <div class="shadow-2 round-borders bg-white row justify-center">

                <span
                    v-for="(question, index) in quizQuestions"
                    :key="question.id"
                    class="q-pa-md col-1"
                    align="center"
                    style="min-width: 3rem;"
                >
                    {{index + 1}}.
                    <q-icon v-if="matchQuestion(question)" name="fa fa-check" color="green"/>
                    <q-icon v-else name="fa fa-times" color="red"/>
                </span>
            </div>
        </div>

        <div class="col-12">
            <div class="row" v-if="!showRetakeButton">
                <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                    <q-btn
                        label="Review Incorrect Items"
                        icon-right="fa-eye"
                        color="red"
                        align="center"
                        class="full-width"
                        @click="$emit('reviewQuiz')"
                    />
                </div>
                <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                    <q-btn
                        label="Retake"
                        icon-right="fa-redo"
                        color="grey"
                        align="center"
                        class="full-width"
                        @click="retakeQuiz"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12" style="padding: .5rem;">
                    <q-btn
                        color="green"
                        label="Next"
                        icon-right="fa-chevron-right"
                        class="full-width"
                        @click="$emit('nextSibling')"
                    />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { globalComputedData } from '../../../mixins/globalComputedData';
import { courseRabbitTools } from '../../../mixins/courseRabbitTools';

export default {
    props: [
        'currentContext',
        'parentContext',
        'componentData'
    ],

    mixins: [globalComputedData, courseRabbitTools],

    computed: {
        quizQuestions() {
            return this.componentData.children.map(item => this.findCourseDataBy(item))
        },

        percentageCorrect() {
            return Math.round( this.userCorrectAnswers.length / this.quizQuestions.length * 100 ) || 0
        },

        showRetakeButton() {
            return this.userCorrectAnswers.length === this.quizQuestions.length
        }
    },

    methods: {
        retakeQuiz() {
            this.localStorage.set('user_answers', [])
            this.$emit('retakeQuiz')
        },

        matchQuestion(question) {
            k('matchQuestion', this.userCorrectAnswers)
            return this.userCorrectAnswers.find(item =>
                {
                    return item.productID === this.currentProduct.productID
                    && item.quizID === this.parentContext.id
                    && item.questionID === question.id
                }
            )
        }
    }
}
</script>

<style>
    .score-title {
        margin-bottom: 15px;
        font-size: 56px;
    }
    .score-subtitle {
        margin-bottom: 50px;
    }
    .score-subtitle .q-icon {
        font-size: 35px;
    }

    @media screen and (max-width: 767px) {
        .score-title {
            font-size: 36px;
        }
        .score-subtitle {
            font-size: 24px;
        }
        h3 {
            font-size: 21px;
        }
        .score-subtitle .q-icon {
            font-size: 20px;
        }
        .score-actions button {
            margin-bottom: 10px;
        }
    }
</style>
