<template>

    <div class="bg-grey-2 row relative-position" style="width: 100%;">
        <div class="col-sm-12" style="padding: 1rem 0;">
            <div class="bg-white" style="padding: 0;">
                <table class="q-table bordered striped responsive" style="width: 100%;">
                    <thead>
                        <tr>
                            <th align="left">Date</th>
                            <th align="left">Name</th>
                            <th align="right">Minutes</th>
                        </tr>
                    </thead>
                    <tbody v-if="entries && index < 3" v-for="(item, index) in viewingData">
                        <tr v-for="product in item.productsViewed">
                            <td>
                                {{moment(item.date).format('M/DD/YY')}}
                            </td>
                            <td>
                                {{product.productName}}
                            </td>
                            <td align="right">
                                {{(product.secondsViewed / 60).toFixed(1)}} mins
                            </td>
                        </tr>
                        <tr style="background: #999; color: #fff;">
                            <td>
                                <strong>TOTAL</strong>
                            </td>
                            <td></td>
                            <td align="right">
                                <strong>{{ (productTotal(item.productsViewed) / 60).toFixed(1)}} mins</strong>
                            </td>
                        </tr>
                        <tr v-if="userContentScheduleNotesForDay(item.date)" :style="`background: ${highlightColor}; color: #fff;`">
                            <td>
                                <strong>Entry</strong>
                            </td>
                            <td>
                                <strong>{{userContentScheduleNotesForDay(item.date)}}</strong>
                            </td>
                            <td align="right"></td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div style="padding: .5rem;" align="center">
                <q-btn outline @click="openModal = true" :style="`background: #fff !important; color: #333;`">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Show All</h6>
                </q-btn>
            </div>
        </div>

        <q-modal
            v-model="openModal"
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout id="fullHistoryModal">

                <q-toolbar slot="header" :style="`background: ${brandColor}; margin-top: 0;`">
                    <q-btn id="closePreviewModal" flat icon="fa-chevron-left" @click="openModal = false" />
                    <q-toolbar-title>
                        <h6>{{title ? title : 'Full History'}}</h6>
                    </q-toolbar-title>
                </q-toolbar>

                <table class="q-table bordered striped responsive" style="width: 100%;">
                    <thead>
                        <tr>
                            <th align="left">Date</th>
                            <th align="left">Name</th>
                            <th align="right">Minutes</th>
                        </tr>
                    </thead>
                    <tbody v-if="entries" v-for="(item, index) in viewingData">
                        <tr v-for="product in item.productsViewed">
                            <td>
                                {{moment(item.date).format('M/DD/YY')}}
                            </td>
                            <td>
                                {{product.productName}}
                            </td>
                            <td align="right">
                                {{(product.secondsViewed / 60).toFixed(1)}} mins
                            </td>
                        </tr>
                        <tr style="background: #999; color: #fff;">
                            <td>
                                <strong>TOTAL</strong>
                            </td>
                            <td></td>
                            <td align="right">
                                <strong>{{ (productTotal(item.productsViewed) / 60).toFixed(1)}} mins</strong>
                            </td>
                        </tr>
                        <tr v-if="userContentScheduleNotesForDay(item.date)" :style="`background: ${highlightColor}; color: #fff;`">
                            <td>
                                <strong>Entry</strong>
                            </td>
                            <td>
                                <strong>{{userContentScheduleNotesForDay(item.date)}}</strong>
                            </td>
                            <td align="right"></td>
                        </tr>
                    </tbody>
                </table>

            </q-modal-layout>
        </q-modal>
    </div>

</template>

