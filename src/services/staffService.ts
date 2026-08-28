// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Staff & RBAC Service
// ═══════════════════════════════════════════════════════════

export interface RoleConfig {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const ROLES: Record<string, RoleConfig> = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full business authority across all modules, settings, staff, and financial reports.',
    permissions: [
      'view_dashboard', 'manage_products', 'manage_categories',
      'manage_inventory', 'manage_orders', 'verify_payments',
      'manage_customers', 'view_reports', 'export_data',
      'manage_staff', 'manage_settings', 'view_audit_log',
    ],
  },
  STORE_MANAGER: {
    id: 'STORE_MANAGER',
    name: 'Store Manager (Botwe)',
    description: 'Day-to-day store operations, stock intake, pricing updates, and order fulfillment.',
    permissions: [
      'view_dashboard', 'manage_products', 'manage_categories',
      'manage_inventory', 'manage_orders', 'verify_payments',
      'manage_customers', 'view_reports', 'view_audit_log',
    ],
  },
  ORDER_STAFF: {
    id: 'ORDER_STAFF',
    name: 'Order & Dispatch Operator',
    description: 'Picking, packing, rider dispatching, and customer order status updates.',
    permissions: [
      'view_dashboard', 'manage_orders', 'view_customers',
    ],
  },
  INVENTORY_STAFF: {
    id: 'INVENTORY_STAFF',
    name: 'Inventory & Stock Clerk',
    description: 'Receiving shipments, count verification, and low stock management.',
    permissions: [
      'view_dashboard', 'manage_inventory', 'view_products',
    ],
  },
};

const staffUsers = [
  {
    id: 'USR-001',
    name: 'Akosua Boakye',
    email: 'akosua@crcosmetics.gh',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'USR-002',
    name: 'Kofi Mensah',
    email: 'kofi.manager@crcosmetics.gh',
    role: 'STORE_MANAGER',
    status: 'ACTIVE',
    lastActive: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
];

let currentActiveUser = staffUsers[0];

export function getCurrentStaffUser() {
  return currentActiveUser;
}

export function getAllStaffUsers() {
  return [...staffUsers];
}

export function hasPermission(permissionKey: string, user = currentActiveUser): boolean {
  const roleConfig = ROLES[user.role];
  if (!roleConfig) return false;
  return roleConfig.permissions.includes(permissionKey);
}
