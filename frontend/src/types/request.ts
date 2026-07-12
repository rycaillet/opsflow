export type RequestUser = {
  id: string;
  name: string;
  email: string;
  role?: "EMPLOYEE" | "STAFF" | "MANAGER" | "ADMIN";
};

export type OpsRequest = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
  requesterId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  requester?: RequestUser;
  assignee?: RequestUser | null;
};