<template>
    <div :style="containerStyle">
        <div
            class="row air"
            style="padding: 1rem;"
            v-if="inReviewMode"
        >
            <div
                class="col-12"
                style="margin-bottom: 1rem;"
            >
                <h4 class="thickHeader">{{currentContext.title}}</h4>
            </div>

            <div class="col-2">
                <q-btn
                    :disable="quizIndex == 0"
                    class="full-width"
                    color="grey"
                    style="padding: .5rem;"
                    @click="previousQuestion"
                >

                    <q-icon name="fas fa-chevron-left" />
                    <span class="gt-sm">Previous</span>
                </q-btn>
            </div>

            <div
                class="col-8"
                style="padding: 0 1rem;"
                align="center"
            >
                <q-progress
                    stripe
                    animate
                    height="20px"
                    :percentage="quizProgress"
                    style="color: #99cc33;"
                />
                <h6 style="margin-top: .5rem; font-size: .8rem;">Question {{currentQuizNr}} / {{quizQuestionsNumber}}</h6>
            </div>

            <div class="col-2">
                <q-btn
                    class="full-width"
                    color="grey"
                    style="padding: .5rem;"
                    @click="nextQuestion"
                >
                    <span class="gt-sm">Next</span>
                    <q-icon name="fas fa-chevron-right" />
                </q-btn>
            </div>
        </div>

        <div class="row">
            <div v-if="!showLoader"
                class="col-12"
                :is="contextComponent"
                :parentContext="currentContext"
                :currentContext="currentQuizContext"
                :componentData="componentData"
                :nextQuestion="nextQuestion"
                :isReviewMode="isReviewMode"
                @retakeQuiz="retakeQuiz"
                @reviewQuiz="reviewQuiz"
                @nextSibling="handleNextSibling"
                @previousSibiling="$emit('previousSibling')"
              />
        </div>

        <q-inner-loading :visible="showLoader" />
    </div>
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { courseRabbitTools } from '../../../mixins/courseRabbitTools'

    export default {

        props: ['componentData', 'courseID', 'courseContextID', 'currentContext', 'parentContext'],

        data() {
            return {
                quizIndex: 0,
                contextComponent: "",
                isQuizComplete: false,
                isReviewMode: false,
                showLoader: false
            }
        },

        mixins: [ globalComputedData, courseRabbitTools ],

        components: {},

        computed: {
            inReviewMode() {
                return !this.isQuizComplete || this.isReviewMode
            },

            containerStyle() {
                const background = this.currentContext.backgroundColor || '#fff'
                return  {
                    background,
                    'min-height': 'calc(100vh - 150px)'
                }
            },

            currentQuizContext() {
                k('quizQuestions: ', this.quizQuestions, this.quizIndex, this.quizQuestions[this.quizIndex])
                                
                // this.quizQuestions.forEach((q) => k('QQQQ: ', q.id))
                
                return this.quizQuestions[this.quizIndex]
            },

            quizProgress() {
                let perc = (this.quizIndex + 1) / this.quizQuestions.length * 100
                k("quizProgress: ", perc)
                return perc
            },

            quizQuestionsNumber() {
                return this.quizQuestions.length
            },

            quizQuestions() {
                // in review mode attach user choice to answer
                if (this.isReviewMode) {
                    let userAnswers = this.localUserAnswers()

                    const output = this.componentData.children.map(questionID => {
                        let question = this.findCourseDataBy(questionID)

                        question.quizAnswers = question.quizAnswers.map(answer => {
                            let tempAnswer = {
                                ...answer,
                                userChoice: false
                            }
                            const userAnswer = userAnswers.find(item => item.quizID === this.currentContext.id && item.questionID === question.id)

                            if (userAnswer) {
                                tempAnswer.userChoice = answer.id === userAnswer.answerID
                            }

                            return tempAnswer
                        })

                        return question
                    }).filter(question => {
                        let userAnswer = userAnswers.find(item => item.quizID === this.currentContext.id && item.questionID === question.id)
                        return (userAnswer) ? !userAnswer.answerCorrect : true
                    })

                    return output
                }

                return this.componentData.children.map(item => this.findCourseDataBy(item))
            },

            currentQuizNr() {
                let quizIndex = this.quizQuestions.findIndex(question => this.currentQuizContext && question.id === this.currentQuizContext.id)
                return quizIndex + 1
            }
        },

        methods: {
            setQuizContextComponent() {
                k("currentQuizContext: ", this.currentQuizContext)

                this.contextComponent = ''

                if (this.currentQuizContext) {
                  this.$nextTick(() => {
                      this.loadIt(this.currentQuizContext.component, this.currentQuizContext.componentPath)
                      this.contextComponent = this.currentQuizContext.component
                  })
                }
            },

            previousQuestion() {
                if (this.quizIndex > 0) {
                    this.quizIndex--
                }
            },

            nextQuestion() {
                // go to next question
                if (this.quizIndex < this.quizQuestions.length) {
                    this.quizIndex++
                }

                if (this.quizIndex === this.quizQuestions.length) {
                    this.showLoader = true

                    // finished to answer all questions, display quiz score
                    if (!this.isReviewMode) {
                        this.saveQuizScore((res) => {
                            this.loadQuizScoreComponent()
                            this.isQuizComplete = true
                            this.isReviewMode = false
                            this.quizIndex = this.quizQuestions.length
                            this.showLoader = false
                        })
                    }
                    // we are in review mode and user finished to see all the ansers, go back to quiz score
                    else {
                        setTimeout(() => {
                            this.loadQuizScoreComponent()
                            this.isQuizComplete = true
                            this.isReviewMode = false
                            this.quizIndex = this.quizQuestions.length
                            this.showLoader = false
                        }, 0)
                    }
                }
            },

            saveQuizScore(cb) {
                const product = this.currentProduct.contentJSON
                
                // courseRabbitTools is not updating in time from the localStorage user_answers and this event is reported incorrectly, hardwired the same values straight into the scope of this function
                const id = this.componentData ? this.componentData.parent : this.parentContext.id
                const answers = this.localStorage.get('user_answers') || []
                
                let localUserAnswers = answers.filter(item => item.productID === this.currentProduct.productID && item.quizID === id)
                let userCorrectAnswers = localUserAnswers.filter(item => item.answerCorrect)
                
                k('saveQuizScore: ', this.userCorrectAnswers.length, this.quizQuestions.length, this.userCorrectAnswers.length / this.quizQuestions.length)

                // get chapter index
                const chapterIndex = this.parentContext.components.findIndex(
                    item => item.id === this.currentContext.id
                )

                let logEventObj = {
                    eventType: 'chapterComplete',
                    eventDesc: `user completed quiz ${this.currentContext.id} in product ${this.currentProduct.productID}`,
                    productID: this.currentProduct.productID,
                    productSKU: this.currentProduct.productSKU,
                    publisherID: this.currentProduct.publisherID,
                    userID: this.$store.state.user.info.userID,
                    contextID: this.currentContext.id,
                    percentageCorrect: Math.round( userCorrectAnswers.length / this.quizQuestions.length * 100 )
                }

                // log all answers to db
                k('quiz complete log: ', logEventObj)
                this.api.sendEvent(logEventObj, (res) => {
                    k('sendEvent: ', res)
                    this.$root.$emit('chapterComplete')
                    cb(res)
                })
            },

            initializeQuiz() {
                k('initializeQuiz: ', this.parentContext, this.contentJSON.content, this.componentData.children)
                
                if (this.currentContext.type === 'exam' && this.componentData.children.length == 0) {
                    // find siblings of current exam obj
                    // k('siblingIDs: ', this.siblingIDs)
                    
                    // collect ids for all sibling quiz questions 
                    let quizQuestionIDPool = this.getExamQuestionIDs(this.siblingIDs)

                    // calculate splice length
                    const length = parseInt(quizQuestionIDPool.length * 0.4)
                    // k('exam length: ', length)
                    
                    // splice and question ids
                    const questions = this.j_.cloneObject(this.j_.shuffleArray(quizQuestionIDPool).slice(0, length))
                    this.componentData.children = questions
                } else {
                    const questions = this.j_.cloneObject(this.componentData.children)
                    this.componentData.children = this.j_.shuffleArray(questions)
                }

                this.setQuizContextComponent()
            },
            
            getExamQuestionIDs(siblingIDs) {
                let quizQuestionIDPool = []
                
                siblingIDs.forEach((siblingID) => {
                    // get sibling data
                    let sibling = this.findCourseDataBy(siblingID)
                    // k('sibling: ', sibling)
                    
                    // find if data contains quiz component
                    let quizComponentData = sibling.components.find(component => component.component === 'Quiz')
                    if (quizComponentData) {
                        // k('quizComponentData:', quizComponentData)
                        // k('quizComponentData.children:', quizComponentData.children)
                        
                        // add each quiz question id to pool
                        quizComponentData.children.forEach(quizQuestionID => {
                            k(quizQuestionID)
                            let quizQuestionData = this.findCourseDataBy(quizQuestionID)
                            // k('quizQuestionData: ', quizQuestionData)
                            
                            if (quizQuestionData.type === 'question' && !quizQuestionData.notForLessonExam) {
                                if (quizQuestionIDPool.includes(quizQuestionID)) {
                                    // k('DUP: ', quizQuestionID)
                                } else {
                                    quizQuestionIDPool.push(quizQuestionID)
                                }
                            }
                        })
                    }
                })
                k('quizQuestionIDPool: ', quizQuestionIDPool.length, quizQuestionIDPool)
                
                return quizQuestionIDPool
            },

            shuffleQuiz() {
                const questions = this.j_.cloneObject(this.componentData.children)
                this.componentData.children = this.j_.shuffleArray(questions)
            },

            loadQuizScoreComponent() {
                this.loadIt("QuizScore", "common/courseRabbit/QuizScore")
                this.contextComponent = "QuizScore"
            },

            reviewQuiz() {
                this.isReviewMode = true
                this.quizIndex = 0
                
                this.setQuizContextComponent()
            },

            retakeQuiz() {
                this.isQuizComplete = false
                this.quizIndex = 0

                this.initializeQuiz()
                
                this.setQuizContextComponent()
            },

            handleNextSibling(score) {
                if (score) {
                    this.nextQuestion()
                }
                this.$emit('nextSibling')
            }
        },

        watch: {
            currentQuizContext() {
                k('currentQuizContext: ', this.currentQuizContext)
                this.setQuizContextComponent()
            },

            $route() {
                this.quizIndex = 0
                this.isQuizComplete = false

                this.initializeQuiz()
            }
        },

        created() {
            this.initializeQuiz()
        },

        mounted() {
            this.localStorage.set('user_answers', [])
        }
    }
</script>

<style>
</style>
