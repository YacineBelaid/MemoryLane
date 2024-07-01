import { CustomFlowbiteTheme } from 'flowbite-react'
import { createMemory, profileSettings, friendModal } from './modal'
import { floatingLabelTheme, friendButton } from './floatingLabels'
import { buttonSelect } from './buttonGroups'
import { fullWidth } from './tabs'
import { NavbarTheme } from './navbar'
type ThemeKey = keyof CustomFlowbiteTheme

export function getTheme(key: string): Partial<CustomFlowbiteTheme[ThemeKey]> {
  switch (key) {
    case 'createMemory':
      return createMemory
    case 'floatingLabel':
      return floatingLabelTheme
    case 'friendButton':
      return friendButton
    case 'buttonSelect':
      return buttonSelect
    case 'fullWidth':
      return fullWidth
    case 'profileSettings':
      return profileSettings
    case 'friendModal':
      return friendModal
    case 'NavbarTheme':
      return NavbarTheme
    default:
      return {}
  }
}
