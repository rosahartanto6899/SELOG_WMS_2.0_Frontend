# SELOG Logistics Frontend - AI Copilot Instructions

## Project Overview

Next.js 14 + React 18 + TypeScript + Redux Toolkit + Ant Design 5 logistics management frontend. Multi-service architecture with microservices communication, real-time tracking (Leaflet maps), and complex form handling.

**Key Stack**: Next.js, Redux Saga, Ant Design (Antd), TypeScript, i18next internationalization

---

## Architecture Patterns

### Path Aliases (`tsconfig.json`)

All imports use `@sera-*` prefix for clean code:

```typescript
@sera-components/*   → ./components/*
@sera-libraries/*    → ./libraries/*
@sera-redux/*        → ./redux/*
@sera-types/*        → ./types/*
@sera-utils/*        → ./utils/*
@sera-assets/*       → ./assets/*
@sera-locale/*       → ./locale/*
```

Always prefer aliases over relative paths.

### Redux State Management

**Architecture**: Redux Toolkit + Redux Saga middleware + next-redux-wrapper

- **Store**: `redux/store.ts` - configures saga middleware, logger (non-prod), OpenReplay
- **Slices**: Redux Toolkit slices in `redux/slices/` - define state, reducers, actions
- **Sagas**: `redux/sagas/` - handle side effects (API calls, async operations)
- **Usage**: Always use typed hooks `useAppDispatch()` and `useAppSelector()` from `@sera-redux`

```typescript
// Correct pattern
import { useAppDispatch, useAppSelector } from "@sera-redux";
const dispatch = useAppDispatch();
const { data } = useAppSelector((state) => state.yourSlice);
```

### API Layer Pattern

Located in `libraries/api/{feature}/` - each feature has dedicated API client:

- **File**: `libraries/api/customer-location/index.ts` (factory function returns API methods)
- **HTTP Service**: `libraries/http-service/index.ts` - axios wrapper with interceptors, retry logic, token refresh
- **API URLs**: `libraries/common/api-url.ts` - centralized endpoints (user, master, order, vehicle services)
- **Payload Types**: Defined in `types/{feature}.type.ts`

```typescript
// API client pattern (libraries/api/customer-location/index.ts)
const CustomerLocationApi = () => ({
  retrieveCustomerLocations: (payload) =>
    httpService.get(url, { params: payload }),
  createCustomerLocation: (payload) => httpService.post(url, payload),
  updateCustomerLocation: (payload) => httpService.put(url, data),
  deleteCustomerLocation: (id) => httpService.del(url),
});
```

### Component Structure

**Page Layout**: `pages/{feature}/*.tsx` → `components/pages/{feature}/*.tsx`

- **Naming**: `{feature}-initial-page.tsx` (list view), `{feature}-form.tsx` (CRUD form), `{feature}-detail.tsx` (read-only)
- **Forms**: Always use Ant Design Form with `FormInstance` prop
- **Redux Connection**: Pages dispatch sagas, forms read/update state via Redux hooks

### Form Handling (Ant Design)

```typescript
import { Form, Input, Button, Row, Col, Select } from 'antd';

const YourForm = ({ form, type }) => (
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    <Form.Item name="field" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </Form>
);
```

---

## Development Workflows

### Local Setup

```bash
npm install
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint check
npm test             # Jest unit tests
npm run test:watch   # Watch mode
npm run test:staged  # Pre-commit tests (bail on first failure)
npm run scan-sonar   # SonarQube code quality scan
```

### Testing

- **Test Framework**: Jest + React Testing Library
- **Test Locations**: Collocated as `__specs__/` folders (e.g., `components/__specs__/`)
- **Pre-commit**: `lint-staged` runs `jest --bail --findRelatedTests` on staged files
- **Config**: `jest.config.js`, `jest.setup.js` - coverage collection enabled

### Git Hooks & Linting

- **Husky**: Pre-commit hooks configured in `lint-staged.config.js`
- **ESLint**: TypeScript plugin, strict mode enabled
- **Formatting**: Prettier (implicit via lint-staged)

---

## Critical Patterns & Conventions

### State Slicing (Redux)

- **Slices**: One slice per feature in `redux/slices/` - use Redux Toolkit `createSlice()`
- **Naming**: Slice name should match feature (e.g., `customerLocationSlice`)
- **Load States**: Always include `loading`, `error`, `data` states for async operations

### Saga Pattern

- **Sagas**: Root saga in `redux/sagas/index.ts` combines all feature sagas
- **Pattern**: `takeEvery(ACTION_TYPE, sagaFunction)` for API calls
- **Error Handling**: Use `ErrorMessageHandler` from `@sera-libraries/error`

### Type Safety

