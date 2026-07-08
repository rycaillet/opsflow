# OpsFlow Product Requirements

## Overview

OpsFlow is a full-stack operations request platform for internal company workflows. Employees can submit workplace requests, staff members can manage and resolve them, and managers can track team workload and resolution progress.

## Problem

In many organizations, internal requests are scattered across email, Slack, spreadsheets, and informal conversations. This makes it difficult to know who owns a request, what its current status is, and how efficiently work is being completed.

## Solution

OpsFlow centralizes internal operations requests into one organized platform. It provides clear request ownership, status tracking, comments, role-based access, and analytics.

## Target Users

### Employee

An employee submits requests and tracks their own requests.

### Staff

A staff member manages incoming requests, assigns work, updates statuses, and communicates with employees.

### Manager/Admin

A manager monitors request volume, team workload, and operational performance.

## V1 Features

### Authentication

- Register
- Login
- Logout
- Protected routes
- Role-based access control

### Requests

- Create a request
- View requests
- View request details
- Update request status
- Assign request to a staff member
- Filter requests by status, priority, and category

### Comments

- Add comments to a request
- View request comment history

### Dashboard

Employees can view:
- Their submitted requests
- Request status summaries

Staff can view:
- All open requests
- Requests assigned to them
- High-priority requests

Managers can view:
- Total requests
- Open requests
- Completed requests
- Average resolution time
- Requests by category
- Requests by priority

## Core Data Models

### User

- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

### Request

- id
- title
- description
- category
- priority
- status
- requesterId
- assigneeId
- createdAt
- updatedAt
- resolvedAt

### Comment

- id
- requestId
- authorId
- body
- createdAt
- updatedAt

## Roles and Permissions

### Employee

- Can create requests
- Can view their own requests
- Can comment on their own requests

### Staff

- Can view all requests
- Can assign requests
- Can update request statuses
- Can comment on any request

### Manager/Admin

- Can perform all staff actions
- Can view analytics

## Non-Goals for V1

- Payments
- AI features
- Real-time chat
- Mobile app
- Calendar integrations
- Enterprise single sign-on
- Complex notification system
- Multi-organization support

## Success Criteria

OpsFlow V1 is successful when a user can register, log in, submit a request, have that request assigned and updated by staff, comment on the request, and view useful dashboard metrics based on request activity.