<template>
    <div class="row" style="padding: 2rem;">
        
        <q-card class="col-12">
            <q-card-title>
                <h4 class="no-margin"><q-icon name="fa-list" /> Playlist Manager</h4>
            </q-card-title>
    
            <div v-if="!currentPlaylist">
                <q-card-title>
                    My Playlists
                </q-card-title>
    
                <q-card-main align="center" style="max-height: 73vh; overflow-y: scroll;">
                    <q-btn color="primary" icon="add" @click="createNewPlaylist()">New Playlist</q-btn>
                    
                    <q-inner-loading :visible="!myPlaylists" />
                    
                    <h6 v-if="!myPlaylists.length">No playlists yet, create one by clicking 'New Playlist'.</h6>
    
                    <table v-if="myPlaylists && myPlaylists.length" class="q-table striped-odd p-smalltext responsive" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Playlist Name</th>
                                <th>Chapter Count</th>
                                <th>Edit</th>
                                <th class="float-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in myPlaylists">
                                <td>
                                    {{item.playlistName}}
                                </td>
                                <td>
                                    {{item.playlistJson.length}}
                                </td>
                                <td>
                                    <q-btn size="sm" color="primary" @click="editPlaylist(item)">
                                        <q-icon name="fa-edit" /> Edit
                                    </q-btn>
                                </td>
                                <td class="float-right">
                                    <q-btn round color="red" size="sm" @click="deletePlaylist(item)">
                                        <q-icon name="fa-times" />
                                    </q-btn>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </q-card-main>
            </div>
    
            <div v-if="currentPlaylist" class="row">
    
                <div v-if="!selectedProduct" class="col-6">
                    <q-card-title>
                        My Library
                    </q-card-title>
    
                    <q-card-main style="max-height: 73vh; overflow-y: scroll;">
                        <q-inner-loading :visible="!userActiveProducts || !userActiveProducts.length" />
                        
                        <table class="q-table striped-odd p-smalltext responsive" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>Cover Image</th>
                                    <th>Name</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in userActiveProducts">
                                    <td><img class="self-center" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + item.productSKU + '/' + item.productSKU + '_image.png?t=' + Date.now()" alt="" style="max-height: 40px;" /></td>
                                    <td>
                                        {{item.productName}}
                                    </td>                                    
                                    <td class="right-floated">
                                        <q-btn @click="selectProduct(item)">
                                            Select <q-icon name="fa-chevron-right" />
                                        </q-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </q-card-main>
                </div>
    
                <div v-if="selectedProduct" class="col-6">
                    <q-card-title>
                        Chapters for product: <strong>{{selectedProduct.productName}}</strong>
                    </q-card-title>
    
                    <q-card-title>
                        <q-btn class="full-width" color="primary" @click="selectedProduct = ''">
                            <q-icon name="fa-chevron-left" />
                            Back to product list
                        </q-btn>
                    </q-card-title>
    
                    <q-card-main style="max-height: 73vh; overflow-y: scroll;">
                        <table class="q-table striped-odd p-smalltext responsive" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>Chapter Name</th>
                                    <th>Product Name</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="chapter in selectedProduct.productJSON.video">
                                    <td>
                                        {{chapter.displayName}}
                                    </td>
                                    <td>
                                        {{selectedProduct.productName}}
                                    </td>
                                    <td class="right-floated">
                                        <q-btn @click="selectChapter(chapter)">
                                            Add to playlist <q-icon name="fa-add" />
                                        </q-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </q-card-main>
                </div>
    
                <div class="col-6">
                    <q-card-title>
                        My Playlist: <strong>{{currentPlaylist.playlistName}}</strong>
                    </q-card-title>
    
                    <q-card-main style="max-height: 73vh; overflow-y: scroll;">
                        <q-input v-model="currentPlaylist.playlistName" @input="playlistNameError = false" :error="playlistNameError" float-label="Playlist Name" />
                        
                        <div class="row">
                            
                            <div class="col-6" style="padding: .5rem;">
                                <q-btn class="full-width" color="green" @click="savePlaylist()">
                                    Save
                                </q-btn>
                            </div>
                            
                            <div class="col-6" style="padding: .5rem;">
                                <q-btn class="full-width" color="red" :error="playlistNameError" @click="currentPlaylist = '', selectedProduct = '', route('/library/playlists')">
                                    Cancel
                                </q-btn>
                            </div>
                            
                        </div>
                        
                        <h6 v-if="!currentPlaylist.playlistJson.length">No chapters in playlist.</h6>
                        
                        <table v-if="currentPlaylist.playlistJson.length" class="q-table striped-odd p-smalltext responsive" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>Chapter Name</th>
                                    <th>Product Name</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in currentPlaylist.playlistJson">
                                    <td>
                                        {{item.displayName}}
                                    </td>
                                    <td>
                                        {{item.productName}}
                                    </td>
                                    <td>
                                        <q-btn round size="sm" color="red" @click="removeChapter(item)">
                                            <q-icon name="fa-times" />
                                        </q-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </q-card-main>
                </div>
    
            </div>
        </q-card>
    
    </div>
