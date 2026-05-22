# @daracademy/api-schema

Validation schemas, API response types, and client-side fetch utilities for Daracademy.

## Features

- **Zod validation schemas** for all API inputs (assignments, messages, profiles, etc.)
- **Standardized API responses** with consistent success/error structure
- **Client-side fetch utilities** with timeout and error handling
- **Type-safe error handling** with specific error codes
- **HTTP status code constants** for consistent responses

## Usage

### Server-side: Validating API Input

```typescript
import {
  assignmentCreateSchema,
  successResponse,
  errorResponse,
  validationErrorResponse,
  ErrorCodes,
  HttpStatus,
} from "@daracademy/api-schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = assignmentCreateSchema.safeParse(body);
    if (!validation.success) {
      const response = validationErrorResponse(validation.error);
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // Process validated data
    const { title, subject, dueDate, assignedToId } = validation.data;

    // Return success
    const response = successResponse({ id: "123", ...validation.data });
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    const response = errorResponse(
      "Failed to create assignment",
      ErrorCodes.INTERNAL_ERROR,
    );
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_ERROR });
  }
}
```

### Client-side: Fetching with Error Handling

```typescript
'use client';

import { apiGet, getErrorMessage, isAuthError } from '@daracademy/api-schema';
import type { ApiResponse } from '@daracademy/api-schema';
import { useState, useEffect } from 'react';

interface Assignment {
  id: string;
  title: string;
  // ...
}

export function AssignmentsList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    setError(null);

    const response = await apiGet<Assignment[]>('/api/assignments');

    if (!response.success) {
      const errorMessage = getErrorMessage(response);
      setError(errorMessage);

      if (isAuthError(response)) {
        window.location.href = '/auth/signin';
      }
      return;
    }

    setAssignments(response.data);
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {assignments.map((a) => (
        <div key={a.id}>{a.title}</div>
      ))}
    </div>
  );
}
```

### POST/PUT/PATCH Requests

```typescript
import { apiPost, getErrorMessage } from "@daracademy/api-schema";

// POST
const createResponse = await apiPost("/api/assignments", {
  title: "Homework",
  subject: "Math",
  dueDate: "2025-01-15T00:00:00Z",
  assignedToId: "student-123",
});

if (!createResponse.success) {
  console.error(getErrorMessage(createResponse));
  return;
}

console.log(createResponse.data); // { id: '...', title: 'Homework', ... }
```

### File Upload

```typescript
import { apiUpload, getErrorMessage } from "@daracademy/api-schema";

async function handleFileUpload(file: File, assignmentId: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiUpload(
    `/api/assignments/${assignmentId}/upload`,
    formData,
  );

  if (!response.success) {
    console.error(getErrorMessage(response));
    return;
  }

  console.log("File uploaded:", response.data);
}
```

### Custom Timeouts

```typescript
import { apiGet } from "@daracademy/api-schema";

// Default timeout is 5000ms
const response = await apiGet("/api/assignments");

// Custom timeout
const response = await apiGet("/api/heavy-operation", { timeout: 30000 });
```

## Available Schemas

### Assignment Schemas

```typescript
import {
  assignmentCreateSchema,
  assignmentUpdateSchema,
} from "@daracademy/api-schema";

// assignmentCreateSchema validates:
// - title: string (required, 1-255 chars)
// - subject: string (required, 1-100 chars)
// - dueDate: ISO 8601 datetime string
// - description: string (optional, max 5000 chars)
// - assignedToId: string (required)
// - attachmentUrl: URL (optional)

// assignmentUpdateSchema: all fields optional
```

### Message Schemas

```typescript
import { messageCreateSchema } from "@daracademy/api-schema";

// Validates:
// - content: string (required, 1-5000 chars)
// - receiverId: string (required)
// - threadId: string (optional)
```

### Profile Schemas

```typescript
import {
  profileUpdateSchema,
  studentProfileUpdateSchema,
  guardianProfileUpdateSchema,
} from "@daracademy/api-schema";

// profileUpdateSchema: common fields (name, email, gradeLevel, subjects, image)
// studentProfileUpdateSchema: extends with guardianId
// guardianProfileUpdateSchema: extends with phone
```

### File Upload Schema

```typescript
import { fileUploadSchema } from "@daracademy/api-schema";

// Validates:
// - file: File (required)
// - size: max 10MB
// - type: PDF, images (JPEG/PNG), text, Word, Excel
```

