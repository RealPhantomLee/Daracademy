# API Error Handling & Validation Implementation Summary

## Overview

Implemented comprehensive API error handling, input validation, and client-side data fetching improvements across Daracademy using Zod schemas and standardized response types.

## Changes Made

### 1. New Package: `@daracademy/api-schema`

Created a new shared package at `packages/api-schema/` with:

#### Files Created:

- `package.json` — Package configuration with Zod dependency
- `tsconfig.json` — TypeScript configuration
- `src/schemas.ts` — All Zod validation schemas
- `src/response.ts` — API response types and helpers
- `src/client.ts` — Client-side fetch utilities with error handling
- `src/index.ts` — Package exports
- `README.md` — Comprehensive documentation

#### Key Features:

- **15+ validation schemas** covering assignments, messages, profiles, users, sessions, payments, and file uploads
- **Standardized API responses** with success/error structure
- **Type-safe fetch utilities** (apiGet, apiPost, apiPut, apiDelete, apiUpload)
- **Built-in timeouts** (default 5000ms, configurable)
- **Error codes and HTTP status constants** for consistent error handling
- **Helper functions** for checking auth errors, permission errors, validation errors

### 2. Server-side API Route Updates

#### Updated Routes:

**`apps/student-dashboard/src/app/api/assignments/route.ts`**

- Added input validation using `assignmentCreateSchema`
- Standardized responses with `successResponse()` and `errorResponse()`
- Proper HTTP status codes for all scenarios
- Enhanced error handling with `handleApiError()`

**`apps/student-dashboard/src/app/api/messages/route.ts`**

- Added input validation using `messageCreateSchema`
- Standardized response format
- Consistent error handling

**`apps/student-dashboard/src/app/api/assignments/[id]/upload/route.ts`**

- Replaced inline validation with `fileUploadSchema`
- Improved error messages
- Standardized response structure
- Support for different file types (PDF, images, Word, Excel)

**`apps/admin-dashboard/src/app/api/students/route.ts`**

- Added input validation using `userCreateSchema`
- Better conflict detection (user already exists)
- Standardized error responses
- Proper authorization checks with error codes

#### Implementation Pattern:

```typescript
// Validate input
const validation = assignmentCreateSchema.safeParse(body);
if (!validation.success) {
  const response = validationErrorResponse(validation.error);
  return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
}

// Use validated data
const assignment = await prisma.assignment.create({
  data: validation.data,
});

// Return success
return NextResponse.json(successResponse(assignment), {
  status: HttpStatus.CREATED,
});
```

### 3. Client-side UI Updates

#### Updated Pages:

**`apps/student-dashboard/src/app/dashboard/assignments/page.tsx`**

- Switched from raw `fetch()` to `apiGet()` from api-schema package
- Added error state display with retry button
- Added loading spinner animation
- Improved error messages using `getErrorMessage()`
- Auto-redirect to login on unauthorized errors
- Proper error/loading/success state management

**`apps/student-dashboard/src/app/dashboard/messages/page.tsx`**

- Same improvements as assignments page
- Added error state display
- Better loading state
- Consistent error handling

#### Implementation Pattern:

```typescript
'use client';

import { apiGet, getErrorMessage, isAuthError } from '@daracademy/api-schema';

const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

async function fetchData() {
  setLoading(true);
  setError(null);

  const response = await apiGet<DataType>('/api/endpoint');

  if (!response.success) {
    const errorMessage = getErrorMessage(response);
    setError(errorMessage);

    if (isAuthError(response)) {
      window.location.href = '/auth/signin';
    }
    return;
  }

  setData(response.data);
  setLoading(false);
}

// Render with error/loading states
{error && <ErrorDisplay error={error} onRetry={fetchData} />}
{loading && <LoadingSpinner />}
{!error && !loading && <DataGrid data={data} />}
```

### 4. Package Dependencies Updates

Added `@daracademy/api-schema` to:

- `apps/student-dashboard/package.json`
- `apps/admin-dashboard/package.json`
- `apps/guardian-dashboard/package.json`

## Validation Schemas Available

### Core Schemas:

1. **Assignment** — `assignmentCreateSchema`, `assignmentUpdateSchema`
2. **Message** — `messageCreateSchema`, `messageMarkReadSchema`
3. **Profile** — `profileUpdateSchema`, `studentProfileUpdateSchema`, `guardianProfileUpdateSchema`
4. **File Upload** — `fileUploadSchema` (size, type validation)
5. **User Management** — `userCreateSchema`, `userUpdateSchema`
6. **Session** — `sessionCreateSchema`, `sessionUpdateSchema`
7. **Payment** — `paymentCreateSchema`
8. **Utility** — `paginationSchema`, `sortSchema`

