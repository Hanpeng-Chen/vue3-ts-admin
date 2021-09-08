import { ITreeItemData, MenuData } from '@/store/modules/menu'

type IMap = Record<number | string, ITreeItemData>

const generateTree = (list: MenuData[]): ITreeItemData[] => {
  const map = list.reduce((prev, cur) => {
    const temp = { ...cur }
    prev[cur.id as number] = temp
    return prev
  }, {} as IMap)
  const tree: ITreeItemData[] = []
  list.forEach(item => {
    const temp = map[item.id as number]
    const pid = temp.parent_id
    if ((pid != null || pid !== 0) && map[pid]) {
      const parent = map[pid]
      if (!parent.children) parent.children = []
      parent.children.push(temp)
      return
    }
    tree.push(temp)
  })
  return tree
}

export default generateTree
