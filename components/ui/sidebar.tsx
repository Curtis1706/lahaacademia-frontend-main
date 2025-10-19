"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  animate?: boolean
  className?: string
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  animate = true,
  className,
}) => {
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [setOpenProp, open],
  )

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      open,
      setOpen,
      animate,
    }),
    [open, setOpen, animate],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className={cn("flex min-h-screen w-full", className)}>{children}</div>
    </SidebarContext.Provider>
  )
}

interface SidebarProps {
  children: React.ReactNode
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ children, open, setOpen, className }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          "hidden md:flex md:flex-col bg-gradient-to-b from-slate-900 to-blue-900 w-[300px] shrink-0 border-r border-white/10",
          className,
        )}
        animate={{
          width: open ? "300px" : "60px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </motion.div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div className="h-16 px-4 py-4 flex flex-row items-center justify-between bg-gradient-to-r from-slate-900 to-blue-900 w-full">
          <div className="flex justify-end z-20 w-full">
            <IconMenu2 className="text-white cursor-pointer" onClick={() => setOpen(!open)} />
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="fixed h-full w-full inset-0 bg-gradient-to-b from-slate-900 to-blue-900 p-10 z-[100] flex flex-col justify-between"
            >
              <div className="absolute right-10 top-10 z-50 text-white cursor-pointer" onClick={() => setOpen(!open)}>
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

interface SidebarBodyProps {
  children: React.ReactNode
  className?: string
}

const SidebarBody: React.FC<SidebarBodyProps> = ({ children, className }) => {
  return <div className={cn("flex flex-col h-full p-4", className)}>{children}</div>
}

interface SidebarLinkProps {
  link: {
    label: string
    href: string
    icon: React.ReactNode
  }
  className?: string
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ link, className }) => {
  const { open, animate } = useSidebar()
  const pathname = usePathname()
  const isActive = pathname === link.href

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-lg hover:bg-white/10 transition-colors",
        isActive && "bg-white/20 border-l-2 border-laha-gold",
        className,
      )}
    >
      <div className={cn(
        "transition-colors",
        isActive ? "text-laha-gold" : "text-white"
      )}>
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0",
          isActive ? "text-laha-gold font-medium" : "text-white"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  )
}

export { Sidebar, SidebarBody, SidebarLink, SidebarProvider, useSidebar }
