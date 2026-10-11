import { useContext } from 'react'
import { ThemeContext } from '../context/theme.js'

export function useTheme() {
  return useContext(ThemeContext)
}