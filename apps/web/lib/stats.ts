/**
 * Utility functions for calculating statistics
 */

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  company?: { id: string; name: string } | null;
}

export interface ContactStats {
  total: number;
  withEmail: number;
  withPhone: number;
  withCompany: number;
  byCompany: Array<{ company: string; count: number }>;
  byPosition: Array<{ position: string; count: number }>;
}

/**
 * Calculate statistics from contacts
 */
export function calculateContactStats(contacts: Contact[]): ContactStats {
  const total = contacts.length;
  const withEmail = contacts.filter((c) => c.email).length;
  const withPhone = contacts.filter((c) => c.phone).length;
  const withCompany = contacts.filter((c) => c.company).length;

  // Count by company
  const companyMap = new Map<string, number>();
  contacts.forEach((contact) => {
    if (contact.company) {
      const count = companyMap.get(contact.company.name) || 0;
      companyMap.set(contact.company.name, count + 1);
    }
  });
  const byCompany = Array.from(companyMap.entries())
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count);

  // Count by position
  const positionMap = new Map<string, number>();
  contacts.forEach((contact) => {
    if (contact.position) {
      const count = positionMap.get(contact.position) || 0;
      positionMap.set(contact.position, count + 1);
    }
  });
  const byPosition = Array.from(positionMap.entries())
    .map(([position, count]) => ({ position, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    withEmail,
    withPhone,
    withCompany,
    byCompany,
    byPosition,
  };
}


