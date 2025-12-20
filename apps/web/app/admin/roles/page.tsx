"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import {
  getRolesAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
} from "../actions";
import { useToast } from "@/lib/toast";

const PERMISSIONS = [
  // Users
  "users:read",
  "users:write",
  "users:delete",
  // Projects
  "projects:read",
  "projects:write",
  "projects:delete",
  // Contacts
  "contacts:read",
  "contacts:write",
  "contacts:delete",
  // Companies
  "companies:read",
  "companies:write",
  "companies:delete",
  // Admin
  "admin:access",
  "admin:roles",
  "admin:audit",
];

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  _count: {
    users: number;
  };
}

export default function AdminRolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const { addToast } = useToast();

  const loadRoles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getRolesAction();
      if (result.success && result.data) {
        setRoles(result.data as Role[]);
      } else {
        setError(result.error || "Erreur");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de charger les rôles",
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
    loadRoles();
  }, [loadRoles]);

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      return;
    }

    try {
      const result = await deleteRoleAction(roleId);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Rôle supprimé avec succès",
        });
        loadRoles();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer",
        });
      }
    } catch (err) {
      addToast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingRole) {
        result = await updateRoleAction(editingRole.id, formData);
      } else {
        result = await createRoleAction(formData);
      }

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: `Rôle ${editingRole ? "modifié" : "créé"} avec succès`,
        });
        setIsModalOpen(false);
        loadRoles();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
        });
      }
    } catch (err) {
      addToast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
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
            Gestion des rôles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {roles.length} rôle(s) configuré(s)
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Créer un rôle
        </Button>
      </div>

      {/* Tableau */}
      <Card className="glass card-shadow">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {role.name}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {role._count.users}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(role)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(role.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="glass card-shadow max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {editingRole ? "Modifier le rôle" : "Créer un rôle"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4">
                    {PERMISSIONS.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingRole ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