<script>
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import aiCalendarNotes from './aiCalendarNotes'

    export default {
        props: ['title', 'highlightColor', 'hideProducts'],

        mixins: [userAndProductInfo, designTools, globalComputedData],

        components: {aiCalendarNotes},

        data() {
            return {
                openModal: false,
                showHelp: false,
                displayCalendar: '',
                monthOffset: 1,
                totalCalendarDays: 29,
                viewingData: '',
                viewThresholdInSeconds: 60 * 5,

                productsViewedDisplayLimit: 10,
                productsViewedDisplayCount: 0,

                productTotal(products) {
                    var total = 0
                    products.forEach((product) => {
                        total += product.secondsViewed
                    })
                    return total
                },

                userContentScheduleNotesDataForDay(date) {
                    let formattedDate = this.moment(date).format('MM-DD-YYYY')

                    let firstDayOfMonth = this.firstDayOfMonth(formattedDate)

                    let calendarOffset = this.moment(firstDayOfMonth).day()


                    let monthName = this.moment(formattedDate.split('-')[0], 'MM').format('MMMM')
                    let dayIndex = Number(formattedDate.split('-')[1]) + calendarOffset

                    return {
                        monthName,
                        dayIndex
                    }
                },

                userContentScheduleNotesForDay(date) {
                    let monthName = this.userContentScheduleNotesDataForDay(date).monthName
                    let dayIndex = this.userContentScheduleNotesDataForDay(date).dayIndex

                    return this.userContentScheduleNotes && this.userContentScheduleNotes[monthName] && this.userContentScheduleNotes[monthName][dayIndex] ? this.userContentScheduleNotes[monthName][dayIndex] : ''
                },

                firstDayOfMonth(dateStr) {
                    var date = new Date(dateStr),
                        y = date.getFullYear(),
                        m = date.getMonth();
                    var firstDay = new Date(y, m, 1);
                    return firstDay
                }
            }
        },

        computed: {
            userContentScheduleNotesPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'userContentScheduleNotes') : ''
            },

            userContentScheduleNotesPreferenceID() {
                return this.userContentScheduleNotesPreference && this.userContentScheduleNotesPreference.id ? this.userContentScheduleNotesPreference.id : ''
            },

            userContentScheduleNotes() {
                return this.userContentScheduleNotesPreference ? this.userContentScheduleNotesPreference.noteData : ''
            },

            formattedNotes() {
                let notesArr = []
                Object.keys(this.userContentScheduleNotes).forEach(monthDataKey => {
                    Object.keys(this.userContentScheduleNotes[monthDataKey]).forEach(dayIndexKey => {
                        let year = 2018
                        let newObj = {
                            date: '',
                            note: this.userContentScheduleNotes[monthDataKey][dayIndexKey]
                        }
                    })
                })
            },

            entries() {
                // merge viewingData and userContentScheduleNotes
                k('entries: ', this.userContentScheduleNotes)
                return this.viewingData.sort((a, b) => {

                    return this.moment(b.date).valueOf() - this.moment(a.date).valueOf()
                })
            }
        },

        methods: {

            getUserMediaPlayData() {
                var timezoneOffset = this.moment().format('Z')
                k('timezoneOffset: ', timezoneOffset)

                var req = {
                    filters: {
                        environment: this.environmentName,
                        eventType: 'mediaPlay',
                        userID: this.userInfo.userID
                    },
                    key2agg: 'productID',
                    key2sum: 'elapsed',
                    orderDirection: 'desc',
                    forceProd: false,
                    localTimeZone: this.moment().format('Z')
                }

                this.api.post(this.api.ioRoute + 'api/stats/mediaPlay4UserByDate', req, (res) => {

                    if (res) {
                        if (this.hideProducts && this.hideProducts.length) {
                            res = res.map(day => {
                                if (day.productsViewed.length) {
                                    day.productsViewed = day.productsViewed.filter(product => !this.hideProducts.includes(product.productID))
                                }

                                return day
                            })
                        }

                        this.viewingData = res.filter((day) => day.productsViewed.length)
                    }
                })
            },

            showNotes(index) {
                k('showNotes: ', index)

                for (var i = 0; i < this.viewingData.length; i++) {
                    this.viewingData[i].showNotes = false
                }

                this.viewingData[index].showNotes = true
            }

        },

        watch: {
            userInfo() {
                this.getUserMediaPlayData()
            },

            viewingData() {
                k('viewingData: ', this.viewingData)
            },

            userContentScheduleNotes() {
                k('userContentScheduleNotes: ', this.userContentScheduleNotes)
            },

            userContentScheduleNotesPreference() {
                k('userContentScheduleNotesPreference: ', this.userContentScheduleNotesPreference)
            }
        },

        created() {
            this.startDate = this.moment().subtract(this.totalCalendarDays - 1, 'days').valueOf()

            if (!this.userPreferences) {
                this.getUserPreferences(() => {})
            }

            if (this.userInfo) {
                this.getUserMediaPlayData()
            }
        }
    }
</script>

<style scoped>
    .padded {
      padding: .5rem;
    }

    #calendar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .card {
        position: relative;
        background: #fff;
        height: 100%;
        min-height: 4.5rem;
        border: 1px solid #ddd;
        cursor: pointer;
    }

    .day {
        width: 14.28%;
        display: block;
    }

    .dayDate {
        color: #999;
        background: #fff;
        padding: .3rem;
    }

    .dayHeader {
        background: #999;
        color: #fff;
        padding: .2rem;
    }

    .workouts4day {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .restDay {
        height: 100%;
        text-align: center;
        color: #fff;

    }

    .centerIt {
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .playButton {
        position: absolute;
        left: 50%;
        bottom: .5rem;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
    }

    .q-table tbody td {
        height: auto;
        font-weight: 400;
        font-size: 13px;
    }
</style>
