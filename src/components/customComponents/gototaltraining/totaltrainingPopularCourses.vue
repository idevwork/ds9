<template>
    <div>
        <div class="row well justify-center">
            <div :class="{ 'col-12': true, 'q-pa-sm': isTitlePadded }">
                <hr>
                <hr>
                <h3 :class="{ 'text-center': isTitleCentered }">{{ title }}</h3>
                <hr>
                <hr>
            </div>
            <div v-for="(course, index) in courses" :key="index" inline class="q-pa-sm col-ms-12 col-sm-6 col-md-4 col-lg-3">
                <div class="q-pa-md shadow-1" style="cursor: pointer;" @click="selectItem(course)">
                    <img :src="coverImageURL(course)" alt="course" style="width: 100%;">
                    <!--<h4 v-if="isCourseTitleBig">{{course.productName}}</h4>-->
                    <!--<strong v-else>{{course.productName}}</strong><br>-->
                </div>
            </div>
        </div>
        <div class="row justify-center q-ma-md" v-show="showCTA">
            <q-btn @click="route('/')" color="primary" class="q-my-lg" size="lg">
                <strong>VIEW OUR COMPLETE COURSE LIBRARY</strong>
            </q-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PopularCourses',
        
        props: {
            'isTitlePadded': {
                type: Boolean,
                default: true
            },
            'isTitleCentered': {
                type: Boolean,
                default: true
            },
            'isCourseTitleBig': {
                type: Boolean,
                default: true
            },
            'showCTA': {
                type: Boolean,
                default: true
            },
            'title': {
                type: String,
                default: 'Our most popular courses'
            },
            'courses': {
                type: Array,
                default: () => {
                    return [
                        { courseName: 'Course 1', courseImage: null, courseLink: '#' },
                        { courseName: 'Course 2', courseImage: null, courseLink: '#' }
                    ]
                }
            }
        },
        
        data() {
            return {
                coverImageURL(item) {
                    return `https://vault.platformpurple.com/static/previews/${item.productSKU}/${item.productSKU}_500px_cover.png`
                }
            }
        },
        
        methods: {
            selectItem(item) {
                // this.$store.commit('setProductID2Preview', item.productID)
                
                // if (this.currentView === 'productPreview') {
                    this.route('/shop/' + item.productID)
                // } else {
                //     this.$root.$emit('openProductPreview', true)
                // }
            }
        },
        
        created() {
            kw('popular courses: ', this.courses)
        }
    }
</script>
