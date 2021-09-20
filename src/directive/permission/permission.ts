import store from '@/store'
import { App, computed, DirectiveBinding, ObjectDirective } from 'vue'

export interface IDirectiveOptionsWithInstall extends ObjectDirective {
  install?: (app: App) => void
}

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const { value } = binding
  const roles = computed(() => store.getters.roleNames)

  if (value && Array.isArray(value)) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermisssion = roles.value.some((role: string) => permissionRoles.includes(role))
      if (!hasPermisssion) {
        return el.parentNode?.removeChild(el)
      }
    } else {
      // eslint-disable-next-line
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

const plugin = (el: HTMLElement, binding: DirectiveBinding) => {
  checkPermission(el, binding)
}

export default plugin as IDirectiveOptionsWithInstall
