<template>
    
    <div>
        <div class="row">
            <div v-for="item in selectedSearchItems" style="padding: .5rem;">
                <q-chip size="sm" color="grey">
                    {{item[customName || 'productName']}}
                    <q-icon name="fa-times" @click.native="$emit('selected', item)" style="cursor: pointer; margin-left: .5rem;" />
                </q-chip>
            </div>
        </div>
    
        <q-search v-model="searchVal" clearable @input="searchTheSelection()" class="bg-white shadow-1" style="padding: .5rem; margin: 0;" color="grey" />
    
        <div v-show="searchVal.length" class="searchResults bg-white" style="margin-top: .5rem; overflow: auto; border-radius: .3rem;">
    
            <table v-if="searchResults.length" class="q-table responsive cell-delimiter striped-odd auto p-smalltext" style="width: 100%; font-size: .8rem;">
                <thead>
                    <tr>
                        <th align="center">Selected</th>
                        
                        <th v-for="key in keys2show" v-text="keyDisplayNames[key] ? keyDisplayNames[key] : key" align="left"></th>
                        
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="item in searchResults" :key="item.productID || item.id" 
                        @click="!['test', 'offline'].includes(item.productType) ? $emit('selected', item) : null"
                    >
                        <td align="center" style="font-size: 1rem;">
                            <q-icon :name="searchItemSelected(item) ? 'fa-check-square' : 'fa-square'" color="green" />
                        </td>
                        
                        <td v-for="key in keys2show">
                            {{item[key]}}
                        </td>
                        
                        <td>
                            <span class="text-green" v-if="!['test', 'offline'].includes(item.productType) ">Live</span>
                            
                            <span class="text-red" v-else>Offline</span>
                        </td>
                    </tr>
                </tbody>
            </table>
    
            <div v-else="!searchResults.length">
                No results for search term. Please try a different search.
            </div>
    
        </div>
    </div>

</template>

<script>
    import { Utils, Platform } from 'quasar'
    
    export default {
        props: ['searchSelection', 'key2search', 'keys2show', 'customName', 'selectedSearchItems', 'clearSearch', 'singleSelect'],
    
        data() {
            return {
                searchVal: '',
                searchResults: '',
                // selectedSearchItems: [],
                searchItemSelected(item) {
                    return this.selectedSearchItemNames.includes(item[this.customName || 'productName'])
                },
                
                keyDisplayNames: {
                    'productID': 'ID',
                    'productSKU': 'SKU',
                    'productName': 'Name',
                    'tagName': 'Name',
                    'id': 'ID',
                    'tagHeadingName': 'Heading'
                }
            }
        },
    
        computed: {
            selectedSearchItemNames() {
                return this.selectedSearchItems.map((item) => {
                    return item[this.customName || 'productName']
                })
            }
        },
    
        methods: {
            searchTheSelection() {
                k('searchVal: ', this.searchVal, this.searchSelection)
                var searchResults = this.searchSelection.filter((item) => {
                    k('item: ', item)
                    return item[this.key2search].toLowerCase().includes(this.searchVal.toLowerCase()) ? item : false
                })
    
                k('searchResults: ', searchResults)
                this.searchResults = searchResults
            },
    
            // selectSearchItem(item) {
            //     k('before: ', this.selectedSearchItems, this.customName)
    
            //     if (!this.singleSelect) {
            //         if (!this.selectedSearchItems.includes(item)) {
            //             this.selectedSearchItems.push(item)
            //         }
            //         else {
            //             this.selectedSearchItems.splice(this.selectedSearchItems.indexOf(item), 1)
            //         }
            //     }
            //     else {
            //         this.selectedSearchItems = [item]
            //     }
    
            //     k('after: ', this.selectedSearchItems)
            //     this.$emit('selected', this.selectedSearchItems)
            // },
    
            clearSearchVal() {
                this.searchVal = ''
            }
        },
    
        created() {
            k('singleSelect: ', this.singleSelect)
            k('key2search: ', this.key2search)
            
            this.$root.$on('clearSearchSelectVal', () => {
                this.searchVal = ''
            })
        },
    
        beforeDestroy() {
            this.$root.$off('clearSearchSelectVal')
        }
    }
</script>

<style>
    .searchResults {
        /*max-height: 20rem;*/
        overflow: scroll;
    }
</style>
