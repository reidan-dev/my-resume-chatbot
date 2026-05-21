# API Security Guide

This document explains the security layers in place to prevent API cost abuse, and the steps to configure the external hard stop on the OpenAI dashboard.

---

## OpenAI Dashboard — Hard Stop (Do This First)

This is the most important protection. It lives outside your code entirely, so it catches everything — including bugs, misconfigurations, or layers that fail.

1. Go to [platform.openai.com](https://platform.openai.com) → **Billing** → **Limits**
2. Set a **Hard limit** — OpenAI will reject all API calls once this amount is reached for the month
3. Recommended starting value: **$5/month**
4. Optionally set a **Soft limit** (e.g. $2) to receive an email warning before the hard stop kicks in

> At normal portfolio traffic (100–300 visitors), you will never come close to $5. This limit is purely a safety net for abuse or mistakes.

---

## In-App Security Layers

Three layers are enforced on every `/chat` request, in this order:

```
Request → [Layer 1: Input Guard] → [Layer 2: Rate Limiter] → [Layer 3: Global Daily Cap] → LLM
```

### Layer 1 — Input Guard (`middleware/input_guard.py`)

Runs before any API call is made. Rejects the request immediately if:

- **Message is empty**
- **Message exceeds `MAX_MESSAGE_LENGTH`** (default: 300 characters)
  — prevents oversized prompts that consume more tokens
- **Message contains prompt injection patterns** — blocks phrases like:
  - `ignore previous instructions`
  - `you are now`
  - `jailbreak`, `dan mode`, `developer mode`
  - `system prompt`, `override your instructions`
  - and others

Returns `HTTP 400` on violation. No API call is made.

### Layer 2 — Per-IP Rate Limiting (`middleware/rate_limiter.py`)

Two sub-limits applied per IP address:

| Sub-limit | Default | Purpose |
|-----------|---------|---------|
| Burst limit | 3 questions / minute | Stops rapid-fire bot requests |
| Window limit | 5 questions / 3 days | Stops sustained abuse from one IP |

Returns `HTTP 429` when either limit is exceeded.

**IP spoofing protection:** The IP is read from the last entry in `X-Forwarded-For`, which is the value injected by Railway's proxy — not the client-claimed value. This prevents attackers from spoofing a different IP via the header.

### Layer 3 — Global Daily Cap (`middleware/global_cap.py`)

A hard counter shared across all users. Once the total number of questions for the day hits `GLOBAL_DAILY_LIMIT` (default: 100), all `/chat` requests return `HTTP 503` until midnight UTC.

This is the backstop that protects against:
- VPN rotation bypassing per-IP limits
- Distributed bot attacks from many IPs
- Any scenario where Layers 1 and 2 are bypassed

At 100 questions/day with `gpt-4o-mini`, the maximum possible daily API cost is **~$0.10 (≈ ₱6)**.

**Note:** The global counter is in-memory and resets on process restart. Railway redeploys reset it. The OpenAI dashboard hard limit is the true backstop for this edge case.

### LLM Response Cap

`LLM_MAX_TOKENS` (default: 500) is set on every LLM call. This caps the length of each response and bounds the output cost per request regardless of what the LLM would otherwise generate.

---

## Environment Variables

Configure these in Railway (or your `.env` locally):

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_MESSAGE_LENGTH` | `300` | Layer 1: max characters per message |
| `BURST_LIMIT` | `3` | Layer 2: max questions per IP per minute |
| `RATE_LIMIT_QUESTIONS` | `5` | Layer 2: max questions per IP per window |
| `RATE_LIMIT_WINDOW_DAYS` | `3` | Layer 2: window length in days |
| `GLOBAL_DAILY_LIMIT` | `100` | Layer 3: max total questions per day |
| `LLM_MAX_TOKENS` | `500` | Max tokens per LLM response |

---

## Worst-Case Cost Analysis

Even if all in-app layers fail simultaneously:

| Scenario | Questions | Cost (USD) | Cost (PHP) |
|----------|-----------|------------|------------|
| Global cap holds | 100/day × 30 days | ~$3.00 | ~₱168 |
| OpenAI hard limit ($5) | — | $5.00 max | ~₱280 max |

The OpenAI hard limit is the absolute ceiling regardless of what happens in the application.

---

## Known Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| In-memory counters reset on redeploy | Global cap resets on each Railway deploy | OpenAI hard limit is the fallback |
| CORS does not block direct API calls | Anyone using `curl` or Postman bypasses CORS | Per-IP and global cap still apply |
| Global cap does not persist across restarts | Multiple restarts in one day multiply the cap | OpenAI hard limit is the fallback |
| VPN rotation can bypass per-IP limits | Attacker uses many IPs | Global daily cap catches this |
