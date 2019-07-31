export const courseRabbitTools = {
    data() {
        return  {
            loading: false,
            quizContextTitle(score) {
                const courseDataForScore = this.findCourseDataBy(score.contextID)
                return courseDataForScore ? `${this.findCourseDataBy(courseDataForScore.parent).subTitle} > ${courseDataForScore.subTitle}` : ''
            },

            quizTitle(score) {
                const courseData = this.findCourseDataBy(score.contextID)
                return courseData ? courseData.title : ''
            },

            quizQuestionsFor(id) {
                let quizData = this.findCourseDataBy(id) && this.findCourseDataBy(id).components ? this.findCourseDataBy(id).components.find(comp => comp.component === 'Quiz') : ''
                return quizData ? quizData.children.map(id => this.findCourseDataBy(id)) : []
            },

            totalNumberOfQuizAnswers(id) {
                return this.quizQuestionsFor(id).length
            }
        }
    },

    computed: {
        contentJSON() {
            return (this.currentProduct && this.currentProduct.contentJSON) || {}
        },

        courseContent() {
            return (this.contentJSON && this.contentJSON.content) || []
        },

        courseGlobal() {
            return (this.contentJSON && this.contentJSON.global) || {}
        },

        courseMedia() {
            return (this.contentJSON && this.contentJSON.media) || {}
        },

        courseStartData() {
            return this.courseContent.find(contentItem => contentItem.courseStart)
        },

        defaultBackgroundColor() {
            return this.courseGlobal.defaultBackgroundColor || '#efefef'
        },

        defaultToolbarColor() {
            return this.courseGlobal.defaultToolbarColor || '#543B9A'
        },

        userCourseCompletionData() {
            return this.$store.state.userCourseCompletionData
        },

        userCourseCompletionIDs() {
            return this.userCourseCompletionData ? Object.keys(this.userCourseCompletionData): []
        },

        userCorrectAnswers() {
            k('userCorrectAnswers: ', this.localUserAnswers())
            return this.localUserAnswers().filter(item => item.answerCorrect)
        },
        
        siblingIDs() {
            return this.parentContext && this.parentContext.components && this.parentContext.components.find(component => !!component.children) ? this.parentContext.components.find(component => !!component.children).children : false
        }
    },
    
    methods: {
        // @vcpablo - 2019/06/03 - replaced the computed property for this method because computed cannot identify changes in local storage variables
        localUserAnswers() {
            const id = this.componentData ? this.componentData.parent : this.parentContext.id
            const answers = this.localStorage.get('user_answers') || []
            
            return answers.filter(item => item.productID === this.currentProduct.productID && item.quizID === id)
        },
        findCourseDataBy(id) {
            return this.courseContent.find(item => item.id === id)
        },
        getUserCompletionData() {
            this.loading = true
            // https://api-v4-dev2.platformpurple.com/api/userInfo/courseCompletionData

            this.api.get(`${this.api.apiv4Route}api/userInfo/courseCompletionData?userLoginToken=${this.userLoginToken}&productID=${this.courseID}`, res => {
                k('getUserCompletionData: ', res)

                if (res.success) this.$store.commit('userCourseCompletionData', res.data)
                this.loading = false
            })
        },
    }
}
