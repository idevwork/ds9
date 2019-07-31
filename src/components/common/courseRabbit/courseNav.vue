<template>
    <div>

        <q-toolbar :style="toolbarStyle" class="course-rabbit-top-nav">
            <q-btn class="navbar-btn" flat @click="route('/library')">
                <strong>{{ contentJSON.content.backToLibraryText || 'My Library' }}</strong>
            </q-btn>

            <q-btn class="navbar-btn" flat @click="route(`/play/${courseID}`)">
                <q-icon class="navbar-icon" name="fas fa-caret-right" />
                <strong>
                    {{ courseStartData.subTitle }}
                </strong>
            </q-btn>

            <q-btn class="navbar-btn" v-if="toParentContextLabel" flat @click="toParentContext()">
                <q-icon class="navbar-icon" name="fas fa-caret-right" />
                <strong>
                    {{ toParentContextLabel }}
                </strong>
            </q-btn>

            <q-btn class="navbar-btn" v-if="!currentContext.courseStart" flat>
                <q-icon class="navbar-icon" name="fas fa-caret-right" />
                <strong>
                    {{ currentContext.subTitle || currentContext.title}}
                </strong>
            </q-btn>
        </q-toolbar>

    </div>

</template>

<script>
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

    mixins: [globalComputedData, courseRabbitTools],

    computed: {
        toolbarStyle() {
            const background = this.currentContext.toolbarColor || this.courseGlobal.defaultToolbarColor

            return {
                background,
                'z-index': 9
            }
        },

        toParentContextLabel() {
            return !this.currentContext.courseStart && this.parentContext && !this.parentContext.courseStart ? this.parentContext.subTitle : false
        }
    },

    methods: {
        toParentContext() {
            const route = (this.parentContext.id) ? `/${this.parentContext.id}` : ''
            this.route(`/play/${this.courseID}${route}`)
        }
    }
}

</script>

<style>
    .navbar-btn {
        padding: .5rem;
    }

    .navbar-icon {
        margin: 0 .55rem 0 0;
    }

    @media screen and (max-width: 426px) {
        .navbar-btn strong {
            font-size: 11px;
        }
        .navbar-btn {
            padding: 0;
        }
    }

    @media print {
        .course-rabbit-top-nav {
            display: none;
        }
    }
</style>
