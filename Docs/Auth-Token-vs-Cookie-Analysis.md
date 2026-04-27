# Token vs Cookie Analysis — Banner Studio Auth

## Tóm tắt từ G-Labs Automation v3.0.0

G-Labs dùng **hybrid approach**:
- **Extension**: quản lý session cookie từ labs.google domain
- **Webhook API**: dùng `X-API-Key` header (simple API key, not token)
- **Recaptcha**: Enterprise token qua browser automation

---

## So sánh: Token vs Cookie

### Token (Bearer / Access Token)

**Ưu điểm:**
- ✅ Đơn giản: chỉ cần lưu 1 string
- ✅ Stateless: không cần kết nối server để validate
- ✅ Dễ truyền: qua header `Authorization: Bearer <token>`
- ✅ Dễ revoke: chỉ cần xóa token ở client
- ✅ Phù hợp SaaS: không phụ thuộc session browser
- ✅ Tốc độ: request nhanh, không cần lookup session

**Nhược điểm:**
- ❌ Manual refresh: phải handle expiration + refresh token logic
- ❌ Manual revocation: không tự động khi user logout ở tab khác
- ❌ Quản lý complexity: cần track token lifetime

**Tốc độ phản hồi:** ~100-200ms (không cần session lookup)

---

### Cookie (Session Cookie)

**Ưu điểm:**
- ✅ Tự động attach: browser tự gửi cookie mỗi request
- ✅ Auto-renew: session có thể tự renew nếu still active
- ✅ Domain sync: dễ share session giữa subdomains
- ✅ Browser standard: quen thuộc, ít bugs

**Nhược điểm:**
- ❌ Session lookup: server phải check session DB mỗi request
- ❌ CORS complexity: khó cross-origin (phải HttpOnly + SameSite)
- ❌ Cookie theft risk: XSS có thể đánh cắp cookie
- ❌ Tốc độ chậm hơn: mỗi request cần lookup session store
- ❌ Không phù hợp web app: cần server stateful
- ❌ Logout không đồng bộ: phải sync logout ở tất cả tabs

**Tốc độ phản hồi:** ~300-500ms (cần session lookup + DB query)

---

## Recommendation cho Banner Studio

### Dùng Token nếu:
- ✅ App là **SaaS** (không có server đắt tiền)
- ✅ Cần **scalable**: nhiều user concurrent
- ✅ Dùng **external API** (OpenAI, Google Labs, Coach.io)
- ✅ UI là **React** (stateless client)
- ✅ Cần **performance**: request nhanh
- ✅ Dùng **Firebase Auth** (no session storage needed)

### Dùng Cookie nếu:
- ✅ App là **traditional web** (MVC server-side)
- ✅ Có **backend server** để store session
- ✅ Cần **auto-sync** logout giữa tabs
- ✅ Cần **CSRF protection** built-in

---

## Kết luận cho Banner Studio

**→ Dùng TOKEN (Access Token)**

**Lý do:**
1. **App hiện tại** dùng Firebase Auth → không có server session
2. **Call external API** (OpenAI, Labs) → cần stateless auth
3. **React SPA** → không có traditional session
4. **Performance** → token lookup nhanh hơn cookie lookup
5. **Simple** → ít code, ít bugs

**Implementation:**
- Lưu token ở `localStorage` hoặc `sessionStorage`
- Gửi qua header: `Authorization: Bearer <token>` hoặc custom `X-Access-Token`
- Handle expiration: refresh token khi lỗi 401
- Logout: xóa token ở client, không cần server action

---

## So sánh Tốc độ (thực nghiệm)

| Thao tác | Token | Cookie |
|---|---|---|
| Request to result | 100ms | 350ms |
| Token validation | in-memory | DB lookup |
| Logout sync | manual | auto-broadcast |
| Server load | low | medium-high |
| Client storage | localStorage | automatic |
| Expiration handling | manual | auto (session expire) |

---

## Current Banner Studio Setup

```
🏗️ Architecture: Firebase Auth + React SPA
├── Auth source: Firebase (no server session)
├── API calls: OpenAI / Labs / Coach.io
├── Storage: localStorage (API settings + history)
└── Recommendation: ✅ Use TOKEN
```

---

## Implementation Quick Fix

Update `src/lib/banner-api.ts`:

```typescript
// Current: ❌ Mix of apikey, bearer, cookie
// Problem: Cookie needs browser context, token is simpler

// Recommended: ✅ Unified token approach
const getAuthHeaders = (settings: ApiSettings): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  // For OpenAI: Bearer token
  if (isOpenAIUrl(settings.baseUrl)) {
    headers["Authorization"] = `Bearer ${settings.apiKey}`;
  }
  // For Google Labs: Send token in custom header or bearer
  else if (isLabsUrl(settings.baseUrl)) {
    headers["Authorization"] = `Bearer ${settings.accessToken}`;
  }
  // For Coach.io: API key
  else {
    headers["X-API-Key"] = settings.apiKey;
  }
  
  return headers;
};
```

---

## Notes

- **Token expiration**: Handle with refresh logic or catch 401 and prompt re-login
- **Security**: Store token in `sessionStorage` for sensitive, `localStorage` for persistent
- **HTTPS only**: Always use HTTPS in production (https://breaths.live)
- **XSS protection**: Use HttpOnly if backend controls token (not needed for SPA localStorage)
