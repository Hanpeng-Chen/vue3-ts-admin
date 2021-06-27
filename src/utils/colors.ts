import color from 'css-color-function'
import { formula, IObject } from "./constants";

export const generateColors = (primary:string): IObject => {
  const colors = {} as IObject
  Object.keys(formula).forEach(key => {
    // 根据主题色生成渐变色 将formula对象中字符primary 替换成我们所选的主题色
    const value = formula[key].replace(/primary/g, primary)
    colors[key] = color.convert(value)
  })
  return colors
}