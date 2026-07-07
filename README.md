#  Git Data — GitHub Dataset Explorer (MERN) Platform

[![Backend Status](https://img.shields.io/badge/Backend_Status-Online-emerald?style=flat-square&logo=node.js)](https://github-dataset-nitish-kumaar.onrender.com/api/v1/system/health)
[![Database Version](https://img.shields.io/badge/Database_Version-MongoDB_v6.0-blue?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

Git Data is a high-performance, enterprise-grade codebase and instruction dataset management platform. It ingests, parses, indexes, aggregates, and visualizes codebase and instruction datasets (like GitHub repositories, Python code elements, documentation, and markdown files) for machine learning and AI training. The backend architecture leverages Node.js, Express, MongoDB, and Mongoose with heavily optimized aggregation pipelines and customized security middlewares.

---

## 🌐 What is the GitHub Dataset (Git Data)?
The GitHub Dataset is a comprehensive repository of standardized programming elements, codebase documentations, and instruction-tuning pairs extracted from public repositories. Maintainers and AI developers use this data to train code generation models, analyze code structures, and inspect public source patterns.

Every entry in the database represents a dataset document containing instructions, optional inputs, and detailed outputs, combined with a rich metadata object specifying:
- **Repository information** (e.g., repository name, source URL, source type)
- **Code structures** (e.g., whether it is a function, class, class implementation, or docstring)
- **File extensions and formats** (e.g., `.py`, `.md`, `.rst` file types)
- **Language tags** and classification markers.

Git Data directly exposes a REST API with advanced dynamic filters, full-text search index lookups, and specialized analytics to inspect these structures instantly.

**Why this matters**: As large language models (LLMs) continue to dominate software development workflows, having structured datasets for training, evaluation, and fine-tuning is vital. Git Data brings raw programming and instruction datasets to life through a beautiful REST API with search, statistics, and role-based access control.

---

## ⚡ Key Highlights & Core Features
- **⚡ High-Speed Dataset Exploration**: Seamless listing, paginated browsing, and custom sorting on datasets, supporting multiple filter parameters at once.
- **🧩 Smart Data Transform & Schema**: The schema ([dataset.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/models/dataset.js)) flattens complex nested structures into clear, indexed fields. It uses compound indexes on repository name + type and full-text indexes for search optimization.
- **📊 Robust Analytics & KPIs**: Heavy MongoDB aggregation pipelines compute data type counts, top repositories, programming languages, and framework usage (e.g., PyTorch, TensorFlow).
- **🔒 Stateless Multi-Role JWT Security**: Implements JWT access and refresh token flows, allowing secure sessions, token revocation, profile updates, and role guards (User, Admin).
- **🚦 Intelligent Rate-Limiting**: Fine-grained rate limiters ([rateLimiter.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/middlewares/rateLimiter.js)) apply appropriate thresholds to protect auth, search, stats, and import/export routes.
- **📋 CSV/JSON Data Importer & Exporter**: Support for exporting collections to CSV files and importing raw JSON dataset documents in bulk.

---

## 🏗️ Backend System Architecture
The backend follows a modular Model-View-Controller (MVC) pattern optimized for high-throughput API routing:
1. **Routing Layer**: Exposes resource endpoints under API versioning (`/api/v1`). Employs CORS policy and pathway rate-limiters.
2. **Security & Middleware Layer**: Intercepts requests to validate JWT access tokens, verify roles (Admin vs. User), and capture validation anomalies via Express validator middlewares.
3. **Controller Layer**: Encapsulates business logic, including pagination utilities and dynamic filter parsing.
4. **Data Access Layer (Mongoose)**: Manages MongoDB interaction with compound and text indexing on the `datasets` collection.

---

## 📂 Codebase File Structure
```
github-dataset-nitish-kumar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                        # MongoDB Database Connection
│   │   ├── controllers/
│   │   │   ├── analyticsController.js       # Dataset Analysis & Aggregations
│   │   │   ├── authController.js            # Login, Register, Profiles, Token Revocation
│   │   │   ├── datasetController.js         # Dataset CRUD, Bulk Ops, Filters, CSV/JSON Export
│   │   │   └── statsController.js           # KPI Builders & Count Metrics
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js            # JWT Validation & Role Guardians
│   │   │   ├── errorMiddleware.js           # Global Express Error Handler
│   │   │   └── rateLimiter.js               # Pathway Limit Controllers
│   │   ├── models/
│   │   │   ├── dataset.js                   # Flattened Dataset Model with Compound Indices
│   │   │   └── user.js                      # User and Admin Identity Schema
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.js           # Analytics Aggregation Routes
│   │   │   ├── authRoutes.js                # Authentication, Profiles & User Management
│   │   │   ├── datasetRoutes.js             # Dynamic CRUD, Bulk Ops, and Static Filter Paths
│   │   │   ├── jwtRoutes.js                 # Token Telemetry Status & Protected JWT Routes
│   │   │   ├── searchRoutes.js              # Specialized Search Binding
│   │   │   └── statsRoutes.js               # High-Performance Count Routes
│   │   ├── scripts/
│   │   │   ├── test-connection.js           # Verification Script for DB Connection
│   │   │   └── test-pr14.js                 # Automated API Route Test Runner
│   │   ├── utils/
│   │   │   ├── AppError.js                  # Standardized Application Error Object
│   │   │   ├── catchAsync.js                # Async Express Handler Wrapper
│   │   │   ├── filterBuilder.js             # Dynamic Search Query Builder
│   │   │   └── pagination.js                # Centralized Pagination Calculator
├── frontend/
│   ├── dist/                                # Built static assets
│   ├── src/
│   │   ├── assets/                          # Static assets and images
│   │   ├── components/                      # Premium UI Components (Navbar, Sidebar, Sidebar Filters)
│   │   ├── hooks/                           # Custom React Hooks
│   │   ├── pages/                           # Screen Pages (Explorer, Dashboards, Auth screens)
│   │   ├── services/                        # API Service Clients (Axios setup)
│   │   └── store/                           # Redux Slices (Auth, Datasets, Stats, UI)
└── README.md                                # Comprehensive Platform Manual
```

---

## 🛠️ Environment Configuration (.env)
Create a `.env` file inside the `backend/` directory based on the template below:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/github_dataset_db
JWT_SECRET=your_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_2026
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
API_VERSION=v1
```

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v16+ recommended)
- **MongoDB Community Server** (running on `localhost:27017`)

### 2. Install Project Dependencies
Navigate to the backend directory and install:
```bash
cd backend
npm install
```
Navigate to the frontend directory and install:
```bash
cd ../frontend
npm install
```

### 3. Bootstrap & Verify Connection
To ensure your database connection is active and verify documents:
```bash
# Verify connection to MongoDB and query sample data
node backend/src/scripts/test-connection.js
```

### 4. Running the Servers
Start the backend development server (assuming a bootstrap loader or wrapper, or run test scripts directly):
```bash
# Run automated API route tests
node backend/src/scripts/test-pr14.js
```
Start the frontend development server:
```bash
cd frontend
npm run dev
```

---

## 🧪 Comprehensive Postman Testing Guide
The backend features distinct endpoints grouped into operational folders. You can import the preconfigured collection to perform automated testing:

1. **Import Collection**:
   - Open Postman.
   - Drag and drop your pre-configured Postman JSON collection.
2. **Auto-Authentication Setup**:
   - The collection uses an environment script on the `/api/v1/auth/login` request.
   - On a successful login, the bearer access token is automatically extracted and rotated into variables.
   - Subsequent protected requests execute seamlessly.

---

## 📈 Endpoint Folders & Route Counts
- **01 - Authentication**: Session login, register, profile fetching, profile updates, email verification, OTP sending, and password resetting.
- **02 - Datasets (CRUD)**: Administrative creations, updates, soft-deletes, restorations, check endpoint, and bulk import/export.
- **03 - Filter Routes**: Endpoints filtering datasets specifically by type (functions, classes, docs, readmes, python, frameworks, ML, AI).
- **04 - Advanced Queries**: Random selectors, recent datasets, trending repos, and recommendation generators.
- **05 - Statistics & Analytics**: Telemetry dashboard counts, framework distributions, language frequencies, and repository metrics.
- **06 - Admin Panel**: Restricted user creations, system analytics dashboards, and bulk setups.
- **07 - Token Management**: Token validations, refresh cycles, and revokes.

---

## 🛡️ Developer Information & Repository Sync
This codebase is managed using a structured, 30-PR bottom-up deployment plan ensuring a fully clean, compilable, and professional merge history on the main branch.

- **Repository URL**: [github.com/ChittHirpara/national_vulnerability_database_hirpara_chitt_h](https://github.com/ChittHirpara/national_vulnerability_database_hirpara_chitt_h)
- **Current Milestone**: Phase 5 (PRs 1 - 25 backend fully completed, tested, and pushed).

---

## 📑 Pagination Utility
- **File**: [`backend/src/utils/pagination.js`](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/utils/pagination.js)
- **Purpose**: Calculates request `skip` and `limit` values based on query parameters.
- **Rules & Bounds**:
  - The default page is `1`.
  - The default limit is `10`.
  - The maximum limit is capped at `100` to prevent payload overload.
- **Where it is used**:
  - GET `/api/v1/datasets` — Retrieves paginated datasets using MongoDB query constraints.
  - GET `/api/v1/search/datasets` — Paginated search results.

---

## 🔐 JWT Authentication & Refresh Tokens
- **Files**:
  - Control Logic: [`backend/src/controllers/authController.js`](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/controllers/authController.js)
  - Security Check: [`backend/src/middlewares/authMiddleware.js`](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/middlewares/authMiddleware.js)
- **Token Design**:
  - **Access Token**: Short-lived payload containing user identification and roles (Admin vs. User).
  - **Refresh Token**: Long-lived credential used to request a new Access Token without logging out.
- **Supported Operations**:
  - `generateToken`: Issues new access/refresh tokens.
  - `verifyToken`: Decodes and validates signature integrity.
  - `refreshToken`: Renews token credentials.
  - `revokeToken`: Blacklists refresh tokens on logout.

---

## 📊 Sample Dataset Document (Excerpt)
```json
{
  "_id": "648cf103fca91c3be895b9c0",
  "id": "dataset-repo-0012",
  "instruction": "Write a python function to compute the Fibonacci sequence recursively.",
  "input": "n = 10",
  "output": "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
  "metadata": {
    "type": "function_implementation",
    "code_element": "function",
    "repo_name": "pytorch-sequence-gen",
    "file_path": "scripts/fibonacci.py",
    "source_type": "github_repository",
    "doc_type": "python_source",
    "is_readme": false,
    "url": "https://github.com/example/pytorch-sequence-gen/blob/main/scripts/fibonacci.py",
    "source": "github"
  },
  "isDeleted": false,
  "createdAt": "2026-06-10T11:12:00.000Z",
  "updatedAt": "2026-07-06T14:15:00.000Z"
}
```

---

## 🗂️ Raw Dataset Entry — Understanding Our Schema Data
Each dataset document structured in MongoDB contains the following core fields:
- **`id`**: Unique string-based dataset identifier (e.g., `dataset-repo-0012`). Used as the primary lookup index.
- **`instruction`**: The prompt or directive indicating what code task is requested (indexed for text searches).
- **`input`**: The optional contextual input or argument constraints (indexed for text searches).
- **`output`**: The generated codebase solution, docstring, or output content (indexed for text searches).
- **`metadata`**: Structured parameters describing the origin and syntax:
  - `type`: Category of document (e.g., `function`, `class`, `documentation`, `readme`).
  - `code_element`: Logical parsing classification (`function`, `class`).
  - `repo_name`: Source GitHub repository label.
  - `file_path`: Relative location in the source workspace.
  - `source_type`: Origin source feed (`github_repository`).
  - `doc_type`: Underlying format category (`python_source`, `markdown`).
  - `is_readme`: Boolean identifying if the raw file is a README document.
- **`isDeleted`**: Boolean indicator for soft-delete security.

---

## 🔄 How Our Controller Transforms / Filters This Data
The backend dynamically builds filters using the utility [`backend/src/utils/filterBuilder.js`](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/utils/filterBuilder.js):

- Converts HTTP query parameters (`?repo=pytorch&type=function&is_readme=false`) into Mongoose queries.
- Translates keyword searches into regular expressions and MongoDB `$or`/`$and` constructs.
- Automatically strips `isDeleted: true` results, ensuring soft-deleted records do not bleed into standard endpoint results.

---

## 📚 API Routes & Endpoints

### Authentication `/api/v1/auth`
| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user profile | Public |
| **POST** | `/login` | Authenticate and receive JWT access/refresh tokens | Public |
| **POST** | `/logout` | Log out and invalidate refresh tokens | Public |
| **POST** | `/forgot-password` | Send password reset token/link (stub) | Public |
| **POST** | `/reset-password` | Reset password using generated token | Public |
| **POST** | `/send-otp` | Send verification OTP code to user | Public |
| **POST** | `/verify-email` | Verify email address using OTP code | Public |
| **GET** | `/profile` | Get currently logged-in user profile | Protected |
| **PATCH** | `/profile` | Update own user profile data | Protected |
| **POST** | `/change-password` | Change user password | Protected |
| **GET** | `/users` | Get all system users | Admin-Only |
| **POST** | `/users` | Create user manually | Admin-Only |
| **PATCH** | `/users/:id` | Update user data | Admin-Only |
| **DELETE** | `/users/:id` | Delete user from system | Admin-Only |

### JWT Telemetry `/api/v1/jwt`
| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/generate-token` | Generate a new access token payload | Public |
| **POST** | `/verify-token` | Verify signature of an access token | Public |
| **POST** | `/refresh-token` | Issue new access token using refresh token | Public |
| **DELETE** | `/revoke-token` | Revoke/invalidate refresh token | Public |
| **GET** | `/profile` | Retrieve profile associated with JWT token | Protected |
| **GET** | `/dashboard` | Return token-guarded JWT telemetry status | Protected |
| **GET** | `/private-datasets` | Return paginated list of datasets for token validation | Protected |
| **GET** | `/private-analytics` | Return type distribution analytics | Protected |

### Datasets `/api/v1/datasets`
| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/system/health` | Return API service health status | Public |
| **GET** | `/` | Retrieve paginated list of datasets | Public |
| **POST** | `/` | Create a single dataset entry | Public |
| **GET** | `/random` | Fetch a random dataset document | Public |
| **GET** | `/trending` | Retrieve list of trending datasets | Public |
| **GET** | `/recent` | Fetch list of recently added datasets | Public |
| **GET** | `/recommendations` | Get personalized dataset recommendations | Public |
| **GET** | `/export/csv` | Export entire dataset collection to a CSV download | Public |
| **POST** | `/import-json` | Upload and seed a JSON dataset file | Public |
| **GET** | `/check/:id` | Check if a dataset ID exists | Public |
| **GET** | `/admin/datasets` | Retrieve datasets (admin audit endpoint) | Admin-Only |
| **POST** | `/protected/datasets` | Protected creation of a dataset | Protected |
| **PATCH** | `/protected/datasets/:id` | Update dataset details | Protected |
| **DELETE** | `/protected/datasets/:id` | Soft-delete a dataset | Protected |
| **POST** | `/protected/datasets/:id/restore` | Restore soft-deleted dataset | Admin-Only |
| **POST** | `/bulk-create` | Create multiple datasets at once | Public |
| **PATCH** | `/bulk-update` | Update multiple datasets at once | Public |
| **DELETE** | `/bulk-delete` | Delete multiple datasets at once | Public |
| **POST** | `/bulk-restore` | Restore multiple deleted datasets | Admin-Only |
| **GET** | `/readme` | Fetch README-based datasets | Public |
| **GET** | `/functions` | Fetch function-based datasets | Public |
| **GET** | `/classes` | Fetch class-based datasets | Public |
| **GET** | `/documentation` | Fetch documentation-based datasets | Public |
| **GET** | `/github` | Fetch GitHub origin datasets | Public |
| **GET** | `/python` | Fetch Python programming language datasets | Public |
| **GET** | `/ml` | Fetch Machine Learning datasets | Public |
| **GET** | `/ai` | Fetch Artificial Intelligence datasets | Public |
| **GET** | `/code-generation` | Fetch code-generation datasets | Public |
| **GET** | `/docstrings` | Fetch docstring-based datasets | Public |
| **GET** | `/filter/*` | Hardcoded routing filters matching above pathways | Public |
| **GET** | `/sort/recent` | Specialized sorting by publication age | Public |

### Search `/api/v1/search`
| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/datasets` | Full-text query keyword search across fields | Public |

### Statistics `/api/v1/stats`
| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/datasets/count` | Total dataset count | Public |
| **GET** | `/datasets/functions` | Count of function-based datasets | Public |
| **GET** | `/datasets/classes` | Count of class-based datasets | Public |
| **GET** | `/datasets/documentation` | Count of documentation datasets | Public |
| **GET** | `/datasets/readme` | Count of README datasets | Public |
| **GET** | `/datasets/repos` | Count of unique repository groups | Public |
| **GET** | `/datasets/languages` | Count of unique programming languages | Public |
| **GET** | `/datasets/frameworks` | Count of ML frameworks referenced | Public |
| **GET** | `/datasets/github` | Count of GitHub source datasets | Public |
| **GET** | `/datasets/ai` | Count of AI specific datasets | Public |
| **GET** | `/datasets/analytics` | Merged counts and dashboard data objects | Public |

### Analytics `/api/v1/analytics`
| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/admin/analytics` | Administrative type analytics summary | Admin-Only |
| **GET** | `/datasets/type-analysis` | Aggregate datasets by type category | Public |
| **GET** | `/datasets/repo-analysis` | Aggregate counts grouped by repository name | Public |
| **GET** | `/datasets/source-analysis` | Aggregate counts by source type (e.g. GitHub) | Public |
| **GET** | `/datasets/framework-analysis` | PyTorch vs. TensorFlow distribution analysis | Public |
| **GET** | `/datasets/language-analysis` | Language breakdown based on file extension | Public |
| **GET** | `/datasets/code-analysis` | Functions vs. classes distribution ratio | Public |
| **GET** | `/datasets/doc-analysis` | Detailed formats grouping analysis | Public |
| **GET** | `/datasets/readme-analysis` | Proportion of README datasets vs. other code blocks | Public |
| **GET** | `/datasets/ml-analysis` | Machine Learning repository analytics distribution | Public |
| **GET** | `/datasets/ai-analysis` | AI repository analytics distribution | Public |

---

## 🔬 MongoDB Aggregation Pipelines
Git Data relies heavily on Mongoose aggregation stages to generate statistics and dashboards dynamically:

### 1. Repository Analysis Distribution
Groups all active (non-soft-deleted) documents by repository name to return the top 20 repositories:
```javascript
Dataset.aggregate([
  { $match: { isDeleted: { $ne: true } } },
  { $group: { _id: "$metadata.repo_name", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 20 }
])
```
*Used by: GET `/api/v1/analytics/datasets/repo-analysis`*

### 2. Framework Distribution Pipeline
Classifies repositories dynamically using `$regexMatch` to check for PyTorch vs. TensorFlow markers:
```javascript
Dataset.aggregate([
  { $match: { isDeleted: { $ne: true } } },
  {
    $project: {
      framework: {
        $cond: {
          if: { $regexMatch: { input: { $ifNull: ["$metadata.repo_name", ""] }, regex: /pytorch|torch/i } },
          then: "PyTorch",
          else: {
            $cond: {
              if: { $regexMatch: { input: { $ifNull: ["$metadata.repo_name", ""] }, regex: /tensorflow|keras/i } },
              then: "TensorFlow",
              else: "Other / General"
            }
          }
        }
      }
    }
  },
  { $group: { _id: "$framework", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```
*Used by: GET `/api/v1/analytics/datasets/framework-analysis`*

### 3. File Language Classifier Pipeline
Analyses file suffix extensions (`.py`, `.md`, `.rst`) from the metadata `file_path` to build distribution stats:
```javascript
Dataset.aggregate([
  { $match: { isDeleted: { $ne: true } } },
  {
    $project: {
      language: {
        $cond: {
          if: { $regexMatch: { input: { $ifNull: ["$metadata.file_path", ""] }, regex: /\.py$/i } },
          then: "Python",
          else: {
            $cond: {
              if: { $regexMatch: { input: { $ifNull: ["$metadata.file_path", ""] }, regex: /\.md$/i } },
              then: "Markdown",
              else: {
                $cond: {
                  if: { $regexMatch: { input: { $ifNull: ["$metadata.file_path", ""] }, regex: /\.rst$/i } },
                  then: "ReStructuredText",
                  else: "Plain Text / Other"
                }
              }
            }
          }
        }
      }
    }
  },
  { $group: { _id: "$language", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```
*Used by: GET `/api/v1/analytics/datasets/language-analysis`*

---

## 📦 Dependency Overview

### Backend Dependencies
- **`express`**: Routing and HTTP request pipeline handlers.
- **`mongoose`**: Database schema declarations and aggregation query builders.
- **`dotenv`**: Environment variable loading.
- **`cors`**: Permitting Cross-Origin Resource Sharing.
- **`bcryptjs`**: Password hashing.
- **`jsonwebtoken`**: Generation and validation of auth JWT and refresh tokens.
- **`express-rate-limit`**: DDoS mitigation rate limiters.
- **`express-validator`**: Parameter parsing validations.

### Frontend Dependencies
- **`react`** & **`react-dom`**: Frontend SPA rendering logic.
- **`react-redux`** & **`@reduxjs/toolkit`**: Unified Redux state stores.
- **`react-router-dom`**: Multi-page route controller bindings.
- **`framer-motion`**: Interactive animations.
- **`lucide-react`**: Vector dashboard icon arrays.
- **`recharts`**: Rendering data charts (pie charts, bar charts, trend lines).
- **`axios`**: REST API integrations.
- **`tailwindcss`**: Styled page designs.
