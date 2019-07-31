<template>
  <div
    :class="[
      'justify-around',
      'row',
      'well',
      {
        'reverse': isInverted,
      }
    ]"
    style="padding-top: 2rem; padding-bottom: 2rem;"
  >
    <div
      :class="[
        'col-sm-12',
        columnSizeLeft,
        {
          'text-left': isLeftOnLeftSection,
          'text-right': isRightOnLeftSection,
          'text-center': isCenterOnLeftSection
        }
      ]"
      style="padding: 0 1rem;"
    >
      <slot name="left">
        Lorem Ipsum
      </slot>
    </div>
    <div
      :class="[
        'col-sm-12',
        columnSizeRight,
        {
          'text-left': isLeftOnRightSection,
          'text-right': isRightOnRightSection,
          'text-center': isCenterOnRightSection
        }
      ]"
      style="padding: 0 1rem;"
    >
      <slot name="right">
        Image
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoColumnLayout',
  props: {
    'columnSizeLeft': {
      type: String,
      default: 'col-md-6'
    },
    'columnSizeRight': {
      type: String,
      default: 'col-md-6'
    },
    'isLeftOnLeftSection': {
      type: Boolean,
      default: false
    },
    'isRightOnLeftSection': {
      type: Boolean,
      default: false
    },
    'isCenterOnLeftSection': {
      type: Boolean,
      default: false
    },
    'isLeftOnRightSection': {
      type: Boolean,
      default: false
    },
    'isRightOnRightSection': {
      type: Boolean,
      default: false
    },
    'isCenterOnRightSection': {
      type: Boolean,
      default: false
    },
    'isInverted': {
      type: Boolean,
      default: false
    },
  }
}
</script>

<style></style>