- **Feature Types**: All API payloads typed in `types/{feature}.type.ts`
- **Type Examples**:
  ```typescript
  // types/customer-location.type.ts
  export interface CreateNewCustomerLocationPayload {
    name: string;
    coordinate: string; // "lat,lng" format
    province: string;
    area: string;
    city: string;
    district: string;
    address: string;
    customerId: string;
    operationDays: OperationDay[];
  }
  export interface OperationDay {
    day: string;
    isOpened: 0 | 1;
    openedHour: string; // "HH:MM:SS" format
    closedHour: string;
  }
  ```

### Internationalization (i18next)

- **Config**: `locale/i18n.ts`
- **Usage**: `useTranslation()` hook in components
- **Namespaces**: Separate JSON files per feature in `locale/{lang}/`

### Environment Variables

- **Pattern**: Encrypted via `decryptData()` utility from `@sera-utils/encryptor`
- **Keys**: API*BASE_URL, SERVICE*\* (user, master, order, vehicle), X_API_KEY, CLARITY_PROJECT_ID, STAGE
- **Access**: `decryptData(process.env.VAR_NAME)`

### HTTP Interceptors

- **httpService** handles:
  - Request: Adds `x-api-key` header, auth tokens
  - Response: Auto-retry on failure (max 3 retries, 1s delay)
  - Error: Uses `ErrorMessageHandler` to display user-friendly messages
  - Token Refresh: `RefreshTokenHandler` middleware for session management

### Authentication

- **Provider**: NextAuth.js with `SessionProvider`
- **Context**: `NextAuthProvider` (protected), `NextAuthProviderUnprotected` (auth pages)
- **Routing**: Pages with `auth/` prefix are unprotected; others require session

---

## File Organization

```
components/pages/{feature}/
  ├── {feature}-initial-page.tsx      # List/dashboard view
  ├── {feature}-form.tsx              # Create/update form
  ├── {feature}-detail.tsx            # Detail view (optional)
  └── __specs__/                      # Unit tests
libraries/api/{feature}/
  └── index.ts                        # API client factory
types/{feature}.type.ts               # All TypeScript interfaces
redux/slices/{feature}.ts             # State + reducers
redux/sagas/{feature}.ts              # Async logic
```

---

## Common Gotchas & Best Practices

1. **Always use `@sera-*` path aliases** - never relative paths
2. **Form Values**: Extract operationDays separately from form.getFieldsValue() - manage in component state
3. **Time Inputs**: Store as "HH:MM:SS", convert HTML time inputs (HH:MM) with `.substring(0, 5)`
4. **Coordinate Format**: Must be "latitude,longitude" (comma-separated, no spaces)
5. **Custom IDs**: UUID string format, often nullable except when `type === 'Customer Location'`
6. **Responsive Grids**: Use `<Row gutter={[16, 16]}><Col xs={24} sm={12}/>` for mobile-first
7. **Ant Design versions**: Currently v5.21.6 - check [docs.ant.design](https://ant.design) for v5 APIs
8. **Error Messages**: Let `httpService` handle - avoid custom try-catch unless specific business logic
9. **Loading States**: Redux slice should track `loading: true` during saga execution
10. **Component Props**: Pass `form: FormInstance` and `type: 'create'|'update'` to form components

---

## When Extending the Codebase

**Adding a New Feature Page**:

1. Create type file: `types/new-feature.type.ts`
2. Create API client: `libraries/api/new-feature/index.ts`
3. Create Redux slice: `redux/slices/new-feature.ts`
4. Create Redux saga: `redux/sagas/new-feature.ts`
5. Update root saga: `redux/sagas/index.ts` (add `fork()`)
6. Create page components: `components/pages/{section}/new-feature/{initial-page,form}.tsx`

**Form Best Practices**:

- Use Ant Design Form with vertical layout
- Type payload interfaces matching API expectations
- Manage complex nested state (like operationDays) in component state, not form
- Disable fields conditionally (e.g., time inputs when checkbox unchecked)
- Always include validation rules for required fields

---

## Debugging Tips

- **Redux State**: Check `redux/store.ts` - `logger` middleware enabled in non-prod (view console)
- **Network**: httpService logs requests/responses; check Network tab for retry behavior
- **Type Errors**: Ensure payload types match API contract - check `types/{feature}.type.ts`
- **Saga Errors**: Redux logger shows action dispatch flow; use `ReduxDevTools` browser extension
- **Build Issues**: Run `npm run lint` first - catch TypeScript errors before build

---

## External Resources

- [Ant Design 5 Components](https://ant.design/components/overview/) - form, table, select, modal, etc.
- [Redux Toolkit Docs](https://redux-toolkit.js.org/) - createSlice, useSelector, useDispatch
- [Redux Saga Patterns](https://redux-saga.js.org/docs/api/) - takeEvery, call, put, select
- [Next.js 14 App Structure](https://nextjs.org/docs/pages) - file-based routing, API routes
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - type safety, interfaces
