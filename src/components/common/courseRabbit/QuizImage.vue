<template>
    <div class="row justify-center" style="padding: 2rem 0;">
        <div class="col-12" align="center" style="padding: 1rem 0;">
            <h4>{{currentContext.quizQuestionText}}</h4>
        </div>
        <div class="col-sm-12">
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

export default {
    props: [
        'currentContext',
        'parentContext',
        'nextQuestion',
        'isReviewMode'
    ],

    created() {
        this.loadIt('QuizAnswersList', 'common/courseRabbit/QuizAnswersList')
    }
}
</script>
