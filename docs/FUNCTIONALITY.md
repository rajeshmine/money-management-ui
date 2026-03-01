# End-to-End Functionality Overview

## User Roles & Flows

### Super Admin
| Action | Route | API |
|--------|-------|-----|
| Login | `/auth` | `POST /api/auth/login` |
| Manage Admins | `/users` | `GET/POST/PATCH /api/super/*` |
| Dashboard | `/dashboard` | `GET /api/groups/my-groups` (all groups) |
| Profile | `/profile` | Local storage |

### Admin
| Action | Route | API |
|--------|-------|-----|
| Login | `/auth` | `POST /api/auth/login` |
| Dashboard | `/dashboard` | `GET /api/groups/my-groups`, `GET /api/admin/all-members` |
| Create Group | `/create-chit-groups` | `POST /api/groups/create` |
| List Groups | `/chit-groups` | `GET /api/groups/my-groups` |
| Add Members | `/chit-groups/add-members/:groupId` | `POST /api/admin/create-member` |
| Group Members | `/chit-groups/group-members` | `GET /api/groups/:id/members` or `GET /api/admin/all-members` |
| Map Members | `/chit-groups/map-members/:groupId` | `GET /api/groups/group-details/:id`, `POST /api/groups/assign-member` |
| Auction Entry | `/chit-groups/auctions/:groupId` | `GET /api/groups/:id/members`, `POST /api/auctions/entry` |
| Auction History | (in AuctionEntry) | `GET /api/auctions/group/:groupId` |
| Profile | `/profile` | Local storage |

### Member
| Action | Route | API |
|--------|-------|-----|
| Login | `/auth` | `POST /api/auth/login` |
| My Chit | `/my-chit` | `GET /api/members/my-groups`, `GET /api/members/my-payments` |
| Profile | `/profile` | Local storage |

## API Endpoints Summary

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/login` | No | — |
| GET | `/api/super/admins` | Yes | SUPER_ADMIN |
| POST | `/api/super/create-admin` | Yes | SUPER_ADMIN |
| PATCH | `/api/super/toggle-status/:id` | Yes | SUPER_ADMIN |
| POST | `/api/groups/create` | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/groups/my-groups` | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/groups/group-details/:id` | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/groups/:id/members` | Yes | ADMIN, SUPER_ADMIN |
| PATCH | `/api/groups/:id` | Yes | ADMIN, SUPER_ADMIN |
| DELETE | `/api/groups/:id` | Yes | ADMIN, SUPER_ADMIN |
| POST | `/api/groups/assign-member` | Yes | ADMIN, SUPER_ADMIN |
| POST | `/api/admin/create-member` | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/admin/all-members/:adminId` | Yes | ADMIN, SUPER_ADMIN |
| POST | `/api/admin/map-to-group` | Yes | ADMIN, SUPER_ADMIN |
| PATCH | `/api/admin/members/:id` | Yes | ADMIN, SUPER_ADMIN |
| DELETE | `/api/admin/members/:id` | Yes | ADMIN, SUPER_ADMIN |
| POST | `/api/auctions/entry` | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/auctions/group/:groupId` | Yes | ADMIN, SUPER_ADMIN |
| PATCH | `/api/auctions/:id` | Yes | ADMIN, SUPER_ADMIN |
| DELETE | `/api/auctions/:id` | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/members/my-groups` | Yes | MEMBER |
| GET | `/api/members/my-payments` | Yes | MEMBER |

## Key Flows

1. **Create Chit Group**: Admin creates group → Map members to slots → Record auctions
2. **Member Onboarding**: Admin creates member → Auto-assigned to first available slot in group (when adding from group context), or Map Members for manual slot assignment
3. **Auction**: Admin records winner, bid → System calculates dividend & payable amount → Group status: UPCOMING→ACTIVE (first auction), ACTIVE→COMPLETED (last installment)
4. **Member View**: Member sees their groups and payment history

## Group Status Lifecycle

- **UPCOMING**: New group, no auctions yet
- **ACTIVE**: First auction recorded
- **COMPLETED**: All installments done (installmentNo >= duration)
