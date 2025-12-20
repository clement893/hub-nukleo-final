"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Input,
  Select,
  Button,
  Badge,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { getAuditLogsAction } from "../actions";
import { useToast } from "@/lib/toast";

interface AuditLog {
  id: string;
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
  action: string;
  entity: string;
  entityId: string | null;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    entity: "",
    action: "",
    startDate: "",
    endDate: "",
  });
  const { addToast } = useToast();

  const loadLogs = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filterParams: any = {};
      if (filters.entity) filterParams.entity = filters.entity;
      if (filters.action) filterParams.action = filters.action;
      if (filters.startDate)
        filterParams.startDate = new Date(filters.startDate);
      if (filters.endDate) filterParams.endDate = new Date(filters.endDate);

      const result = await getAuditLogsAction(filterParams);
      if (result.success && result.data) {
        setLogs(result.data as AuditLog[]);
      } else {
        setError(result.error || "Erreur");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de charger les logs",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      addToast({
        variant: "error",
        title: "Erreur",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, addToast]);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleExportCSV = () => {
    const headers = ["Date", "Utilisateur", "Action", "Entité", "ID", "IP"];
    const rows = logs.map((log) => [
      new Date(log.createdAt).toLocaleString("fr-FR"),
      log.user.email,
      log.action,
      log.entity,
      log.entityId || "",
      log.ipAddress || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "primary";
      case "DELETE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Logs d&apos;audit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {logs.length} log(s) affiché(s)
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          Exporter CSV
        </Button>
      </div>

      {/* Filtres */}
      <Card className="glass card-shadow">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filters.entity}
              onChange={(e) =>
                setFilters({ ...filters, entity: e.target.value })
              }
            >
              <option value="">Toutes les entités</option>
              <option value="User">User</option>
              <option value="Role">Role</option>
              <option value="Project">Project</option>
              <option value="Contact">Contact</option>
            </Select>
            <Select
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
            >
              <option value="">Toutes les actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
            </Select>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              placeholder="Date de début"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              placeholder="Date de fin"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card className="glass card-shadow">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-gray-900 dark:text-white">
                      {new Date(log.createdAt).toLocaleString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {log.user.name || log.user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {log.entity}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-mono text-xs">
                      {log.entityId || "-"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white text-xs">
                      {log.ipAddress || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