### User Management Schemas

```typescript
import { userCreateSchema, userUpdateSchema } from "@daracademy/api-schema";

// userCreateSchema: for admins creating users
// - email: valid email
// - password: min 8 chars
// - name: required
// - role: STUDENT, TUTOR, GUARDIAN, ADMIN
// - gradeLevel: 1-12 (optional)
// - subjects: array (optional)
// - phone: valid E.164 format (optional)

// userUpdateSchema: all fields optional
```

### Session & Payment Schemas

```typescript
import {
  sessionCreateSchema,
  sessionUpdateSchema,
  paymentCreateSchema,
} from "@daracademy/api-schema";
```

## API Response Format

All responses follow this structure:

```typescript
// Success
{
  success: true,
  data: { /* your data */ },
  code?: 'OPERATION_SUCCESS'
}

// Error
{
  success: false,
  error: 'User-friendly error message',
  code: 'ERROR_CODE',
  details?: { /* validation errors or additional info */ }
}
```

## Error Codes

```typescript
ErrorCodes.VALIDATION_ERROR; // 400 Bad Request
ErrorCodes.UNAUTHORIZED; // 401 Unauthorized
ErrorCodes.FORBIDDEN; // 403 Forbidden
ErrorCodes.NOT_FOUND; // 404 Not Found
ErrorCodes.CONFLICT; // 409 Conflict
ErrorCodes.INTERNAL_ERROR; // 500 Internal Server Error
ErrorCodes.RATE_LIMIT; // 429 Too Many Requests
ErrorCodes.SERVICE_UNAVAILABLE; // 503 Service Unavailable
```

## HTTP Status Constants

```typescript
HttpStatus.OK; // 200
HttpStatus.CREATED; // 201
HttpStatus.BAD_REQUEST; // 400
HttpStatus.UNAUTHORIZED; // 401
HttpStatus.FORBIDDEN; // 403
HttpStatus.NOT_FOUND; // 404
HttpStatus.CONFLICT; // 409
HttpStatus.INTERNAL_ERROR; // 500
HttpStatus.SERVICE_UNAVAILABLE; // 503
```

## Type Helpers

```typescript
import {
  getErrorMessage,
  isAuthError,
  isPermissionError,
  isValidationError,
} from "@daracademy/api-schema";

const response = await apiGet("/api/something");

if (!response.success) {
  // Get user-friendly error message
  const message = getErrorMessage(response);

  // Check specific error types
  if (isAuthError(response)) {
    // Redirect to login
  } else if (isPermissionError(response)) {
    // Show permission denied
  } else if (isValidationError(response)) {
    // Show validation errors
  }
}
```

## Best Practices

1. **Always use validation on the server**

   ```typescript
   const validation = assignmentCreateSchema.safeParse(body);
   if (!validation.success) {
     return NextResponse.json(validationErrorResponse(validation.error), {
       status: HttpStatus.BAD_REQUEST,
     });
   }
   ```

2. **Handle errors on the client**

   ```typescript
   const response = await apiGet("/api/data");
   if (!response.success) {
     setError(getErrorMessage(response));
     return;
   }
   setData(response.data);
   ```

3. **Use specific error codes for logging/monitoring**

   ```typescript
   console.error(`API error [${response.code}]: ${response.error}`);
   ```

4. **Catch auth errors early**

   ```typescript
   if (isAuthError(response)) {
     // Clear user session and redirect
     window.location.href = "/auth/signin";
   }
   ```

5. **Set appropriate timeouts for slow operations**
   ```typescript
   const response = await apiPost("/api/expensive-operation", data, {
     timeout: 30000, // 30 seconds for slow operations
   });
   ```

## Testing

Validation schemas can be tested directly:

```typescript
import { assignmentCreateSchema } from "@daracademy/api-schema";

// Valid data
const valid = assignmentCreateSchema.safeParse({
  title: "Homework",
  subject: "Math",
  dueDate: "2025-01-15T00:00:00Z",
  assignedToId: "student-123",
});

expect(valid.success).toBe(true);

// Invalid data
const invalid = assignmentCreateSchema.safeParse({
  title: "", // Required, not empty
  subject: "Math",
  dueDate: "invalid-date",
  assignedToId: "student-123",
});

expect(invalid.success).toBe(false);
expect(invalid.error.errors).toContainEqual(
  expect.objectContaining({ path: ["title"] }),
);
```
