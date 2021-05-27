<template>
  <component :is="type" v-bind="linkProps">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'SidebarItemLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isExternalLink = computed(() => isExternal(props.to))
    const type = computed(() => {
      if (isExternalLink.value) {
        return 'a'
      }
      return 'router-link'
    })

    const linkProps = computed(() => {
      if (isExternalLink.value) {
        return {
          href: props.to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: props.to
      }
    })
    return {
      type,
      linkProps
    }
  }
})
</script>
