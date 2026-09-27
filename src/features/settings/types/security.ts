export type TwoFactorMethod = "authenticator" | "sms" | "security_key"

export interface TwoFactorState {
  enabled: boolean
  method: TwoFactorMethod
  secret?: string
  verifiedAt?: string
  backupCodes: string[]
  backupCodesRemaining: number
}

export interface SecuritySession {
  id: string
  device: string
  browser: string
  os: string
  ipAddress: string
  location: string
  current: boolean
  lastActive: string
}

export interface SecurityLogEntry {
  id: string
  event: string
  device: string
  ipAddress: string
  timestamp: string
  status: "success" | "warning" | "error"
}

export interface SecuritySettings {
  twoFactor: TwoFactorState
  passwordLastChanged: string
  activeSessions: SecuritySession[]
  recentLogs: SecurityLogEntry[]
}
