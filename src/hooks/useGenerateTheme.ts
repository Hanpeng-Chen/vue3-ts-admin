import { useStore } from "@/store"
import { generateColors } from "@/utils/colors"
import { getStyleTemplate } from "@/utils/getStyleTemplate"
import { writeNewStyle } from "@/utils/writeNewStyle"
import { computed } from "vue"
import { useThemeFiles } from "./useThemeFiles"

export const useGenerateTheme = () => {
  const store = useStore()

  // 从store获取theme主题色
  const defaultTheme = computed(() => store.state.settings.theme)
  // 获取element-ui主题文件内容，通过axios获取的作为变量替换模板
  const originStyle = computed(() => store.state.settings.originStyle)

  const generateTheme = (color: string) => {
    const colors = Object.assign({
      primary: defaultTheme.value
    }, generateColors(color))
    // 写入新的css样式
    writeNewStyle(originStyle.value, colors)
  }

  const { getThemeChalkStyle } = useThemeFiles()

  if (!originStyle.value) {
    getThemeChalkStyle().then(data => {
      const styleValue = getStyleTemplate(data as string)
      store.dispatch('settings/changeSetting', { key: 'originStyle', value: styleValue })
      generateTheme(defaultTheme.value)
    })
  } else {
    generateTheme(defaultTheme.value)
  }
  return {
    generateTheme
  }
}