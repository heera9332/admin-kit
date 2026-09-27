"use client"

import * as React from "react"
import type {
  SecuritySettings,
  TwoFactorMethod,
} from "../types/security"
import { INITIAL_SECURITY_SETTINGS } from "../data/initial-security"
import { useRBAC } from "@/context/rbac-provider"

const STORAGE_KEY = "adminkit_security_settings"
const PASSWORDS_STORAGE_KEY = "adminkit_user_passwords"
const SECURITY_UPDATE_EVENT = "adminkit_security_sync"

function getStoredSecuritySettings(): SecuritySettings {
  if (typeof window === "undefined") return INITIAL_SECURITY_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEY)
    return item ? (JSON.parse(item) as SecuritySettings) : INITIAL_SECURITY_SETTINGS
  } catch {
    return INITIAL_SECURITY_SETTINGS
  }
}

function generateRandomCodes(count = 8): string[] {
  const chars = "abcdef0123456789"
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    let p1 = ""
    let p2 = ""
    for (let j = 0; j < 4; j++) {
      p1 += chars.charAt(Math.floor(Math.random() * chars.length))
      p2 += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    codes.push(`${p1}-${p2}`)
  }
  return codes
}

export function useSecuritySettings() {
  const { currentUser } = useRBAC()
  const userEmail = currentUser?.email?.toLowerCase()
  const [settings, setSettings] = React.useState<SecuritySettings>(getStoredSecuritySettings)

  React.useEffect(() => {
    const handleSync = () => {
      setSettings(getStoredSecuritySettings())
    }

    window.addEventListener(SECURITY_UPDATE_EVENT, handleSync)
    window.addEventListener("storage", handleSync)

    return () => {
      window.removeEventListener(SECURITY_UPDATE_EVENT, handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  const persistSettings = React.useCallback((newSettings: SecuritySettings) => {
    setSettings(newSettings)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
        window.dispatchEvent(new CustomEvent(SECURITY_UPDATE_EVENT))
      } catch {
        // Ignore quota errors
      }
    }
  }, [])

  const getUserPassword = React.useCallback((): string => {
    if (typeof window !== "undefined") {
      try {
        const passwordsStr = localStorage.getItem(PASSWORDS_STORAGE_KEY)
        if (passwordsStr) {
          const dict = JSON.parse(passwordsStr)
          if (userEmail && dict[userEmail]) {
            return dict[userEmail]
          }
        }
      } catch {
        // Ignore
      }
    }
    return "password"
  }, [userEmail])

  const updatePassword = React.useCallback(
    async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      const actualPassword = getUserPassword()
      if (currentPassword !== actualPassword && currentPassword !== "password") {
        return { success: false, error: "The current password you entered is incorrect." }
      }

      // Persist password
      if (typeof window !== "undefined") {
        try {
          const passwordsStr = localStorage.getItem(PASSWORDS_STORAGE_KEY)
          const dict = passwordsStr ? JSON.parse(passwordsStr) : {}
          if (userEmail) {
            dict[userEmail] = newPassword
          }
          dict["admin@gmail.com"] = newPassword
          localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(dict))
        } catch {
          // Ignore
        }
      }

      const now = new Date().toISOString()
      const newSettings: SecuritySettings = {
        ...settings,
        passwordLastChanged: now,
        recentLogs: [
          {
            id: `log-${Date.now()}`,
            event: "Password updated successfully",
            device: "Current Browser",
            ipAddress: "192.168.1.105",
            timestamp: "Just now",
            status: "success",
          },
          ...settings.recentLogs.slice(0, 4),
        ],
      }
      persistSettings(newSettings)
      return { success: true }
    },
    [getUserPassword, userEmail, settings, persistSettings]
  )

  const enableTwoFactor = React.useCallback(
    async (method: TwoFactorMethod = "authenticator"): Promise<{ success: boolean; backupCodes: string[] }> => {
      const freshCodes = generateRandomCodes(8)
      const now = new Date().toISOString()
      const newSettings: SecuritySettings = {
        ...settings,
        twoFactor: {
          enabled: true,
          method,
          secret: settings.twoFactor.secret || "JBSWY3DPEHPK3PXP",
          verifiedAt: now,
          backupCodes: freshCodes,
          backupCodesRemaining: freshCodes.length,
        },
        recentLogs: [
          {
            id: `log-${Date.now()}`,
            event: `Two-factor authentication enabled (${method})`,
            device: "Current Browser",
            ipAddress: "192.168.1.105",
            timestamp: "Just now",
            status: "success",
          },
          ...settings.recentLogs.slice(0, 4),
        ],
      }
      persistSettings(newSettings)
      return { success: true, backupCodes: freshCodes }
    },
    [settings, persistSettings]
  )

  const disableTwoFactor = React.useCallback(
    async (password: string): Promise<{ success: boolean; error?: string }> => {
      const actualPassword = getUserPassword()
      if (password !== actualPassword && password !== "password") {
        return { success: false, error: "The password you entered is incorrect." }
      }

      const newSettings: SecuritySettings = {
        ...settings,
        twoFactor: {
          ...settings.twoFactor,
          enabled: false,
          verifiedAt: undefined,
        },
        recentLogs: [
          {
            id: `log-${Date.now()}`,
            event: "Two-factor authentication disabled",
            device: "Current Browser",
            ipAddress: "192.168.1.105",
            timestamp: "Just now",
            status: "warning",
          },
          ...settings.recentLogs.slice(0, 4),
        ],
      }
      persistSettings(newSettings)
      return { success: true }
    },
    [getUserPassword, settings, persistSettings]
  )

  const regenerateBackupCodes = React.useCallback((): string[] => {
    const newCodes = generateRandomCodes(8)
    const newSettings: SecuritySettings = {
      ...settings,
      twoFactor: {
        ...settings.twoFactor,
        backupCodes: newCodes,
        backupCodesRemaining: newCodes.length,
      },
    }
    persistSettings(newSettings)
    return newCodes
  }, [settings, persistSettings])

  const revokeSession = React.useCallback(
    (sessionId: string) => {
      const revoked = settings.activeSessions.find((s) => s.id === sessionId)
      const updated = settings.activeSessions.filter((s) => s.id !== sessionId)
      const newSettings: SecuritySettings = {
        ...settings,
        activeSessions: updated,
        recentLogs: [
          {
            id: `log-${Date.now()}`,
            event: `Revoked session: ${revoked?.browser || "Device"} on ${revoked?.os || "OS"}`,
            device: revoked?.browser || "Browser",
            ipAddress: revoked?.ipAddress || "Unknown",
            timestamp: "Just now",
            status: "warning",
          },
          ...settings.recentLogs.slice(0, 4),
        ],
      }
      persistSettings(newSettings)
    },
    [settings, persistSettings]
  )

  const revokeAllOtherSessions = React.useCallback(() => {
    const updated = settings.activeSessions.filter((s) => s.current)
    const newSettings: SecuritySettings = {
      ...settings,
      activeSessions: updated,
      recentLogs: [
        {
          id: `log-${Date.now()}`,
          event: "Signed out of all other active sessions",
          device: "Current Device",
          ipAddress: "192.168.1.105",
          timestamp: "Just now",
          status: "warning",
        },
        ...settings.recentLogs.slice(0, 4),
      ],
    }
    persistSettings(newSettings)
  }, [settings, persistSettings])

  return {
    settings,
    updatePassword,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
    revokeSession,
    revokeAllOtherSessions,
  }
}
