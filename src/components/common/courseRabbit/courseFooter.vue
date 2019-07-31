<template>

    <q-toolbar
        class="justify-center course-rabbit-footer"
        :style="toolbarStyle">
        <q-btn
            v-for="item in items"
            :key="item.id"
            outline @click="navigate(item.id)" style="margin: 0 .25rem;" >
            <q-icon :name="`fas ${item.icon}`" />
            <h6 class="gt-sm thickHeader">{{ item.title }}</h6>
        </q-btn>
    </q-toolbar>

</template>

<script>
import { courseRabbitTools } from '../../../mixins/courseRabbitTools';
import { globalComputedData } from '../../../mixins/globalComputedData';
export default {
  props: [
    'componentData',
    'courseID',
    'courseContextID',
    'currentContext',
    'parentContext'
  ],

  mixins: [courseRabbitTools, globalComputedData],

  data() {
      return {
        items: []
      }
  },

  created() {
      this.items = this.componentData.courseRoutes.map(courseRoute => this.findCourseDataBy(courseRoute))
  },

  computed: {
      toolbarStyle() {
        const background = this.currentContext.toolbarColor || this.courseGlobal.defaultToolbarColor

        return {
          background,
          bottom: 0,
          position: 'fixed'
        }
      }
  },

  methods: {
    navigate(id) {
      const path = `/play/${this.courseID}/${id}`;
      k('navigate: ', path);
      this.route(path);
    }
  },
};
</script>

<style>
  	@media print {
        .course-rabbit-footer {
            display: none;
        }
    }
</style>
