// ═══════════════════════════════════════════════════════════
// CR COSMETICS & ESSENTIALS — Server-Side Authentication Service
// ═══════════════════════════════════════════════════════════

import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { ROLES } from './staffService';
import { CustomerUser } from '@/types';

const BCRYPT_ROUNDS = 12;

export function formatGhanaPhone(input: string): string {
  if (!input) return '';
  let cleaned = input.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+233')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('233')) {
    cleaned = '0' + cleaned.slice(3);
  }
  return cleaned;
}

export function isValidGhanaPhone(phone: string): boolean {
  const normalized = formatGhanaPhone(phone);
  return /^0(24|25|54|55|59|53|20|50|27|57|26|28|23)\d{7}$/.test(normalized);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export function evaluatePasswordStrength(password: string) {
  if (!password) return { score: 0, label: 'None', color: '#D8CAD0', checks: { length: false, mixed: false, number: false, symbol: false } };

  const checks = {
    length: password.length >= 8,
    mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };

  const count = Object.values(checks).filter(Boolean).length;
  let score = 0;
  let label = 'Weak';
  let color = '#E05666';

  if (password.length >= 6 && count === 1) {
    score = 1;
    label = 'Weak';
    color = '#E05666';
  } else if (count === 2 || (count === 3 && password.length < 8)) {
    score = 2;
    label = 'Fair';
    color = '#F59E0B';
  } else if (count === 3 && password.length >= 8) {
    score = 3;
    label = 'Good';
    color = '#3B82F6';
  } else if (count >= 4 && password.length >= 8) {
    score = 4;
    label = 'Strong';
    color = '#10B981';
  }

  return { score, label, color, checks };
}

export async function signInCustomer({ identifier, password }: Record<string, any>): Promise<CustomerUser> {
  if (!identifier || !password) {
    throw new Error('Please enter both your email/phone and password.');
  }

  const cleanIdent = String(identifier).trim().toLowerCase();
  const normalizedPhone = formatGhanaPhone(String(identifier));

  const customers = await sql`
    SELECT id, full_name, email, phone, password_hash, status, addresses
    FROM customers
    WHERE LOWER(email) = ${cleanIdent} OR phone = ${normalizedPhone}
    LIMIT 1;
  `;

  if (customers.length === 0) {
    throw new Error('Incorrect email/phone or password.');
  }

  const customer = customers[0];

  if (customer.status === 'DISABLED') {
    throw new Error('This account is currently unavailable.');
  }

  const isValidPassword = await bcrypt.compare(password, customer.password_hash);
  if (!isValidPassword) {
    throw new Error('Incorrect email/phone or password.');
  }

  return {
    id: customer.id,
    name: customer.full_name,
    email: customer.email,
    phone: customer.phone,
    role: 'customer',
  };
}

export async function signUpCustomer({ fullName, email, phone, password }: Record<string, any>) {
  if (!fullName || String(fullName).trim().length < 2) {
    throw new Error('Please enter your full name.');
  }

  if (!email || !isValidEmail(String(email))) {
    throw new Error('Please enter a valid email address.');
  }

  if (phone && !isValidGhanaPhone(String(phone))) {
    throw new Error('Please enter a valid Ghanaian phone number (e.g. 0592153306).');
  }

  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = formatGhanaPhone(String(phone));

  const existingEmail = await sql`
    SELECT id FROM customers WHERE LOWER(email) = ${cleanEmail} LIMIT 1;
  `;
  if (existingEmail.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const customerId = `CUST-${Date.now().toString().slice(-6)}`;

  await sql`
    INSERT INTO customers (id, full_name, phone, email, password_hash, addresses)
    VALUES (${customerId}, ${String(fullName).trim()}, ${cleanPhone || ''}, ${cleanEmail}, ${passwordHash}, '[]'::jsonb);
  `;

  return {
    customer: {
      id: customerId,
      name: String(fullName).trim(),
      email: cleanEmail,
      phone: cleanPhone || '',
      role: 'customer' as const,
    },
  };
}

export async function getCustomerById(customerId: string): Promise<CustomerUser | null> {
  const customers = await sql`
    SELECT id, full_name, email, phone, addresses
    FROM customers
    WHERE id = ${customerId}
    LIMIT 1;
  `;

  if (customers.length === 0) return null;

  const c = customers[0];
  return {
    id: c.id,
    name: c.full_name,
    email: c.email,
    phone: c.phone,
    role: 'customer',
  };
}

export async function signInAdmin({ identifier, password }: Record<string, any>) {
  if (!identifier || !password) {
    throw new Error('Please enter your staff email or username and password.');
  }

  const cleanIdent = String(identifier).trim().toLowerCase();

  const staff = await sql`
    SELECT id, name, email, role, status, password_hash
    FROM staff
    WHERE LOWER(email) = ${cleanIdent} OR LOWER(name) = ${cleanIdent}
    LIMIT 1;
  `;

  if (staff.length === 0) {
    throw new Error('Invalid credentials or unauthorized staff account.');
  }

  const staffUser = staff[0];

  if (staffUser.status !== 'ACTIVE') {
    throw new Error('This staff account is currently inactive.');
  }

  const isValidPassword = await bcrypt.compare(password, staffUser.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials.');
  }

  const roleConfig = ROLES[staffUser.role as keyof typeof ROLES];
  return {
    id: staffUser.id,
    name: staffUser.name,
    email: staffUser.email,
    role: staffUser.role,
    roleName: roleConfig?.name || staffUser.role,
    permissions: roleConfig?.permissions || [],
  };
}

export function createSessionToken(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`;
}

export async function createCustomerSession(customerId: string, rememberMe = false) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + (rememberMe ? 86400000 * 30 : 86400000 * 1));

  try {
    await sql`
      INSERT INTO customer_sessions (token, customer_id, expires_at)
      VALUES (${token}, ${customerId}, ${expiresAt.toISOString()});
    `;
  } catch (e) {}

  return { token, expiresAt };
}

export async function createAdminSession(staffId: string, rememberMe = false) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + (rememberMe ? 86400000 * 7 : 86400000 * 1));

  try {
    await sql`
      INSERT INTO admin_sessions (token, staff_id, expires_at)
      VALUES (${token}, ${staffId}, ${expiresAt.toISOString()});
    `;
  } catch (e) {}

  return { token, expiresAt };
}

export async function validateCustomerSession(token: string): Promise<CustomerUser | null> {
  if (!token) return null;

  try {
    const sessions = await sql`
      SELECT cs.customer_id, c.full_name, c.email, c.phone
      FROM customer_sessions cs
      JOIN customers c ON c.id = cs.customer_id
      WHERE cs.token = ${token} AND cs.expires_at > CURRENT_TIMESTAMP
      LIMIT 1;
    `;

    if (sessions.length === 0) return null;

    const s = sessions[0];
    return {
      id: s.customer_id,
      name: s.full_name,
      email: s.email,
      phone: s.phone,
      role: 'customer',
    };
  } catch (e) {
    return null;
  }
}

export async function validateAdminSession(token: string) {
  if (!token) return null;

  try {
    const sessions = await sql`
      SELECT s.id, s.name, s.email, s.role, s.status
      FROM admin_sessions ass
      JOIN staff s ON s.id = ass.staff_id
      WHERE ass.token = ${token} AND ass.expires_at > CURRENT_TIMESTAMP AND s.status = 'ACTIVE'
      LIMIT 1;
    `;

    if (sessions.length === 0) return null;

    const s = sessions[0];
    const roleConfig = ROLES[s.role as keyof typeof ROLES];
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      roleName: roleConfig?.name || s.role,
      permissions: roleConfig?.permissions || [],
    };
  } catch (e) {
    return null;
  }
}

export async function destroyCustomerSession(token: string): Promise<void> {
  try {
    await sql`DELETE FROM customer_sessions WHERE token = ${token};`;
  } catch (e) {}
}

export async function destroyAdminSession(token: string): Promise<void> {
  try {
    await sql`DELETE FROM admin_sessions WHERE token = ${token};`;
  } catch (e) {}
}
