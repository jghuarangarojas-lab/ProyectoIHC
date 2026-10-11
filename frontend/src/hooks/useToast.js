import { useContext } from 'react'
import { ToastContext } from '../context/toast.js'

export function useToast() {
  return useContext(ToastContext)
}