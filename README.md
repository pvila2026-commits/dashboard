# PVILA — static booking site (GitHub Pages)

No server, no Render. Files: `index.html` (site), `calendar-data.js` (Bengali dual calendar: month starts, rituals, Shubho Bibaho dates), `admin.html` (reports + CSV), `config.js` (settings), `backend/Code.gs` (free database + payments), `images/`.

## 1. Publish on GitHub Pages
Create a repo → upload everything in this folder → Settings → Pages → Deploy from branch `main` / root.

## 2. Database + payments (free, ~10 min)
1. Create a **Google Sheet** → Extensions → Apps Script → paste `backend/Code.gs`.
2. Project Settings → Script Properties: `ADMIN_KEY` (long secret), and when ready `RZP_KEY_ID`, `RZP_KEY_SECRET` (Razorpay).
3. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the URL into `config.js` → `BACKEND_URL`.
4. Every booking becomes a row in the Sheet (your database). **CSV report:** open `admin.html`, enter ADMIN_KEY, click *Download CSV* — or Sheet → File → Download → CSV.
Without Razorpay keys, bookings are saved as "Enquiry" (no online payment). With keys, the 25% advance + ₹10,000 deposit is collected and the payment signature is verified server-side.

## Payment options (pick one in `config.js`)
1. **Best:** `BACKEND_URL` + Razorpay keys in Script Properties (order created + signature verified + saved to Sheet).
2. **No backend:** put only your public `RZP_KEY_ID` — Razorpay Checkout opens directly; booking details travel in the payment notes, so export them from Razorpay Dashboard → Payments → Export (CSV).
3. **UPI fallback:** `UPI_ID` opens the customer's UPI app with the amount filled in.
Razorpay already offers UPI, cards, netbanking and wallets in one checkout.

## Calendar
`calendar-data.js` holds the Bengali month-start table, festival/holiday list and Shubho Bibaho dates (Oct 2026 – Dec 2027). Dates from Jan 2027 onward follow the standard West Bengal sankranti rule and may differ by ±1 day from a given panjika — verify with your priest and edit the file if needed. Availability dots come from the Google Sheet (or this browser in demo mode). To block dates for private use, add a row in the Sheet with status `Blocked`, the date, days and spaces (e.g. `ground+first`).

## 3. Photos
Slideshow photos (upscaled) are in `images/slides/`. Edit the `SL` list in `index.html` to add/replace slides; entries with `k:"md"` are the modern text slides (Office, Sangeet, Puja, Family).

## Pricing (from Agreement_for_Villa.xlsx)
₹20,000/day each for Ground, First, Second floor and Roof Top. Advance 25%, refundable security ₹10,000, overtime ₹10,000/hr. Edit `config.js` (and the numbers in `Code.gs`).
