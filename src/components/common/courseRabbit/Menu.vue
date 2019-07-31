<template>
    <div :style="styleCurrentContext">

        <div class="row justify-center" style="padding: 2rem 2rem 5rem 2rem;">
            <div
                v-for="item in items"
                :key="item.id"
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 cursor-pointer"
                @click="selectItem(item.id)"
            >
                <q-card
                    align="center"
                    class="bg-white relative-position no-shadow link item-card"
                >
                    <q-card-media align="center">
                        <q-icon
                            v-if="item.icon"
                            :name="`fas ${item.icon}`"
                            :color="getItemColor(item.id)"
                            class="item-icon" />
                        <img v-if="item.coverImage" :src="item.coverImage" />
                    </q-card-media>

                    <div style="padding: .75rem;">
                        <h4 class="thickHeader item-title">
                            {{item.title}}
                        </h4>

                        <h6 style="margin-top: 1rem;">{{item.subTitle}}</h6>

                        <q-icon
                            v-if="courseItemCompleted(item.id)"
                            color="primary"
                            name="fas fa-check-circle"
                            style="margin-top: 1rem;" />
                    </div>

                    <div
                        v-if="children(item.id)"
                        style="position: absolute; width: 100%; bottom: 0; border-top: 1px solid #eee; padding-top: .75rem;"
                    >
                        <p style="margin-bottom: .75rem;">
                            {{children(item.id).length}} chapter{{children(item.id).length > 1 ? 's' : ''}}
                        </p>
                    </div>
                </q-card>
            </div>

            <div
                v-if="nextSibling"
                @click="handleNextSibling()"
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 cursor-pointer">
                <q-card
                    align="center"
                    class="bg-white relative-position no-shadow link next-course-card">

                    <q-card-media align="center">
                        <img
                            :src="nextSibling.coverImage"
                            class="next-course-thumb" />
                    </q-card-media>

                    <div style="padding: .75rem;">
                        <h6 class="thickHeader">{{nextSibling.title}}</h6>
                    </div>

                    <div class="next-course-action">
                        <h6 style="margin-bottom: .75rem;">
                            Go to {{nextSibling.type}} <q-icon name="fas fa-chevron-right" style="font-size: 1.1rem;" />
                        </h6>
                    </div>
                </q-card>
            </div>

            <div
                v-if="!nextSibling && hasNextCourse"
                @click="handleNextCourse()"
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 cursor-pointer">
                <q-card
                    align="center"
                    class="bg-white relative-position no-shadow link next-course-card">


                    <q-card-media align="center">
                        <img
                            :src="coverImageURL(nextCourse.productSKU)"
                            class="next-course-thumb"
                        />
                    </q-card-media>

                    <div style="padding: .75rem;">
                        <h6 class="thickHeader"> {{nextCourse.productName}} </h6>
                    </div>

                    <div v-if="!userOwnsUnit" class="next-course-action bg-green text-white">
                        <h6 class="thickHeader" style="margin-bottom: .75rem;">
                            Buy Now <q-icon name="fas fa-chevron-right" style="font-size: 1rem;" />
                        </h6>
                    </div>
                    
                    <div v-else class="next-course-action">
                        <h6 style="margin-bottom: .75rem;">
                            Next {{currentContext.slug}} <q-icon name="fas fa-chevron-right" style="font-size: 1rem;" />
                        </h6>
                    </div>
                </q-card>
            </div>
        </div>

    </div>
</template>

<script>
import c from '../../../js/logs'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { courseRabbitTools } from '../../../mixins/courseRabbitTools';

const URL_COVER_IMAGE = 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/'

export default {
    props: [
        'componentData',
        'courseID',
        'courseContextID',
        'currentContext',
        'parentContext'
    ],

    mixins: [
        courseRabbitTools,
        userAndProductInfo,
        globalComputedData
    ],

    computed: {
        styleCurrentContext() {
            const background = this.currentContext.backgroundColor
                ? this.currentContext.backgroundColor
                : this.courseGlobal.defaultBackgroundColor;

            return `min-height: calc(100vh - 9.4rem); background: ${background}`
        },

        items() {
            return this.componentData.children.map(id => this.findCourseDataBy(id))
        },

        userOwnsUnit() {
            const product = this.environmentProducts.find(product => product.productID === this.courseGlobal.nextCourseProductID) || {}
            return product.userActiveProduct
        },

        hasNextCourse() {
            return this.courseGlobal.nextCourseProductID
        },

        nextCourse() {
            return this.environmentProducts ? this.environmentProducts.find(product => product.productID === this.courseGlobal.nextCourseProductID) : {}
        },

        nextSibling() {
            let parentComponentData = this.findCourseDataBy(this.currentContext.parent)
            k('parentComponentData: ', parentComponentData)

            let currentComponentInParent = parentComponentData.components.find(comp => {
                k(comp.component, this.componentData.component)
                return comp.component === this.componentData.component
            })

            let siblings = currentComponentInParent.children
            k('siblings: ', siblings)

            const index = siblings.findIndex(id => id === this.currentContext.id)
            k('index: ', index)

            let nextSibling = index >= 0 && siblings[index + 1] && !siblings[index + 1].courseStart ? this.findCourseDataBy(siblings[index + 1]) : ''
            k('nextSibling: ', nextSibling)

            return nextSibling
        }
    },

    methods: {
        coverImageURL(productSKU) {
            return `${URL_COVER_IMAGE}${productSKU}/${productSKU}_image_cover.png`
        },

        courseItemCompleted(id) {
            return this.userCourseCompletionIDs.includes(id)
        },

        getItemColor(id) {
            return this.courseItemCompleted(id) ? 'primary' : 'grey-7'
        },

        selectItem(id) {
            this.route(`/play/${this.courseID}/${id}`)
        },

        handleNextCourse() {
            k('nextCourse: ', this.courseGlobal.nextCourseProductID)
            const route = !this.userOwnsUnit ? 'shop' : 'play'

            this.route(`/${route}/${this.courseGlobal.nextCourseProductID}`)
        },

        handleNextSibling() {
            k('nextSibling: ', this.nextSibling)
            this.route(`/play/${this.courseID}/${this.nextSibling.id}`)
        },

        children(id) {
            return this.currentContext.type === 'unit' && this.courseContent.filter(item => item.parent === id)
        }
    }
}
</script>

<style scoped>
    .air {
        padding: 2rem;
    }

    .q-card {
        -webkit-transition: box-shadow 0.1s ease, -webkit-transform 0.1s ease;
        transition: box-shadow 0.1s ease, transform 0.1s ease;
        border-radius: 1rem;
    }

    .link:hover {
        -webkit-transform: translateY(-3px);
        -ms-transform: translateY(-3px);
        transform: translateY(-3px);
    }

    .item-title {
        line-height: 1.5rem;
    }

    .item-icon {
        font-size: 3rem;
        margin: 1rem;
    }

    .item-card {
        height: calc(100% - 1rem);
        padding-bottom: 3rem;
        border: 1px solid #ccc;
    }

    .next-course-action {
        position: absolute;
        width: 100%;
        bottom: 0;
        border-top: 1px solid #eee;
        padding-top: .75rem;
    }

    .next-course-thumb {
        max-width: 100%;
        height: auto;
        width: auto;
    }

    .next-course-card {
        height: calc(100% - 1rem);
        padding-bottom: 3rem;
        border: 1px solid #ccc;
    }
</style>
