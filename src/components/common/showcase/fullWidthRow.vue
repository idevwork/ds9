<template>
    <div class="row full-width-row items-center" :class="{ reverse: componentData.contentLeft }">
        <div class="col-md-6 full-width-row__image" :style="'background-image: url(' + componentData.backgroundImageUrl + ')'">

        </div>
        <div class="col-md-6 full-width-row__content">
            <h1 class="content-title">{{ componentData.contentTitle }}</h1>
            <p v-if="componentData.contentText">
                {{ componentData.contentText }}
            </p>
            <ul class="content-list" v-if="componentData.contentList">
                <li class="content-list__item" v-for="listItem in componentData.contentList">
                    <p>
                        <q-icon name="fa-check" color="positive"></q-icon> {{ listItem }}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['componentData'],
        data() {
            return {}
        }
    }
</script>

<style>
.full-width-row {
    min-height: 550px;
}

.full-width-row .full-width-row__image {
    min-height: 550px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.full-width-row .full-width-row__content {
    padding: 50px 100px;
} 

.content-title {
    text-align: center;
    font-weight: 800;
    margin-bottom: 50px;
}

.content-list {
    list-style: none;
    padding: 0px;
}

@media screen and (max-width: 1100px) {
    .full-width-row .full-width-row__content {
        padding: 50px 50px;
    }
}

</style>