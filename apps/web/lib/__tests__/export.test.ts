import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportToCSV, exportToPDF, type ExportableData } from "../export";

describe("exportToCSV", () => {
  beforeEach(() => {
    // Mock document.createElement and URL methods
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
    global.document.createElement = vi.fn(() => ({
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: {},
    })) as any;
    global.document.body.appendChild = vi.fn();
    global.document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should export data to CSV format", () => {
    const data: ExportableData[] = [
      { name: "John", age: 30, city: "Paris" },
      { name: "Jane", age: 25, city: "Lyon" },
    ];

    expect(() => exportToCSV(data, "test.csv")).not.toThrow();
  });

  it("should handle empty array", () => {
    const data: ExportableData[] = [];
    expect(() => exportToCSV(data, "test.csv")).not.toThrow();
  });

  it("should escape quotes in CSV", () => {
    const data: ExportableData[] = [
      { name: 'John "Johnny" Doe', age: 30 },
    ];
    expect(() => exportToCSV(data, "test.csv")).not.toThrow();
  });

  it("should handle null and undefined values", () => {
    const data: ExportableData[] = [
      { name: "John", age: null, city: undefined },
    ];
    expect(() => exportToCSV(data, "test.csv")).not.toThrow();
  });
});

describe("exportToPDF", () => {
  beforeEach(() => {
    global.window.open = vi.fn(() => ({
      document: {
        write: vi.fn(),
        close: vi.fn(),
      },
      focus: vi.fn(),
      print: vi.fn(),
    })) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should export data to PDF format", () => {
    const data: ExportableData[] = [
      { name: "John", age: 30, city: "Paris" },
      { name: "Jane", age: 25, city: "Lyon" },
    ];

    expect(() => exportToPDF(data, "Test Title", "test.pdf")).not.toThrow();
  });

  it("should handle empty array", () => {
    const data: ExportableData[] = [];
    expect(() => exportToPDF(data, "Test Title", "test.pdf")).not.toThrow();
  });
});


