import { IObject } from './constants'

// 写入新的css样式
export const writeNewStyle = (originalStyle: string, colors: IObject): void => {
  Object.keys(colors).forEach(key => {
    // 根据模板将之前变量标记替换成颜色值
    const reg = new RegExp('(:|\\s+)' + key, 'g')
    originalStyle = originalStyle.replace(reg, '$1' + colors[key])
  })
  // 之前有插入过id名为chalk-theme-style style元素就直接重新里面内容 没有就动态创建style并加上id
  const chalkStyle = document.getElementById('chalk-theme-style')
  if (!chalkStyle) {
    const style = document.createElement('style')
    style.innerText = originalStyle
    style.id = 'chalk-theme-style'
    // 插入到head中
    document.head.appendChild(style)
  } else {
    (chalkStyle as HTMLElement).innerText = originalStyle
  }
}