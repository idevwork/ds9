<template>
    <div :style="styleCurrentContext">
        <div
            v-if="!loading"
            class="scores-wrapper"
        >

            <div class="row row-air gutter-md">
                <div class="col-sm-5 col-xs-12">
                  <div class="certificate text-center">
                    <div class="certificate-sign inline-block bg-green relative-position text-white">
                        <q-icon
                            name="fa-certificate"
                            class="absolute absolute-center"
                        />
                    </div>
                  </div>
                </div>

                <div class="col-sm-7 col-xs-12">
                    <div class="score-details text-center">
                        <h2 class="text-bold" color="red"
                            :class="styleAverage(averagePercentage)">
                            {{ currentProduct.productName }}
                            <br>
                            Average quiz percentage: {{averagePercentage}}%
                        </h2>
                        <div v-if="scoresToShow.length">
                            <h5 class="text-bold">Quiz overview (most recent scores):</h5>
                            <q-scroll-area
                                v-if="scoresToShow.length"
                                style="height: 20rem;"
                            >
                                <div class="quiz-score text-left"
                                    v-for="(score, index) in scoresToShow"
                                    :key="index">
                            
                                    <p class="full-width no-shadow">
                                        <strong>{{quizContextTitle(score)}}:</strong>
                                        {{quizTitle(score)}} -
                                        <span :class="resultClass(score)">{{score.percentageCorrect}}%</span>
                                    </p>
                                </div>
                            </q-scroll-area>
                        </div>
                        <div v-else>
                            <h5 class="text-bold">
                                <i class="fa fa-ban"/> No results to be displayed
                            </h5>
                        </div>
                        
                    <div v-if="componentData.otherCourses" align="center" class="my-unit-scores">
                        <q-card class="bg-white q-pa-md">
                            <q-card-title>
                                <strong>Scores For My Units:</strong>
                            </q-card-title>
                            <q-card-main>
                                <q-btn
                                    v-for="course in otherCourses"
                                    :key="course.id"
                                    :style="{ background: defaultToolbarColor, color: '#fff', 'margin': '0 0 5px 5px' }"
                                    @click="route(`/play/${course.productID}/${courseContextID}`)">
                                    {{course.productName}}
                                </q-btn>
                            </q-card-main>
                        </q-card>
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <h3 v-if="loading" class="text-center full-width" style="padding: 30px 0"> Loading...</h3>
    </div>

</template>

<script>
    import c from '../../../js/logs'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { courseRabbitTools } from '../../../mixins/courseRabbitTools'

    export default {
        props: [
            'componentData',
            'courseID',
            'courseContextID',
            'currentContext',
            'parentContext'
        ],

        mixins: [globalComputedData, courseRabbitTools],

        computed: {
            styleCurrentContext() {
                const background = this.currentContext.backgroundColor ?
                    this.currentContext.backgroundColor :
                    this.courseGlobal.defaultBackgroundColor

                return {
                    'min-height': 'calc(100vh - 9.4rem)',
                    background
                }
            },

            courseRouteContext() {
                return this.courseRoute && this.courseGlobal.courseRoutes ? this.courseGlobal.courseRoutes.find(route => route.slug === this.courseRoute) : ''
            },

            scoresToShow() {
                let scoresToShow = []

                for(let courseId in this.userCourseCompletionData) {
                    const score = this.userCourseCompletionData[courseId]
                    const course = this.findCourseDataBy(courseId)

                    if(score.percentageCorrect !== undefined && course) {
                        scoresToShow.push(score)
                    }
                }

                return scoresToShow
            },

            averagePercentage() {
                k('averagePercentage: ', this.scoresToShow)

                let sum = 0
                let quizNr = 0

                this.scoresToShow.forEach(score => {
                    sum += score.percentageCorrect
                    quizNr++
                })

                return sum ? Math.round(sum / quizNr) : sum
            },

            otherCourses() {
                let courses = []

                for(let productID of this.componentData.otherCourses) {
                    const product = this.environmentProducts.find(product => product.productID === productID) || {}
                    if(product.userActiveProduct) {
                        courses.push(product)
                    }
                }

                return courses
            }
        },

        methods: {
            styleAverage(averagePercentage) {
                return {
                    'color-red': averagePercentage < 50,
                    'color-orange': averagePercentage >= 50 && averagePercentage < 70,
                    'color-green': averagePercentage >= 70
                }
            },

            stylePercentage(score) {
                return {
                    'color-red': score.percentageCorrect < 50,
                    'color-orange': score.percentageCorrect >= 50 && score.percentageCorrect < 70,
                    'color-green': score.percentageCorrect >= 70
                }
            },

            resultClass(score) {
                return {
                    'color-red': score.percentageCorrect < 50,
                    'color-orange': score.percentageCorrect >= 50 && score.percentageCorrect < 70,
                    'color-green': score.percentageCorrect >= 70
                }
            }
        },

        watch: {
            courseID() {
                this.getUserCompletionData()
            }
        },

        created() {
            this.getUserCompletionData()
        }
    }
</script>

<style>
    .scores-wrapper {
        padding: 30px 32px;
    }

    .certificate-sign i {
        font-size: 4rem;
    }

    .certificate-sign {
        min-width: 8rem;
        min-height: 8rem;
        border-radius: 50%;
    }

    .score-details h5 {
        padding: 10px 0;
        margin-bottom: 20px;
        border-top: 1px solid rgba(34, 36, 38, 0.15);
        border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    }

    .score-details h2 {
        margin-bottom: 15px;
    }

    .color-red {
        color: #db2828;
    }

    .color-green {
        color: #21ba45;
    }

    .color-orange {
        color: #f2c037;
    }

    .color-white {
        color: #fff;
    }

    .quiz-score span {
        margin-left: 4px;
    }

    .quiz-score strong {
        margin-right: 4px;
    }

    @media print {
        .my-unit-scores {
            display: none;
        }
    }
</style>
