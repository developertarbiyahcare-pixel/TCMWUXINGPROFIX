# Security Specification

## Data Invariants
1. **Identity Integrity**: All documents must be linked to a valid User ID via `authorUid` or as the document ID itself.
2. **Relational Sync**: Patient records must belong to the user who created them.
3. **Temporal Integrity**: All writes must use server-side timestamps (`request.time`).
4. **Schema Enforcement**: Every document must strictly follow the defined schema in `firebase-blueprint.json`.

## The "Dirty Dozen" Payloads

### 1. Identity Spoofing (User)
*   **Payload**: `{ uid: "someone-else-uid", username: "hacker", role: "ADMIN", createdAt: 1625097600000 }`
*   **Attack**: Attempting to create a user profile for another person.
*   **Expected**: `PERMISSION_DENIED` (ID must match `request.auth.uid`).

### 2. Privilege Escalation
*   **Payload**: `{ username: "user", role: "SUPER_SAINT" }` (Update)
*   **Attack**: Attempting to change own role to a higher privilege level.
*   **Expected**: `PERMISSION_DENIED` (Role field must be immutable on update or restricted).

### 3. Identity Spoofing (Patient)
*   **Payload**: `{ id: "p1", patientName: "John", authorUid: "victim-uid" }`
*   **Attack**: Creating a patient record and assigning it to another user.
*   **Expected**: `PERMISSION_DENIED` (`authorUid` must be `request.auth.uid`).

### 4. Ownership Theft
*   **Payload**: `{ authorUid: "hacker-uid" }` (Update)
*   **Attack**: Attempting to transfer ownership of a patient record to self.
*   **Expected**: `PERMISSION_DENIED` (`authorUid` is immutable).

### 5. Ghost Field Injection
*   **Payload**: `{ id: "p1", patientName: "John", authorUid: "uid", is_premium: true }`
*   **Attack**: Injecting undocumented fields to bypass future logic or gain access.
*   **Expected**: `PERMISSION_DENIED` (Strict key size check).

### 6. Query Scraper
*   **Request**: `db.collection('patients').get()` (No filters)
*   **Attack**: Attempting to read all patients in the system.
*   **Expected**: `PERMISSION_DENIED` (Rule must enforce `resource.data.authorUid == request.auth.uid`).

### 7. Resource Poisoning (Denial of Wallet)
*   **Payload**: `{ patientName: "A".repeat(100000) }`
*   **Attack**: Storing massive strings to inflate storage costs.
*   **Expected**: `PERMISSION_DENIED` (Size constraints on all string fields).

### 8. ID Poisoning
*   **Path**: `/patients/path%2Fto%2Fsecret`
*   **Attack**: Using complex strings as document IDs.
*   **Expected**: `PERMISSION_DENIED` (`isValidId()` check).

### 9. Type Mismatch
*   **Payload**: `{ age: "Twenty" }`
*   **Attack**: Corrupting data by sending wrong types.
*   **Expected**: `PERMISSION_DENIED` (`is number` check).

### 10. Temporal Corruption
*   **Payload**: `{ createdAt: 100000, updatedAt: 100000 }`
*   **Attack**: Setting past or future timestamps manually.
*   **Expected**: `PERMISSION_DENIED` (Must use `request.time`).

### 11. Anonymous Data Leak
*   **Request**: Read user profile while not signed in.
*   **Expected**: `PERMISSION_DENIED` (`isAuthenticated()` check).

### 12. Cross-User Update
*   **Request**: User B tries to update User A's patient record.
*   **Expected**: `PERMISSION_DENIED` (Author check).

## The Test Runner
See `firestore.rules.test.ts` (Implementation pending rules finalization).
