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
  Badge,
  Button,
  Input,
  Select,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { getUsersAction, updateUserAction } from "../actions";
import { useToast } from "@/lib/toast";

interface User {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  role: string;
  customRole: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  _count: {
    auditLogs: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterActive, setFilterActive] = React.useState<string>("all");
  const { addToast } = useToast();

  const loadUsers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getUsersAction();
      if (result.success && result.data) {
        setUsers(result.data as User[]);
      } else {
        setError(result.error || "Erreur");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de charger les utilisateurs",
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
  }, [addToast]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const result = await updateUserAction(userId, {
        isActive: !currentStatus,
      });
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: `Utilisateur ${!currentStatus ? "activé" : "désactivé"}`,
        });
        loadUsers();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const filteredUsers = React.useMemo(() => {
    let filtered = users;
    
    if (filterActive !== "all") {
      filtered = filtered.filter((u) =>
        filterActive === "active" ? u.isActive : !u.isActive
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          u.name?.toLowerCase().includes(query) ||
          false
      );
    }
    
    return filtered;
  }, [users, filterActive, searchQuery]);

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {users.length} utilisateur(s) au total
        </p>
      </div>

      {/* Filtres */}
      <Card className="glass card-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Rechercher par email ou nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </Select>
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
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {user.name || user.email}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.customRole ? (
                        <Badge variant="primary">{user.customRole.name}</Badge>
                      ) : (
                        <Badge variant="secondary">{user.role}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="success">Actif</Badge>
                      ) : (
                        <Badge variant="secondary">Inactif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                      >
                        {user.isActive ? "Désactiver" : "Activer"}
                      </Button>
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

