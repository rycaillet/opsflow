import "dotenv/config";
import {
  Priority,
  RequestStatus,
  Role,
} from "@prisma/client";
import bcrypt from "bcrypt";

import { prisma } from "../src/config/prisma";

const DEMO_PASSWORD = "Password123!";
const SALT_ROUNDS = 12;

function daysAgo(days: number, hour = 10, minute = 0) {
  const date = new Date();

  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);

  return date;
}

async function main() {
  const passwordHash = await bcrypt.hash(
    DEMO_PASSWORD,
    SALT_ROUNDS
  );

  const employee = await prisma.user.upsert({
    where: {
      email: "ryan@example.com",
    },
    update: {
      name: "Ryan Employee",
      role: Role.EMPLOYEE,
      passwordHash,
    },
    create: {
      name: "Ryan Employee",
      email: "ryan@example.com",
      role: Role.EMPLOYEE,
      passwordHash,
    },
  });

  const staff = await prisma.user.upsert({
    where: {
      email: "staff@example.com",
    },
    update: {
      name: "Samantha Staff",
      role: Role.STAFF,
      passwordHash,
    },
    create: {
      name: "Samantha Staff",
      email: "staff@example.com",
      role: Role.STAFF,
      passwordHash,
    },
  });

  const manager = await prisma.user.upsert({
    where: {
      email: "manager@example.com",
    },
    update: {
      name: "Morgan Manager",
      role: Role.MANAGER,
      passwordHash,
    },
    create: {
      name: "Morgan Manager",
      email: "manager@example.com",
      role: Role.MANAGER,
      passwordHash,
    },
  });

  console.log(`Seeded EMPLOYEE: ${employee.email}`);
  console.log(`Seeded STAFF: ${staff.email}`);
  console.log(`Seeded MANAGER: ${manager.email}`);

  const requests = [
    {
      id: "demo-request-projector",
      title: "Conference room projector not working",
      description:
        "The projector in Conference Room B powers on, but it does not display video from any connected laptop. We have a client presentation scheduled this week.",
      category: "Facilities",
      priority: Priority.HIGH,
      status: RequestStatus.IN_PROGRESS,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(9, 9, 15),
      updatedAt: daysAgo(1, 14, 30),
      resolvedAt: null,
    },
    {
      id: "demo-request-github",
      title: "Request access to GitHub Enterprise repository",
      description:
        "I joined the Operations Automation team and need read and write access to the OpsFlow repository in GitHub Enterprise.",
      category: "Access Request",
      priority: Priority.HIGH,
      status: RequestStatus.OPEN,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(7, 11, 0),
      updatedAt: daysAgo(2, 13, 45),
      resolvedAt: null,
    },
    {
      id: "demo-request-emergency-contact",
      title: "Update emergency contact information",
      description:
        "I recently moved and need to update my emergency contact information and mailing address in the HR system.",
      category: "HR",
      priority: Priority.LOW,
      status: RequestStatus.WAITING,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(6, 8, 40),
      updatedAt: daysAgo(2, 15, 10),
      resolvedAt: null,
    },
    {
      id: "demo-request-monitor",
      title: "Request for second monitor",
      description:
        "A second monitor would improve productivity when reviewing support tickets and updating internal documentation.",
      category: "Equipment",
      priority: Priority.MEDIUM,
      status: RequestStatus.OPEN,
      requesterId: employee.id,
      assigneeId: null,
      createdAt: daysAgo(5, 10, 20),
      updatedAt: daysAgo(5, 10, 20),
      resolvedAt: null,
    },
    {
      id: "demo-request-vpn",
      title: "VPN connection drops during remote work",
      description:
        "The company VPN disconnects several times each afternoon, interrupting access to shared drives and internal tools.",
      category: "IT Support",
      priority: Priority.URGENT,
      status: RequestStatus.RESOLVED,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(12, 8, 15),
      updatedAt: daysAgo(4, 16, 20),
      resolvedAt: daysAgo(4, 16, 20),
    },
    {
      id: "demo-request-chair",
      title: "Replace damaged office chair",
      description:
        "The height adjustment on my office chair no longer works, and the chair leans noticeably to one side.",
      category: "Facilities",
      priority: Priority.MEDIUM,
      status: RequestStatus.RESOLVED,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(18, 13, 5),
      updatedAt: daysAgo(8, 9, 30),
      resolvedAt: daysAgo(8, 9, 30),
    },
    {
      id: "demo-request-payroll",
      title: "Question about payroll deduction",
      description:
        "A benefit deduction on my latest paycheck appears different from the amount shown during enrollment.",
      category: "HR",
      priority: Priority.MEDIUM,
      status: RequestStatus.CLOSED,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(21, 10, 45),
      updatedAt: daysAgo(14, 15, 0),
      resolvedAt: daysAgo(15, 11, 30),
    },
    {
      id: "demo-request-badge",
      title: "Badge access needed for engineering floor",
      description:
        "My badge currently works at the main entrance but does not unlock the engineering floor where my new team is located.",
      category: "Access Request",
      priority: Priority.HIGH,
      status: RequestStatus.IN_PROGRESS,
      requesterId: employee.id,
      assigneeId: staff.id,
      createdAt: daysAgo(3, 9, 50),
      updatedAt: daysAgo(1, 11, 25),
      resolvedAt: null,
    },
  ];

  for (const request of requests) {
    await prisma.request.upsert({
      where: {
        id: request.id,
      },
      update: {
        title: request.title,
        description: request.description,
        category: request.category,
        priority: request.priority,
        status: request.status,
        requesterId: request.requesterId,
        assigneeId: request.assigneeId,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        resolvedAt: request.resolvedAt,
      },
      create: request,
    });

    console.log(`Seeded request: ${request.title}`);
  }

  const comments = [
    {
      id: "demo-comment-projector-employee",
      body: "I tested two HDMI cables and two laptops, but the projector still shows no signal.",
      requestId: "demo-request-projector",
      authorId: employee.id,
      createdAt: daysAgo(8, 10, 5),
      updatedAt: daysAgo(8, 10, 5),
    },
    {
      id: "demo-comment-projector-staff",
      body: "Facilities confirmed that the input control module needs to be replaced. The replacement part has been ordered.",
      requestId: "demo-request-projector",
      authorId: staff.id,
      createdAt: daysAgo(1, 14, 30),
      updatedAt: daysAgo(1, 14, 30),
    },
    {
      id: "demo-comment-github-staff",
      body: "Your manager approval was received. I am verifying the correct repository permission level.",
      requestId: "demo-request-github",
      authorId: staff.id,
      createdAt: daysAgo(2, 13, 45),
      updatedAt: daysAgo(2, 13, 45),
    },
    {
      id: "demo-comment-emergency-staff",
      body: "The HR profile has been updated. Please confirm the new mailing address shown in the employee portal.",
      requestId: "demo-request-emergency-contact",
      authorId: staff.id,
      createdAt: daysAgo(2, 15, 10),
      updatedAt: daysAgo(2, 15, 10),
    },
    {
      id: "demo-comment-vpn-employee",
      body: "The disconnections happen most often between 2:00 PM and 4:00 PM.",
      requestId: "demo-request-vpn",
      authorId: employee.id,
      createdAt: daysAgo(10, 14, 15),
      updatedAt: daysAgo(10, 14, 15),
    },
    {
      id: "demo-comment-vpn-staff",
      body: "The VPN client was updated and your network profile was reset. Monitoring confirmed a stable connection afterward.",
      requestId: "demo-request-vpn",
      authorId: staff.id,
      createdAt: daysAgo(4, 16, 20),
      updatedAt: daysAgo(4, 16, 20),
    },
    {
      id: "demo-comment-chair-staff",
      body: "A replacement ergonomic chair was delivered and the damaged chair was removed.",
      requestId: "demo-request-chair",
      authorId: staff.id,
      createdAt: daysAgo(8, 9, 30),
      updatedAt: daysAgo(8, 9, 30),
    },
    {
      id: "demo-comment-payroll-staff",
      body: "Payroll confirmed that the difference was caused by a mid-cycle benefit election. The next paycheck will reflect the standard amount.",
      requestId: "demo-request-payroll",
      authorId: staff.id,
      createdAt: daysAgo(15, 11, 30),
      updatedAt: daysAgo(15, 11, 30),
    },
    {
      id: "demo-comment-badge-employee",
      body: "The access issue affects the fourth-floor engineering entrance and the shared lab.",
      requestId: "demo-request-badge",
      authorId: employee.id,
      createdAt: daysAgo(3, 10, 20),
      updatedAt: daysAgo(3, 10, 20),
    },
    {
      id: "demo-comment-badge-staff",
      body: "Security has added the engineering access group to your profile. The badge update should complete within one business day.",
      requestId: "demo-request-badge",
      authorId: staff.id,
      createdAt: daysAgo(1, 11, 25),
      updatedAt: daysAgo(1, 11, 25),
    },
  ];

  for (const comment of comments) {
    await prisma.comment.upsert({
      where: {
        id: comment.id,
      },
      update: {
        body: comment.body,
        requestId: comment.requestId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
      create: comment,
    });
  }

  console.log(`Seeded ${comments.length} demo comments.`);
  console.log("Demo database seeded successfully.");
  console.log(`Demo password for all accounts: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Unable to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });