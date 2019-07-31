<template>
    <div class="justify-around row well" style="padding: 2rem 0;">
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-md">
            <div :style="twoColumnsImage" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 text-left monty" :style="rightColumnStyle">
            <p class="right-side-title">
                {{ twoColumnsTitle }}
            </p>
            <span v-if="twoColumnsDescription" v-html="twoColumnsDescription" />
        </div>
    </div>
</template>

<script>
import { designTools } from '../../../mixins/designTools'

export default {
    props: ['componentData'],

    mixins: [ designTools ],

    computed: {
        heroImageSrc() {
            return 'https://vault.platformpurple.com/static/clients/' + this.componentData.backgroundImageURL
        },

        headerTitle() {
            return this.componentData.headerTitle ? this.componentData.headerTitle : ''
        },

        headerSubtitle() {
            return this.componentData.headerSubtitle ? this.componentData.headerSubtitle : ''
        },

        twoColumnsImage() {
            return {
                'background': this.componentData.backgroundImageURL ? `url("${this.heroImageSrc}")` : '',
                'background-position': this.componentData.backgroundPosition || '50% 0%',
                'background-size': this.componentData.backgroundSize || 'cover',
                'background-repeat': 'no-repeat',
                'height': this.componentData.height || '415px',
                'cursor': this.componentData.route ? 'pointer' : '',
                'padding': this.windowWidth > 992 ? '8rem' : '1rem'
            }
        },

        twoColumnsTitle() {
            return this.componentData ? this.componentData.title : ''
        },

        twoColumnsDescription() {
            return this.componentData ? this.componentData.description : ''
        },

        rightColumnStyle() {
            return {
                'padding': this.windowWidth < 992 ? '2rem' : '2rem 6rem'
            }
        }
    }
}
</script>

<style>
    .nutrition-title {
        font-style: normal;
        font-size: 16px;
        line-height: normal;
    }

    .nutrition-subtitle {
        font-style: normal;
        font-weight: normal;
        font-size: 48px;
        line-height: normal;
        text-align: center;
    }

    .right-side-title {
        font-size: 36px;
        line-height: normal;
        color: #48B999;
    }
</style>
