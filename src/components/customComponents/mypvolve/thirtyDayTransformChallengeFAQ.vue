<template>

    <div class="bg-grey-3">
        <div class="row well">
            <div class="col-12 q-px-md">
                <div v-for="(topic, index) in faqCast" :key="index">
                    <q-list class="bg-white">
                        <q-collapsible v-for="(question, questionIndex) in topic" :key="question.question" class="monty" :id="questionIndex === topic.length - 2 ? 'openedQuestion' : ''" :opened="openedQuestion(questionIndex, topic.length)">
                            <template slot="header">
                                <q-item-side left>
                                    <q-btn flat round size="sm" :style="`background: ${pvolveMintBG};`">
                                        <q-icon name="fas fa-question" color="white" />
                                    </q-btn>
                                </q-item-side>
                                <q-item-main :label="question.question" style="font-size: 1rem;" />
                            </template>
                            <div style="padding: 1rem; color: #545454; font-size: .9rem; line-height: 1.25rem;">
                                <div v-if="question.mobile" :class="`${ windowWidth < 768 ? 'flex justify-center q-pb-md' : 'flex justify-end' }`">
                                    <q-btn outline @click="$root.$emit('openMobileAppModal', true)" size="md" label="Get the app!" :style="`background: #fff !important; color: #333;`" class="float-right" />
                                </div>
                                <span v-html="question.answer"></span>
                            </div>
                        </q-collapsible>
                    </q-list>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        mixins: [pvolveColors, globalComputedData],

        computed: {
            faqCast() {
                let faqObject = {
                    ...this.componentData.faq
                }

                return faqObject
            }
        },
        
        methods: {
            openedQuestion(index, length) {
                if (this.initialParameters.guidelines) {
                    return index === length - 2 || index === length - 1
                } else {
                    return false
                }
            }
        },
        
        mounted() {
            if (this.initialParameters.guidelines) {
                var element = document.getElementById('openedQuestion')
                window.scrollTo(0, element.offsetTop - 25)
            } else {
                window.scrollTo(0, 0)
            }
        },
        
        beforeDestroy() {
            delete this.initialParameters.guidelines
        }
    }
</script>

<style>

</style>
