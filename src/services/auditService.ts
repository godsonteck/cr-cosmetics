// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Audit Trail Service
// ═══════════════════════════════════════════════════════════

import { storeStorage } from '@/utils/storeStorage';

export interface AuditLogEntry {
  eventId: string;
  timestamp: string;
  action: string;
  operator: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
}

function loadAuditLogs(): AuditLogEntry[] {
  return storeStorage.getAuditLogs<AuditLogEntry>([]);
}

function saveAuditLogs(logs: AuditLogEntry[]): void {
  storeStorage.saveAuditLogs(logs);
}

export function recordAuditEvent({
  action,
  operator = 'System',
  entityType = 'GENERAL',
  entityId = '',
  details = {},
}: {
  action: string;
  operator?: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
}): AuditLogEntry {
  const logEntry: AuditLogEntry = {
    eventId: `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
    action,
    operator,
    entityType,
    entityId,
    details,
  };

  const logs = loadAuditLogs();
  logs.unshift(logEntry);
  saveAuditLogs(logs);
  return logEntry;
}

export function getAuditLogs(limit = 50, filterType: string | null = null): AuditLogEntry[] {
  let results = loadAuditLogs();
  if (filterType) {
    results = results.filter((log) => log.entityType === filterType || log.action.includes(filterType));
  }
  return results.slice(0, limit);
}
