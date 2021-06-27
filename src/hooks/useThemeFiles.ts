import pkgJson from 'element-plus/package.json'
import { useFetch } from './useFetch'

const version = pkgJson.version

interface ReturnFn {
  getThemeChalkStyle:() => Promise<unknown>
}

export const useThemeFiles = ():ReturnFn => {
  const getThemeChalkStyle = async (): Promise<unknown> => {
    return await useFetch(`//unpkg.com/element-plus@${version}/lib/theme-chalk/index.css`)
  }

  return {
    getThemeChalkStyle
  }
}