<template>
    <div>

        <q-inner-loading :visible="showLoader" />

        <div
            v-if="isVisibleContext"
            class="bg-grey-3 container"
            style="position: relative; padding-bottom: 30px;"
        >

            <div
                v-for="(section,index) in currentContext.components"
                :is="section.component"
                :key="index"
                :componentData="section"

                :courseID="courseID"
                :courseContextID="courseContextID"
                :currentContext="currentContext"
                :parentContext="parentContext"

                @nextSibling="handleSibling(1)"
                @previousSibling="handleSibling(-1)"

            />
        </div>

    </div>

</template>

<script>
import c from '../../../js/logs'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { courseRabbitTools } from '../../../mixins/courseRabbitTools'

export default {
    props: ['courseID', 'courseContextID'],

    data() {
        return {
            showLoader: true
        }
    },

    mixins: [courseRabbitTools, userAndProductInfo, globalComputedData],

    computed: {
        isVisibleContext() {
            return !this.showLoader && this.currentProduct && this.contentJSON
        },

        currentContext() {
            kw('pre currentContext: ', this.currentProduct, this.courseContextID)

            let currentContext = {}

            if (this.courseContent.length > 0) {
                currentContext = this.courseContextID
                    ? this.findCourseDataBy(this.courseContextID)
                    : this.courseStartData
            }

            kw('currentContext: ', currentContext)

            return currentContext
        },

        parentContext() {
            kw('pre parentContext: ', this.currentProduct, this.courseContextID)

            const parentContext = this.courseContextID ? this.courseContent.find(contentItem => contentItem.id === this.currentContext.parent) : {}

            k('parentContext: ', parentContext)

            return parentContext
        },
    },

    methods: {
        initCourse() {
            k('initCourse: ', this.courseID, this.courseContextID)
            k('current course data with added contentJSON: ', this.currentProduct)

            this.loadNeededComponents()

            this.showLoader = false
        },

        loadNeededComponents() {
            k('loadNeededComponents: ', this.currentContext)

            for (let component of this.currentContext.components) {
                this.loadIt(component.component, component.componentPath)
            }
        },

        goToNextCourse() {
            const userHasAccess = this.userHasAccess([this.courseGlobal.nextCourseProductID])

            k('goToNextCourse: ', this.courseGlobal.nextCourseProductID)
            k('goToNextCourse user access? ', userHasAccess)

            const route = userHasAccess ? 'course' : 'shop'
            this.route(`/${route}/${this.courseGlobal.nextCourseProductID}`)
        },

        handleSibling(prevOrNext) {
            // Find the component inside parent that has children
            
            if (this.siblingIDs) {
                // Find the index of the current context inside the array that contains parent context children ids
                const index = this.siblingIDs.findIndex(item => item === this.currentContext.id)
                const nextSibling = this.siblingIDs[index + prevOrNext]

                // If there is next sibling, load it
                if (nextSibling) {
                    this.route(`/play/${this.courseID}/${nextSibling}`)
                }

                // If there is no sibling, check if parent context has next sibling
                else {
                    const parentContext = this.contentJSON.content.find(
                        item => item.components && item.components.some(component => component.children && component.children.includes(this.parentContext.id))
                    )

                    const parentSiblings = parentContext.components.find(item => !!item.children)

                    if (parentSiblings) {
                        const index = parentSiblings.children.findIndex(item => item === this.parentContext.id)
                        const nextParentSibling = parentSiblings.children[index + prevOrNext]

                        // If parent context has next sibling, load it
                        if (nextParentSibling) {
                            this.route(`/play/${this.courseID}/${nextParentSibling}`)
                        }

                        // If parent context DOES NOT have next sibling, check if
                        else if (this.contentJSON.global.nextCourseProductID) {
                            this.route(`/play/${this.contentJSON.global.nextCourseProductID}`)
                        } else {
                            this.route(`/library`)
                        }
                    }
                }
            }
        }
    },

    watch: {
        $route() {
            this.loadNeededComponents()
        },

        currentContext() {
            k('watch currentContext: ', this.currentContext)
            this.loadNeededComponents()
        },

        courseID() {
            k('new courseID, initCourse')
            this.initCourse()
        },

        environmentProducts() {
            k('received environmentProducts, initCourse')
            this.initCourse()
        }
    },

    created() {
        k('boss courseID: ', this.courseID, this.courseContextID)

        this.getUserPreferences(() => {
            k('got user preferences: ', this.userPreferences)

            if (this.environmentProducts) {
                k('has environmentProducts, initCourse')
                this.initCourse()
            }
        })

        this.getUserCompletionData()

        this.$root.$on('chapterComplete', () => {
            this.getUserCompletionData()
        })
    },

    beforeDestroy() {
        this.$root.$off('chapterComplete')
    }
}
</script>
