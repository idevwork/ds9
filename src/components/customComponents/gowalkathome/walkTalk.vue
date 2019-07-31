<template>

    <div style="padding: 1rem;">
    
        <div class="row well" style="width: 100%; padding: 0;">
            <div class="col-12" style="padding: 0 .5rem;">
                <q-btn v-if="inAppMessage" class="full-width" @click="openInAppMessage()" :style="`background: ${brandColor};`">
                    <div v-if="inAppMessageLastUpdated !== inAppMessageLastSeen" :style="`background: #DC2338; color: #fff; border-radius: .2rem; font-size: .8rem; padding: .1rem .25rem; margin-right: .5rem;`">New</div>
                    <h6>Walk Talk</h6>
                    <q-icon :name="showInAppMessage ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="font-size: .8rem; margin: .75rem;" />
                </q-btn>
    
                <q-slide-transition>
                    <div v-if="showInAppMessage && inAppMessage" class="bg-grey-3" style="position: relative; z-index: 1; padding: 1.5rem;">
                        <div class="bg-white shadow-5" style="font-size: .9rem; padding: 1rem;">
                            <span v-html="inAppMessage" />
                        </div>
                    </div>
                </q-slide-transition>
            </div>
        </div>
    
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: [''],
        
        mixins: [ globalComputedData ],
    
        data() {
            return {
                showInAppMessage: false,
                inAppMessage: '',
                inAppMessageLastUpdated: '',
                inAppMessageLastSeen: ''
            }
        },
        
        components: {
            
        },
    
        computed: {
            
        },
    
        methods: {
            getInAppMessage() {
                this.api.get(`${this.api.apiv4Route}api/client/digitalwalkathome/inAppMessage`, res => {
                    k('getInAppMessage: ', res)

                    if (res.message) this.inAppMessage = res.message
                    if (res.lastUpdated) this.inAppMessageLastUpdated = res.lastUpdated

                    k('inAppMessageLastSeen: ', this.inAppMessageLastSeen)
                    k('inAppMessageLastUpdated: ', this.inAppMessageLastUpdated)
                })
            },

            openInAppMessage() {
                this.showInAppMessage = !this.showInAppMessage
                this.inAppMessageLastSeen = this.inAppMessageLastUpdated
                this.localStorage.set('inAppMessageLastSeen', this.inAppMessageLastUpdated)

                k('inAppMessageLastSeen: ', this.inAppMessageLastSeen)
                k('inAppMessageLastUpdated: ', this.inAppMessageLastUpdated)
            }
        },
    
        created() {
            let inAppMessageLastSeen = this.localStorage.get('inAppMessageLastSeen')
            if (inAppMessageLastSeen) this.inAppMessageLastSeen = inAppMessageLastSeen
            this.getInAppMessage()
        }
    }
</script>

<style>
  .q-input-target {
    height: inherit !important;
  }
</style>
