import { describe, it, expect } from "vitest";
import { calculateContactStats, type Contact } from "../stats";

describe("calculateContactStats", () => {
  const mockContacts: Contact[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123456789",
      position: "Developer",
      company: { id: "1", name: "Acme Corp" },
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: null,
      position: "Designer",
      company: { id: "1", name: "Acme Corp" },
    },
    {
      id: "3",
      firstName: "Bob",
      lastName: "Johnson",
      email: null,
      phone: "987654321",
      position: "Manager",
      company: { id: "2", name: "Tech Inc" },
    },
    {
      id: "4",
      firstName: "Alice",
      lastName: "Williams",
      email: "alice@example.com",
      phone: null,
      position: null,
      company: null,
    },
  ];

  it("should calculate total contacts correctly", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.total).toBe(4);
  });

  it("should count contacts with email", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.withEmail).toBe(3);
  });

  it("should count contacts with phone", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.withPhone).toBe(2);
  });

  it("should count contacts with company", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.withCompany).toBe(3);
  });

  it("should group contacts by company", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.byCompany).toHaveLength(2);
    expect(stats.byCompany[0]).toEqual({ company: "Acme Corp", count: 2 });
    expect(stats.byCompany[1]).toEqual({ company: "Tech Inc", count: 1 });
  });

  it("should group contacts by position", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.byPosition.length).toBeGreaterThanOrEqual(3);
    const developerCount = stats.byPosition.find(
      (p) => p.position === "Developer"
    )?.count;
    expect(developerCount).toBe(1);
  });

  it("should handle empty array", () => {
    const stats = calculateContactStats([]);
    expect(stats.total).toBe(0);
    expect(stats.withEmail).toBe(0);
    expect(stats.withPhone).toBe(0);
    expect(stats.withCompany).toBe(0);
    expect(stats.byCompany).toEqual([]);
    expect(stats.byPosition).toEqual([]);
  });

  it("should sort companies by count descending", () => {
    const stats = calculateContactStats(mockContacts);
    expect(stats.byCompany[0].count).toBeGreaterThanOrEqual(
      stats.byCompany[1].count
    );
  });

  it("should sort positions by count descending", () => {
    const stats = calculateContactStats(mockContacts);
    if (stats.byPosition.length > 1) {
      expect(stats.byPosition[0].count).toBeGreaterThanOrEqual(
        stats.byPosition[1].count
      );
    }
  });
});

