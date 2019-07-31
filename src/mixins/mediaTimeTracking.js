export const mediaTimeTracking = {
    computed: {
        currentProduct() {
            return this.$store.state.currentProduct
        }
    },
    
    methods: {
        getProductMedia() {
            // @vcpablo - 05/20/19 - Returns empty array for products that don't have chapters such as Sign It ones
            return this.currentProduct.productJSON && this.currentProduct.productJSON.video || []
        },
        
        sendCurrentMediaPlayEventIfExists(updatedEndSeconds) {
            var event = this.localStorage.get('currentMediaPlayEvent')
            k('check for current media play event')
            if (event) {
                k('start: ', event.mediaStartSeconds)
                k('end: ', event.mediaEndSeconds)
                
                if (updatedEndSeconds) event.mediaEndSeconds = Math.round(updatedEndSeconds)
                event.elapsed = event.mediaEndSeconds - event.mediaStartSeconds

                if (event.elapsed > 0) this.api.sendEvent(event)
                // this.api.sendEvent(event) // sending mediaPlay always
                
                this.localStorage.remove('currentMediaPlayEvent') // note: tried just setting to empty, but left a quasar webstorage string;
            }
        },
        
        startMediaPlayEvent(startSeconds, type) {
            kw('starting media play event: ', this.$store.state.currentChapter)
            if(this.$store.state.currentChapter.type === 'question') return
            
            if (startSeconds > 0) startSeconds = this.recalculate4CurrentChapterTimeCode(startSeconds)
            let event = {
                eventType: 'mediaPlay',
                userID: this.$store.state.user.info.userID,
                publisherID: this.currentProduct.publisherID,
                productName: this.currentProduct.productName,
                productSKU: this.currentProduct.productSKU,
                chapterTitle: this.$store.state.currentChapter ? this.$store.state.currentChapter.displayName : '',
                contentType: type,
                productID: this.currentProduct.productID,
                mediaStartSeconds: Math.round(startSeconds),
                mediaEndSeconds: Math.round(startSeconds), // assume user will watch for 2 secs at least
                sessionGroup: this.$store.state.sessionGroup, // keep in case sending last saved event,
                os: this.$store.state.userAgentInfo.os.name
            }
            if(this.$store.state.initialParameters.utm_source) event.utm_source = this.$store.state.initialParameters.utm_source

            // k('store event: ', event)
            this.localStorage.set('currentMediaPlayEvent', event)
        },
        
        updateMediaPlayEvent(endSeconds) {
            kw('update media play event: ', endSeconds)
            
            endSeconds = this.recalculate4CurrentChapterTimeCode(endSeconds)
            
            var event = this.localStorage.get('currentMediaPlayEvent')
            if (event) {
                event.mediaEndSeconds = Math.round(endSeconds)
                this.localStorage.set('currentMediaPlayEvent', event)
            }
        },
        
        mediaSeeked(beforeSeekedTimestamp, afterSeekedTimestamp, type) {
            k('media seeked; handle events!')
            // k('before seeked timestamp:' + beforeSeekedTimestamp)
            // k('after seeked timestamp:' + afterSeekedTimestamp)
            // k(type)

            const currentProductMediaArr = this.getProductMedia()
            let currentChapter = currentProductMediaArr[this.$store.state.currentChapterIndex]
            
            if (currentChapter && (currentChapter.chapterStartSeconds || currentChapter.chapterStartSeconds == 0)) {
                // this is a timecode movie
                
                // recalculate timestamps based on timecode chapter
                beforeSeekedTimestamp = beforeSeekedTimestamp - currentChapter.chapterStartSeconds
                
                // figure out if in new chapter
                var seeked2ChapterIndex = this.chapterIndexForTimecode(currentProductMediaArr, currentChapter.fileName, afterSeekedTimestamp)
                this.$store.commit('setCurrentChapterIndex', seeked2ChapterIndex)
                
                this.$store.commit('setCurrentChapter', currentProductMediaArr[seeked2ChapterIndex])
                // kw('currentChapter: ', this.currentChapter)
            }
            
            // get and send current event
            // var event = this.localStorage.get('currentMediaPlayEvent')
            
            if (beforeSeekedTimestamp >= 0) this.sendCurrentMediaPlayEventIfExists() // just use last recorded time
            // this.sendCurrentMediaPlayEventIfExists() // just use last recorded time
            // start new event
            this.startMediaPlayEvent(afterSeekedTimestamp, type)
        },
        
        chapterIndexForTimecode(mediaArr, fileName, timestamp) {
            // go through each chapter in order and find the right one we're in
            for (var i = 0; i < mediaArr.length; i++) {
                var sameMovie = (fileName == mediaArr[i].fileName)
                
                if (!mediaArr[i+1]) {
                    // no next chapter; just stop with this one
                    break;
                } else {
                    if (sameMovie && timestamp < mediaArr[i].chapterStartSeconds) {
                        // if here, then the timestamp is before any chapters in the list 
                        break;
                    }
                    
                    if (!mediaArr[i+1].fileName) {
                        // next chapter is not a playable chapter; get next one
                        var startPoint = i+1
                        for (var n = startPoint; n < mediaArr.length; n++) {
                            if (mediaArr[n].fileName) {
                                break;
                            }
                        }
                        var nextIndex = n < mediaArr.length ? n : i+1
                    } else {
                        var nextIndex = i+1
                    }
                    var nextChapterTimeCode = mediaArr[nextIndex].chapterStartSeconds || mediaArr[nextIndex].chapterOffset
                    
                    var nextChapterIsDifferentFileName = mediaArr[nextIndex] && mediaArr[nextIndex].fileName && mediaArr[nextIndex].fileName != fileName
                    
                    var seekedTimestampInThisChapter = timestamp >= mediaArr[i].chapterStartSeconds && nextChapterTimeCode && timestamp < nextChapterTimeCode
                    if (sameMovie && (seekedTimestampInThisChapter || nextChapterIsDifferentFileName)) {
                        break;
                    }
                }
            }
            return i
        },
        
        recalculate4CurrentChapterTimeCode(seconds) {
            // k('recalculate4CurrentChapterTimeCode:' + seconds)
            var currentChapter = this.$store.state.currentChapter
            if (currentChapter && (currentChapter.chapterStartSeconds || currentChapter.chapterStartSeconds == 0)) {
                if (seconds >= currentChapter.chapterStartSeconds) seconds = seconds - currentChapter.chapterStartSeconds
            }
            // kw('seconds to set:' + seconds)
            return seconds
        }
    }
}