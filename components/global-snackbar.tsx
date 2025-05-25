"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RootState } from "@/redux/store"
import { hideSnackbar, showSnackbar } from "@/redux/slices/snackbarSlice"

export default function GlobalSnackbar() {
  const dispatch = useDispatch()
  const { open, message, severity } = useSelector((state: RootState) => state.snackbar)
  const { error: authError } = useSelector((state: RootState) => state.auth)

  // Show auth errors automatically
  useEffect(() => {
    if (authError) {
      dispatch(showSnackbar({ message: authError, severity: "error" }))
    }
  }, [authError, dispatch])

  const handleClose = () => {
    dispatch(hideSnackbar())
  }

  const getIcon = () => {
    switch (severity) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getColors = () => {
    switch (severity) {
      case "success":
        return "bg-green-500 text-white"
      case "error":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${getColors()}`}>
            {getIcon()}
            <span className="text-sm font-medium">{message}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
