# Ela Chittu — Frontend

ஏலச் சீட்டு — React frontend for chit fund management.

## Tech Stack

- React 19, Vite 7, TypeScript
- Tailwind CSS 4, Radix UI
- React Router 7

## Features & Routes

### Super Admin
| Route | Page | Features |
|-------|------|----------|
| `/auth` | Login | Phone + password |
| `/users` | Manage Admins | Create, list, toggle admin status |
| `/dashboard` | Dashboard | All groups overview |
| `/profile` | Profile | View profile |

### Admin
| Route | Page | Features |
|-------|------|----------|
| `/auth` | Login | Phone + password |
| `/dashboard` | Dashboard | Stats, recent groups, quick create |
| `/create-chit-groups` | Create Group | Name, value, members, payment type |
| `/chit-groups` | Chit Groups | List, add members, map, auction, delete |
| `/chit-groups/add-members/:id` | Add Members | Create members, auto-map |
| `/chit-groups/group-members` | Member Directory | View/filter members |
| `/chit-groups/map-members/:id` | Map Members | Assign members to slots |
| `/chit-groups/auctions/:id` | Auction | Record winner, bid, admin fees, installment |
| `/profile` | Profile | View profile |

### Member
| Route | Page | Features |
|-------|------|----------|
| `/auth` | Login | Phone + password |
| `/my-chit` | My Chit | Groups, payment history, totals |
| `/profile` | Profile | View profile |

## Quick Start

```bash
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001
npm run dev
```

Runs at `http://localhost:5173`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (no trailing slash) |
