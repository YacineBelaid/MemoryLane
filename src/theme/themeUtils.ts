import { CustomFlowbiteTheme } from 'flowbite-react'
import { floatingLabelTheme, friendButton } from './floatingLabels'
import { buttonSelect } from './buttonGroups'
import { NavbarTheme } from './navbar'
type ThemeKey = keyof CustomFlowbiteTheme

export function getTheme(key: string): Partial<CustomFlowbiteTheme[ThemeKey]> {
  switch (key) {
    case 'floatingLabel':
      return floatingLabelTheme
    case 'friendButton':
      return friendButton
    case 'buttonSelect':
      return buttonSelect
    case 'NavbarTheme':
      return NavbarTheme
    default:
      return {}
  }
}