</template>

<script>
    export default {
        props: ['componentData'],
    
        data() {
            return {
                creatingNewPlaylist: false,
                newPlaylist: {
                    playlistID: this.j_.uaid('p'),
                    displayDateTimeStamp: Date.now(),
                    playlistName: '',
                    playlistJson: []
                },
                myPlaylists: '',
                currentPlaylist: '',
                selectedProduct: '',
                playlistNameError: false
            }
        },
    
        computed: {
            
            userInfo() {
                return this.$store.state.user.info
            },
    
            environmentName() {
                return this.$store.state.environment.name
            },
    
            currentPlaylistID() {
                return this.$store.state.currentPlaylistID
            },
    
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
    
            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer
                }) : ''
            },
    
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            }
        },
    
        methods: {
            
            editPlaylist(item) {
                this.$store.commit('currentPlaylistID', item.playlistID)
                this.route('/library/playlists/' + item.playlistID)
            },
            
            createNewPlaylist() {
                this.creatingNewPlaylist = true
                
                var newPlaylist = JSON.parse(JSON.stringify(this.newPlaylist))
                k('new playlist! ', newPlaylist)
                this.myPlaylists.push(newPlaylist)
    
                this.$store.commit('currentPlaylistID', newPlaylist.playlistID)
                this.route('/library/playlists/' + newPlaylist.playlistID)
            },
            
            selectProduct(item) {
                k('selectProduct: ', item)
                
                if (!item.productJSON.video || !item.productJSON.video.length) {
                    this.$q.notify({
                        message: 'This product has no video chapters, or there is a problem with this product. Please contact support.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                if (item.productJSON.video.length === 1) {
                    this.selectChapter(item.productJSON.video[0])
                } else {
                    this.selectedProduct = item
                }
            },
    
            selectChapter(chapter) {
                k('selectChapter: ', chapter, this.currentPlaylist)
                chapter.productName = this.selectedProduct.productName
                chapter.productSKU = this.selectedProduct.productSKU
                
                var alreadyIncluded = false
                this.currentPlaylist.playlistJson.forEach((existingChapter) => {
                    k('chapter already included: ', existingChapter, chapter)
                    if (existingChapter.displayName === chapter.displayName && 
                        existingChapter.fileName === chapter.fileName) alreadyIncluded = true
                })
                
                if (!alreadyIncluded) this.currentPlaylist.playlistJson.push(chapter)
            },
    
            removeChapter(chapter) {
                k('removeChapter: ', chapter)
                
                var removeIndex = 0
                for (var i = 0; i < this.currentPlaylist.playlistJson.length; i++) {
                    if (this.currentPlaylist.playlistJson[i].displayName === chapter.displayName) removeIndex = i
                }
                
                this.currentPlaylist.playlistJson.splice(removeIndex, 1)
            },
            
            getPlaylists() {
                let req = {
                    "userID": this.userInfo.userID,
                    "environment": this.environmentName
                }
            
                k('get playlists req: ', j(req))
            
                this.api.post(this.api.apiv4Route + 'api/userInfo/getUserInfo', req, (res) => {
                    k('get playlists res: ', res)
            
                    if (res.success) {
                        this.$q.notify({
                            message: 'Got playlist data!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        
                        var lists = res.userInfo.filter((info) => {
                            return info.type === 'playlist'
                        })
                        
                        k('lists: ', lists)
                        
                        this.myPlaylists = lists || []
                        
                        if (this.currentPlaylistID) this.findCurrentPlaylist()
                    } else {
                        k('could not get playlists')
                        this.myPlaylists = []
                    }
                })
            },
            
            deletePlaylist(item) {
                k('deletePlaylist: ', item)
                
                var index2delete = 0
                for (var i = 0; i < this.myPlaylists.length; i++) {
                    if (this.myPlaylists[i].playlistID === item.playlistID) index2delete = i
                }
                k('index2delete: ', index2delete)
                
                this.myPlaylists.splice(i, 1)
            },
            
            savePlaylist() {
                if (!this.currentPlaylist.playlistName) {
                    this.playlistNameError = true
                    this.$q.notify({
                        message: 'Please enter a playlist name.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                if (!this.currentPlaylist.playlistJson.length) {
                    this.$q.notify({
                        message: 'Please select at least one chapter for your playlist.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                if (this.creatingNewPlaylist) {
                    this.savePlaylistToAPI()
                    
                    this.creatingNewPlaylist = false
                } else {
                    this.updatePlaylistToAPI()
                }
            },
    
            savePlaylistToAPI() {
                k('USERINFO: ', this.userInfo)
    
                var req = this.currentPlaylist
                    req.userID = this.userInfo.userID
                    req.type = 'playlist'
                    req.environment = this.environmentName
    
                k('playlist req: ', j(req))
    
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    k('playlist res: ', res)
    
                    // add locally
                    // this.myPlaylists.push(this.currentPlaylist)
    
                    // reset fields
                    this.currentPlaylist = ''
                    this.selectedProduct = ''
                    this.route('/library/playlists')
                    
                    this.getPlaylists()
                })
    
            },
    
            updatePlaylistToAPI() {
                k('currentPlaylist: ', this.currentPlaylist)
    
                var req = this.currentPlaylist
                    req.userID = this.userInfo.userID
                    req.type = 'playlist'
                    req.environment = this.environmentName
    
                k('playlist req: ', j(req))
    
                this.api.put(this.api.ioRoute + 'userInfo/' + this.currentPlaylist.id, req, (res) => {
                    k('playlist res: ', res)
    
                    // add locally

    
                    // reset fields
                    this.currentPlaylist = ''
                    this.selectedProduct = ''
                    this.route('/library/playlists')
                    
                    this.getPlaylists()
                })
    
            },
            
            findCurrentPlaylist() {
                // k('findCurrentPlaylist! ', this.myPlaylists)
                
                var currentPlaylist = this.myPlaylists.filter((playlist) => {
                    // k('playlist ID: ', playlist.playlistID, this.currentPlaylistID)
                    return playlist.playlistID === this.currentPlaylistID
                })[0]
                
                k('currentPlaylist: ', currentPlaylist)
                
                if (currentPlaylist) {
                    this.currentPlaylist = currentPlaylist
                } else {
                    this.route('/library/playlists')
                }
            }
        },
    
        watch: {
            currentPlaylistID() {
                // k('currentPlaylistID watch from playlist: ', this.currentPlaylistID)
                if (this.myPlaylists.length) this.findCurrentPlaylist()
            },
            
            userInfo() {
                this.getPlaylists()
            }
        },
    
        created() {
            // k('PLAYLISTS!')
            
            if (this.userInfo) this.getPlaylists()
            
            if (this.currentPlaylistID && this.myPlaylists.length) {
                this.findCurrentPlaylist()
            }
        }
    }
</script>

<style>
</style>