### Example: Assignment Creation

```typescript
assignmentCreateSchema.safeParse({
  title: "Homework",
  description: "Chapter 5 exercises",
  dueDate: "2025-01-15T23:59:59Z",
  subject: "Mathematics",
  assignedToId: "student-123",
  attachmentUrl: "https://example.com/worksheet.pdf",
});
```

## API Response Format

All endpoints now return consistent JSON:

### Success Response:

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "code": "OPERATION_SUCCESS"
}
```

### Error Response:

```json
{
  "success": false,
  "error": "User-friendly error message",
  "code": "ERROR_CODE",
  "details": {
    /* validation errors or extra info */
  }
}
```

## Error Codes

- `VALIDATION_ERROR` (400) — Input validation failed
- `UNAUTHORIZED` (401) — Missing/invalid authentication
- `FORBIDDEN` (403) — User lacks permissions
- `NOT_FOUND` (404) — Resource doesn't exist
- `CONFLICT` (409) — Resource already exists
- `INTERNAL_ERROR` (500) — Server error
- `RATE_LIMIT` (429) — Too many requests
- `SERVICE_UNAVAILABLE` (503) — Service down

## Client-side Fetch Utilities

### Available Functions:

- `apiGet<T>(url, options?)` — GET request
- `apiPost<T>(url, data, options?)` — POST request
- `apiPut<T>(url, data, options?)` — PUT request
- `apiPatch<T>(url, data, options?)` — PATCH request
- `apiDelete<T>(url, options?)` — DELETE request
- `apiUpload<T>(url, formData, options?)` — File upload
- `apiFetch<T>(url, options?)` — Generic fetch with config

### Options:

```typescript
interface FetchOptions extends RequestInit {
  timeout?: number; // default 5000ms
}
```

### Error Helpers:

- `getErrorMessage(response)` — Get user-friendly error message
- `isAuthError(response)` — Check if unauthorized
- `isPermissionError(response)` — Check if forbidden
- `isValidationError(response)` — Check if validation failed

## Type Safety

All schemas export TypeScript types:

```typescript
import type { assignmentCreateSchema } from "@daracademy/api-schema";
type AssignmentCreate = z.infer<typeof assignmentCreateSchema>;
```

## Best Practices Implemented

1. **Always validate server-side** — No invalid data reaches the database
2. **Consistent error format** — All endpoints return same structure
3. **Timeout protection** — Default 5s timeout prevents hanging requests
4. **Auth error handling** — Auto-redirect to login on 401
5. **User feedback** — Error messages are clear and actionable
6. **Type safety** — Full TypeScript support throughout
7. **Logging** — Detailed error logging for debugging

## Testing Validation

```typescript
// Valid data
const result = assignmentCreateSchema.safeParse({
  title: "Homework",
  subject: "Math",
  dueDate: "2025-01-15T00:00:00Z",
  assignedToId: "student-123",
});

if (result.success) {
  console.log("Valid:", result.data);
} else {
  console.log("Errors:", result.error.errors);
  // [{ path: ['title'], message: 'Title required', ... }]
}
```

## Next Steps

1. **Extend to more API routes** — Apply pattern to remaining endpoints
2. **Add request/response middleware** — Centralize logging/monitoring
3. **Implement rate limiting** — Protect endpoints from abuse
4. **Add API documentation** — Generate OpenAPI spec from schemas
5. **Setup E2E tests** — Test full request/response flows
6. **Monitor error rates** — Track validation failures and server errors

## Files Modified

### New Files:

- `packages/api-schema/package.json`
- `packages/api-schema/tsconfig.json`
- `packages/api-schema/src/schemas.ts`
- `packages/api-schema/src/response.ts`
- `packages/api-schema/src/client.ts`
- `packages/api-schema/src/index.ts`
- `packages/api-schema/README.md`

### Modified API Routes:

- `apps/student-dashboard/src/app/api/assignments/route.ts`
- `apps/student-dashboard/src/app/api/messages/route.ts`
- `apps/student-dashboard/src/app/api/assignments/[id]/upload/route.ts`
- `apps/admin-dashboard/src/app/api/students/route.ts`

### Modified UI Pages:

- `apps/student-dashboard/src/app/dashboard/assignments/page.tsx`
- `apps/student-dashboard/src/app/dashboard/messages/page.tsx`

### Updated Dependencies:

- `apps/student-dashboard/package.json`
- `apps/admin-dashboard/package.json`
- `apps/guardian-dashboard/package.json`

## Verification

- TypeScript compilation: ✓ `pnpm --filter @daracademy/api-schema build`
- Student dashboard: ✓ `pnpm --filter @daracademy/student-dashboard typecheck`
- All imports resolved correctly
- No type errors in updated routes
