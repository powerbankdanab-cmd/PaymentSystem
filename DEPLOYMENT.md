# Danab Multi-Station Deployment Guide

## Your Current Stations

You have **5 stations** that will be served from one deployment:

| Station # | Name | IMEI | Custom Domain |
|-----------|------|------|---------------|
| 58 | Castello Taleex | WSEP161721195358 | station58.danab.com |
| 59 | Castello Boondhere | WSEP161741066502 | station59.danab.com |
| 60 | Java Taleex | WSEP161741066503 | station60.danab.com |
| 61 | Java Airport | WSEP161741066504 | station61.danab.com |
| 62 | Dilek Somalia | WSEP161741066505 | station62.danab.com |

## Step-by-Step Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
cd c:\Users\Abdifth\Desktop\nexjsmovement\DanabN
vercel deploy --prod
```

### 2. Add Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

#### Firebase
```
FIREBASE_CREDENTIALS_B64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZGFuYWItcHJvamVjdCIsCiAgInByaXZhdGVfa2V5X2lkIjogIjAzMDJhMjVmN2E0NGI0N2UyYzIwZDI0NzE3MDgzODg0OGM0NWI1ZWEiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRQ3ozYUVaYmxvNHpnKzlcbkUyTEMyVi9TanFCTXJ4TjZQNFpqLzlVeHorWnowbzF5Y213R3ZFSEpvSE1sQldUaEh5Wm9ab2dYZThod0lNWVFcbmdHSEFCNjZIZDhOMkNueUVYVFR6bm1UOUNhMXliMFdjekFkL0s1eDdTcVo1NGoyZDZqd0k4dkNIdk1SQWsrRTlcbmRMSENURVduL3Z3Zy9KVFp5RzhwMDBWQ1QwUjlzd3p0R0RrMmZxVGNxTFNJTFd3U0NxYVJkc3lWbW9pZ0FUY0tcblYycHhOSFZ1UHUyVjVwTWkwcmF2S0JMc09Oc1MyUVByUStvcTNUMTh4bmttVEVra2pKRDdCMnM4QUszMGZGT3VcbmlFdDlKVkRCbEFJWUx5RGxvUjBjazU5bS9aejBocFpnUy9jeGh0Q2dtRnp6R2theVYwSTg1U1pscUtETE5hTGxcblp1bVZrQUJIQWdNQkFBRUNnZ0VBQ3hFVGpNZ0Z2eGNCVURzMWRCTUIycWV4NUpDbEhId2Zjd21ycVd2eG5GQytcbmZwQ0hFRnhjUStGSkZHUmlQTzVqWTVXNHdUdk8xNjlSNEhRTEQ2WCtycnZIWFZKRWhRbTRiS3VONm5wczlKYzBcbndQS3JjaFNuTDgxN3RCREtoUmFEYVIyTUtuTTFOQVZQOGkyNjZOOHoyS1A2Q1dHTHhiYVh1R0FWRTlaaXVzVVlcbnRqMnYycTZYUDVJb0d0dHoyajIycVZ3dVZOcHFmNUFhVGxJdVJaNGIvOWE2NE9mOUdIUlRSbFJ5ZG82MkZpQUVcbnl3MU1LbHhmcG5YYXBmTWlCQW9VVUdnYTlNL29ENW4reWI1YW5VQWRjYkVPSlpzbUh6a1BiQ05aZ0FZY2RiOEVcblIyT3hCelhhTmVTdjFuTGUyckxPUlY5NUMyWnc2OUp1UGVvd3VMYWxDUUtCZ1FEbE5HcG1UekZCWVhKUzJsNDlcbmttSGxNYjJTYUtVRm5JTVZOWjNEcHh1RHNlMkdRU1lYdnkwZjlNZnBHMzhCTEdFaUMzNk80c0d6ODViVEJLRWxcblN2OURLcVFidjlhSUtMNEJBT3dnSHRXSU9sK0lEK216bTJsNmRFZzF6dTZuNkpQc0VWc2Z4b3dkS3dIdVRBZTVcbklFZVpUUXpOL1E4aFd5N0ZCUlJWanNVOTR3S0JnUURJNUp1VGI0Ukp0MitLVDBOaGhPbncrLzdwdkZRSzRITy9cbjh5QXFqdno0alp2ZTFocW5nWEFRd0J0cmxsN2ExMy80dENaVVYwbjgzQkZoU0MwMG50enFSelZvV3g0dGg3bHVcblQ3OFFmd3V6MS8zenB2Z3VSQ2RCMDlHVlJUWXV1UkUrUDhwYzlVTGIybVBacnN0SHlKakZyMkZDaU8wR3EwSkRcbjRLMFI3VStCVFFLQmdRQ3RGL0dHaENYcGYwTU1LUmRrbm1qSjRzK01ndlNsRVRhNVRMMXhKWUVVNnNrN1MzWU9cbkZ2Vm9IYjdmWDBHQnpGY3FrODJtOEw1aVBRSlpLRFRlYWczdVZvU0s1RXlLbFdJd2RkYmN4d3h4amN2WmdGTDRcbnJkUnhndUdKcVZYNGZoOC85emQrL3IyUHhZdjJ2M3BScDN3SzNQSmZtYzNVWGYwckV4UHhMUm51Q3dLQmdGc2lcbnNwMWhFczlxWXpTSW50WEh1V1YwdklFR3ljMmhZNEZwNTJiSE5XWUF2L3lJZnRFTXZHMHM2WU9XVlBQTW5hYVNcbisyeDVxUHdJVGU0bkV6THkrdDloYkk0cC8vZkJ3ZEtVWk9ZejdIZ3EvVzhpaVNaY0RyOGpPOG9PK3ZTWlNvUkZcbjVpVGpzdkFRRkFvMTdNeGs2VUdOUFg4MHBPckltS2c0YmV0YkVCMWxBb0dCQUpIMTluNURlWUNaMkJONmlQNjdcbnB2ZGJNQXFtUHl1UE9jdVR5eXNuVlZ3eERWMk01SmxGaFBoUHRKVkhBeElJQnJyVkszOHdxK1U1a1VkR1NPc1lcbkpMZndtS3ZRcXdHNGx1Y1V4bjYvc2U0TGp2aFo4S1hiS0V4L1E2MEtOUXFlSDR2ekU3aXppQnFscW9zTHQ3ejlcbnZhYUVVWjByaFQwaHkrRDlPbURXR2tCSVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImZpcmViYXNlLWFkbWluc2RrLWZic3ZjQGRhbmFiLXByb2plY3QuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTE1NDM0OTc0MzI2MTE4ODA0MTYxIiwKICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLAogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLAogICJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL2NlcnRzIiwKICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9maXJlYmFzZS1hZG1pbnNkay1mYnN2YyU0MGRhbmFiLXByb2plY3QuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K
```

#### Waafi Payment
```
WAAFI_API_KEY=API-626176587AHX
WAAFI_API_USER_ID=1007444
WAAFI_MERCHANT_UID=M0913657
WAAFI_URL=https://api.waafipay.com/asm
```

#### HeyCharge
```
HEYCHARGE_API_KEY=04124317036a93f67450de1e79e2bba8
HEYCHARGE_DOMAIN=https://openapi.heycharge.global
```

#### Station IMEIs
```
STATION_58_IMEI=WSEP161721195358
STATION_59_IMEI=WSEP161741066502
STATION_60_IMEI=WSEP161741066503
STATION_61_IMEI=WSEP161741066504
STATION_62_IMEI=WSEP161741066505
```

#### Optional
```
PORT=3000
```

### 3. Add Custom Domains in Vercel

In Vercel Dashboard → Settings → Domains, add these 5 domains:

1. `station58.danab.com`
2. `station59.danab.com`
3. `station60.danab.com`
4. `station61.danab.com`
5. `station62.danab.com`

### 4. Configure DNS Records

In your domain registrar (where you bought `danab.com`), add these CNAME records:

```
Host: station58    Type: CNAME    Value: cname.vercel-dns.com
Host: station59    Type: CNAME    Value: cname.vercel-dns.com
Host: station60    Type: CNAME    Value: cname.vercel-dns.com
Host: station61    Type: CNAME    Value: cname.vercel-dns.com
Host: station62    Type: CNAME    Value: cname.vercel-dns.com
```

### 5. Generate QR Codes for Each Station

Create QR codes pointing to:

- **Castello Taleex**: `https://station58.danab.com`
- **Castello Boondhere**: `https://station59.danab.com`
- **Java Taleex**: `https://station60.danab.com`
- **Java Airport**: `https://station61.danab.com`
- **Dilek Somalia**: `https://station62.danab.com`

Print and place each QR code at its respective station.

## How It Works

When a customer scans the QR code:

1. **Station 58 (Castello Taleex)**: 
   - Customer visits `station58.danab.com`
   - App detects "58" from domain
   - Uses `STATION_58_IMEI=WSEP161721195358`
   - Logs rental with station code "58"

2. **Station 59 (Castello Boondhere)**:
   - Customer visits `station59.danab.com`
   - App detects "59" from domain
   - Uses `STATION_59_IMEI=WSEP161741066502`
   - Logs rental with station code "59"

And so on for all stations...

## Adding More Stations

When you expand to 20 stations:

1. Add new environment variable: `STATION_63_IMEI=your_new_imei`
2. Add custom domain: `station63.danab.com`
3. Add DNS CNAME: `station63 → cname.vercel-dns.com`
4. Generate QR code for `https://station63.danab.com`

**No code changes needed!**

## Testing

Test each station URL:
- https://station58.danab.com → Should show payment page
- https://station59.danab.com → Should show payment page
- https://station60.danab.com → Should show payment page
- https://station61.danab.com → Should show payment page
- https://station62.danab.com → Should show payment page

Each should process payments and log the correct station code in Firebase.
