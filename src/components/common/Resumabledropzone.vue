<template>
  
    <div>
        <div id="fileDropZone">
            <input type="hidden" name="token" value="xxx">
            
            <q-icon v-if="pdfSrc && !noPreview" class="big-icon" name="fas fa-file-pdf" />
            
            <p v-if="pdfSrc && !noPreview && fileName" style="word-wrap: break-word; margin: 0;">{{fileName}}</p>
            
            <img v-show="imageSrc && !noPreview" :src="imageSrc" onError="imageSrc = ''" style="max-width: 100%; max-height: 100px; width: auto;" />
            
            <p v-show="imageSrc && !noPreview && fileName" style="word-wrap: break-word; margin: 0;">{{fileName}}</p>
    
            <div v-show="!imageSrc && !pdfSrc" class="message">
                <q-icon name="fas fa-upload" style="font-size: 2rem; margin: 1rem 0;" />
                <h6 style="font-size: .8rem; letter-spacing: 1px;">Drop or select file here</h6>
            </div>
    
            <q-progress v-show="mediaUploading" :percentage="mediaUploadProgress" />
        </div>
    
        <q-btn v-if="imageSrc || pdfSrc" flat icon="fas fa-times" color="red" size="sm" @click="removeImage()">
            <h6 style="font-size: .8rem; letter-spacing: 1px;">remove</h6>
        </q-btn>
    </div>

</template>

