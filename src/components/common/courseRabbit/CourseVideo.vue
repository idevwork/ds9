<template>
    <div :style="containerStyle">

        <div class="row">
            <Video
                :componentData="componentData"

                :courseID="courseID"
                :courseContextID="courseContextID"
                :currentContext="currentContext"
                :parentContext="parentContext"

                @nextSibling="$emit('nextSibling')"
                @previousSibling="$emit('previousSibling')"/>
        </div>

    </div>
</template>

<script>

import Video from './Video'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { courseRabbitTools } from '../../../mixins/courseRabbitTools';

export default {
    props: [
        'componentData',
        'courseID',
        'courseContextID',
        'currentContext',
        'parentContext'
    ],

    components: {
        Video
    },

    mixins: [globalComputedData, courseRabbitTools],

    computed: {
        containerStyle() {
            const background = this.currentContext.backgroundColor || this.courseGlobal.defaultBackgroundColor

            return { background }
        }
    }
}
</script>

<style>
</style>
