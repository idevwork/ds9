<template>

    <div style="width: 25rem; max-width: 100%; margin: 0 auto;">
    <!--    <div class="row">-->
    <!--        <div class="col-9" style="padding: .5rem;">-->
                <q-search
                    id="homeSearch"
                    class="bg-white shadow-1"
                    v-model="searchString"
                    @input="filterBySearch"
                    type="text"
                    size="lg"
                    color="grey"
                    :placeholder="searchPlaceholder"
                    :clearable="true"
                    :debounce="600"
                    style="padding: 1rem; border-radius: 1rem;"
                />
        <!--    </div>-->
            
        <!--    <div class="col-3" style="padding: 1.2rem .5rem;">-->
        <!--        <q-btn v-if="searchButton" size="lg" @click="filterBySearch" :style="`background: ${brandColor}; color: #fff;`">-->
        <!--            <h5>Go</h5>-->
        <!--            <q-icon name="fas fa-chevron-right" />-->
        <!--        </q-btn>-->
        <!--    </div>-->
        <!--</div>-->
        
        <p v-if="userSelectedTags && userSelectedTags.length" :style="`margin: 0; font-size: .8rem; color: ${componentData.textColor ? componentData.textColor : '#fff'}; font-style: italic;`">searching filtered products...</p>
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData', 'searchButton'],
        
        mixins: [globalComputedData],
        
        data() {
            return {
                searchString: ''
            }
        },
    
        computed: {
            searchPlaceholder() {
                return 'What would you like to learn?'
            },
            
            globalSearchString() {
                return this.$store.state.searchString
            }
        },
    
        methods: {
            filterBySearch(val) {
                k('filterBySearch: ', val)
                // if (this.currentView === 'showcase') this.route('/shop')
                this.$store.commit('searchString', val)
            }
        },
        
        watch: {
            globalSearchString() {
                if (!this.globalSearchString) this.searchString = ''
            }
        },
    
        created() {
            // console.log('componentData: ', this.componentData)
            
            if (this.globalSearchString) this.searchString = this.globalSearchString
        }
    }
</script>

<style scoped>
    .q-icon {
        margin: 0 .5rem;
    }
    
    #homeSearch:before, #homeSearch:after {
        background: none !important;
    }
</style>
