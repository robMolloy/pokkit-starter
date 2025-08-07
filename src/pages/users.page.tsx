import { ConfirmationModalContent } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "@/components/ui/table";
import { pb } from "@/config/pocketbaseConfig";
import { deleteUser, TUser, updateUserRole, updateUserStatus } from "@/modules/users/dbUsersUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import { useCurrentUserStore } from "@/stores/authDataStore";
import { useModalStore } from "@/stores/modalStore";
import { CustomIcon } from "@/components/CustomIcon";
import { MainLayout } from "@/components/layout/Layout";
import { H1 } from "@/components/ui/defaultComponents";

const statusColorClassMap: { [k in TUser["status"]]: string } = {
  pending: "bg-muted",
  approved: "bg-green-500",
  blocked: "bg-destructive",
} as const;

const UserStatusSelect = (p: {
  user: TUser;
  onStatusChange: (x: TUser) => void;
  disabled?: boolean;
}) => {
  return (
    <>
      <Select
        value={p.user.status}
        onValueChange={(status: TUser["status"]) => p.onStatusChange({ ...p.user, status: status })}
        disabled={p.disabled}
      >
        <SelectTrigger className={`${statusColorClassMap[p.user.status]}`}>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {p.user.status === "pending" && <SelectItem value="pending">Pending</SelectItem>}
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

const UserRoleSelect = (p: {
  user: TUser;
  onStatusChange: (x: TUser) => void;
  disabled?: boolean;
}) => {
  return (
    <>
      <Select
        value={p.user.role}
        onValueChange={(role: TUser["role"]) => p.onStatusChange({ ...p.user, role })}
        disabled={p.disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

const UsersPage = () => {
  const usersStore = useUsersStore();
  const modalStore = useModalStore();
  const currentUserStore = useCurrentUserStore();

  return (
    <MainLayout>
      <H1>Users</H1>
      <br />
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {usersStore.data.map((user) => {
            const userOwnsRecord =
              currentUserStore.data.authStatus === "loggedIn" &&
              user.id === currentUserStore.data.user.id;
            return (
              <TableRow key={user.id} className={userOwnsRecord ? "bg-muted" : ""}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserStatusSelect
                    user={user}
                    disabled={userOwnsRecord}
                    onStatusChange={async (user: TUser) => {
                      modalStore.setData(
                        <ConfirmationModalContent
                          title="Update status"
                          description={`Are you sure you want to change the status of ${user.name} to ${user.status}?`}
                          onConfirm={() =>
                            updateUserStatus({ pb, id: user.id, status: user.status })
                          }
                        />,
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <UserRoleSelect
                    user={user}
                    disabled={userOwnsRecord}
                    onStatusChange={async (user: TUser) => {
                      modalStore.setData(
                        <ConfirmationModalContent
                          title="Update role"
                          description={`Are you sure you want to change the role of ${user.name} to ${user.role}?`}
                          onConfirm={() => updateUserRole({ pb, id: user.id, role: user.role })}
                        />,
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  {!userOwnsRecord && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        modalStore.setData(
                          <ConfirmationModalContent
                            title="Delete user"
                            description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
                            onConfirm={() => deleteUser({ pb, id: user.id })}
                          />,
                        );
                      }}
                    >
                      <CustomIcon iconName="Trash2" size="md" className="text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default UsersPage;