<script>
    import Resumable from 'resumablejs'
    var r

    export default {
        props: ['noPreview'],
        
        data() {
            return {

            }
        },
        
        computed: {
            uploadNow() {
                return this.$store.state.resumableDropZone.uploadNow
            },
            
            fileName() {
                return this.$store.state.resumableDropZone.fileName
            },
            
            fileInfo() {
                return this.$store.state.resumableDropZone.fileInfo
            },
            
            query() {
                return this.$store.state.resumableDropZone.query
            },
            
            imageSrc() {
                return this.$store.state.resumableDropZone.imageSrc
            },
            
            pdfSrc() {
                return this.$store.state.resumableDropZone.pdfSrc
            },
            
            mediaDropped() {
                return this.$store.state.resumableDropZone.mediaDropped
            },
            
            mediaUploading() {
                return this.$store.state.resumableDropZone.mediaUploading
            },
            
            mediaUploadProgress() {
                return this.$store.state.resumableDropZone.mediaUploadProgress
            },
            
            fileTypesAllowed() {
                return this.$store.state.resumableDropZone.fileTypesAllowed
            },
            
            fileExtensionsAllowed() {
                return this.$store.state.resumableDropZone.fileExtensionsAllowed
            },
            
            mediaPurpose() {
                return this.$store.state.resumableDropZone.mediaPurpose
            },
            
            target() {
                return this.$store.state.resumableDropZone.target
            },
                        
            resumableMaxFiles() {
                return this.$store.state.resumableDropZone.maxFiles
            },
            
            resumableMaxFiles() {
                return this.$store.state.resumableDropZone.maxFiles
            },
            
            fileSizeLimit() {
                return this.$store.state.resumableDropZone.fileSizeLimit
            }
        },
        
        methods: {

            initResumable() {
                k('initResumable: ', this.target)

                r = new Resumable({
                    target: this.target,
                    testChunks: true,
                    simultaneousUploads: 1,
                    chunkSize: 1024 * 1024,
                    maxFiles: this.resumableMaxFiles ? this.resumableMaxFiles : undefined
                })
                
                // Resumable.js isn't supported, fall back on a different method
                if (!r.support) kw('no resumable support!')

                r.assignBrowse(document.getElementById('fileDropZone'))
                r.assignDrop(document.getElementById('fileDropZone'))

                r.on('catchAll', this.catchResumableEvents)
            },

            catchResumableEvents(event, resumableFile, message) {
                k('resumable ' + event + ': ', resumableFile, message, r)

                if (event === 'error' || event === 'fileError') {
                    this.$store.commit('dropZoneMediaUploading', false)
                    r.cancel()

                    this.$q.notify({
                        message: `There was an error uploading your file: ` + message,
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }

                if (event === 'fileProgress') {
                    k('mediaUploadProgress: ', resumableFile.progress())
                    this.$store.commit('dropZoneMediaUploadProgress', Math.round(resumableFile.progress() * 100))
                }

                if (event === 'fileAdded') this.fileHasBeenAdded(resumableFile)
                if (event === 'fileSuccess') this.fileSuccess(resumableFile)
                if (event === 'complete') this.resumableComplete(resumableFile)
            },

            fileSuccess(resumableFile) {
                // k('fileSuccess: ', resumableFile) 
            },

            addFileBlob(blobFile) {
                r.addFile(blobFile)
            },

            resumableComplete(resumableFile) {
                k('files uploaded!')

                let data = this.$store.state.resumableDropZone
                data = {...data}
                
                this.$store.commit('dropZoneFileName', '')
                this.$store.commit('dropZoneFileInfo', '')
                this.$store.commit('dropZoneImageSrc', '')
                this.$store.commit('dropZoneMediaUploading', false)
                this.$store.commit('dropZoneMediaDropped', false)
                this.$store.commit('dropZoneMediaUploadProgress', 0)

                this.$emit('uploadComplete', data)
            },

            fileHasBeenAdded(resumableFile) {
                k('file has been added: ', resumableFile)
                
                // check if valid file
                var fileExtension = this.j_.lastItemOf(resumableFile.file.name, '.')
                k('fileType and extension: ', resumableFile.file.type, fileExtension)

                if (this.fileTypesAllowed.indexOf(resumableFile.file.type) > -1 || (this.fileExtensionsAllowed && this.fileExtensionsAllowed.indexOf(fileExtension) > -1)) {
                    k('file compatible')

                    this.$store.commit('dropZoneMediaDropped', true)
                    this.$store.commit('dropZoneFileName', resumableFile.fileName)
                    this.$emit('fileAdded', resumableFile)

                    // check if too big
                    k('uploadSize: ', resumableFile.size, this.fileSizeLimit)
                    if (this.fileSizeLimit && resumableFile.size > this.fileSizeLimit) {
                        this.$q.notify({
                            message: 'Oops! Your file is too big! Files must be less than ' + (this.fileSizeLimit / 1000 / 1000).toFixed(2) + 'mb',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                        
                        this.removeImage()
                        return false
                    }

                    if (resumableFile.file.type == "image/png" || resumableFile.file.type == "image/jpeg") {
                        k('its a img')

                        var reader = new FileReader()

                        reader.onload = (event) => {
                            this.$store.commit('dropZoneImageSrc', event.target.result)
                            // this.$store.commit('dropZoneDroppedImageSrc', event.target.result)
                        }

                        reader.readAsDataURL(resumableFile.file)
                    }
                    
                    if (resumableFile.file.type == "application/pdf") {
                        var reader = new FileReader()

                        reader.onload = (event) => {
                            this.$store.commit('dropZonepdfSrc', event.target.result)
                            // this.$store.commit('dropZoneDroppedImageSrc', event.target.result)
                        }

                        reader.readAsDataURL(resumableFile.file)
                    }
                } else {
                    this.removeImage()

                    this.$q.notify({
                        message: 'Oops! This is the wrong type of file. Files must be ' + this.fileTypesAllowed.join(', '),
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }
            },

            uploadMedia() {
                k('upload media', r, this.query)
                kw('are there files?', r.files.length)
                r.opts.query = this.query

                this.$store.commit('dropZoneQuery', false)
                this.$store.commit('dropZoneUploadNow', false)
                this.$store.commit('dropZoneMediaUploading', true)
                r.upload()
            },

            removeFileFromUploadList(file) {
                k('remove from upload list', file, r.files)

                var indexToRemove = this.j_.indexFromArray(r.files, 'uniqueIdentifier', file.resumableID)
                k('index to remove', indexToRemove)
                if (indexToRemove > -1) {
                    k('removing file')
                    r.files[indexToRemove].cancel()
                }
            },

            removeAllFiles() {
                k('remove all files')
                for (var i = 0; i < resumableObj.files.length; i++) {
                    resumableObj.files[i].cancel()
                }
            },

            removeImage() {
                k('removeImage: ', r.files)

                this.$store.commit('dropZoneQuery', false)
                this.$store.commit('dropZoneMediaDropped', false)
                this.$store.commit('dropZoneFileInfo', '')
                this.$store.commit('dropZoneImageSrc', '')
                this.$store.commit('dropZonepdfSrc', '')
                // this.$store.commit('dropZoneDroppedImageSrc', '')
                
                if (r.files && r.files.length) {
                    r.files[0].cancel()
                    this.$emit('imageRemoved')
                }
            }
        },

        watch: {

            target() {
                this.initResumable()
            },

            mediaPurpose() {
                k('mediaPurpose: ', this.mediaPurpose)
            },

            uploadNow() {
                k('uploadNow! ', this.uploadNow)
                if (this.uploadNow) this.uploadMedia()
            }
        },

        mounted() {
            if (this.target) this.initResumable()
        },

        beforeDestroy() {

        }
    }
</script>

<style>
    #fileDropZone {
        min-height: 150px;
        background: #fff;
        padding: 20px;
        /*border: 2px solid #e5e5e5;*/
        font-family: Arial, sans-serif;
        letter-spacing: .2px;
        color: #777;
        transition: background-color .2s linear;
        cursor: pointer;
        /*margin-bottom: .5rem;*/
    }
    
    #fileDropZone:hover {
        background-color: #f6f6f6;
    }
    
    #fileDropZone .message {
        cursor: pointer;
        text-align: center;
        margin: 2rem 0;
    }
</style>
