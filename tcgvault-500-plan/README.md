# TCGVault → €500/month profit plan

A real, numbers-grounded operating plan to take **shop.tcgvault.be** (Belgian
Pokémon TCG store) from ~€0 net profit to **€500 net profit per month**.

Built from the store's own Shopify data on 2026-06-10, not a generic template.

## The one-paragraph version

TCGVault does ~€800/month revenue from ~2.5 visitors/day, selling a sealed-heavy
mix at ~18% gross margin while quietly subsidising shipping — so it nets roughly
**€0**. At those economics, hitting €500 profit would need ~€9,400/month in sales.
Fix the margin mix (sell more accessories alongside sealed) and stop subsidising
shipping, and the same €500 goal needs only **~€2,475/month** — about 50 orders
from ~55 visitors/day. So the plan has two halves: **(1) raise profit per order
now** (mix, shipping threshold, bundles, upsells — doable this week), and
**(2) ~20× the traffic over 90 days** (organic short-form video, SEO/Google
Shopping, Bol.com, email, preorders). Paid ads only on high-margin items, never
on sealed.

## Files

| File | What it is |
|---|---|
| `PLAN.md` | The full plan: diagnosis, profit math, four levers, 90-day week-by-week execution, and what I can build for you with the connected Shopify/Mailchimp/ads/Canva tools. |
| `profit_model.py` | Tunable calculator. Edit your real COGS/shipping/fees at the top, run `python3 profit_model.py`, and it solves the revenue/orders/traffic needed for €500. No dependencies. |
| `tracking/kpi_tracker.md` | Weekly scorecard + monthly trajectory vs. target. |

## Start here
1. Read `PLAN.md` §1–2 (where you are + the profit math).
2. Run `python3 profit_model.py`. Replace the placeholder COGS with your real
   numbers and re-run until the targets reflect your costs.
3. Do Phase 1 (Weeks 1–2) in `PLAN.md` §4 — the leak-stopping fixes.
4. Track weekly in `tracking/kpi_tracker.md`.

## Want me to execute it?
The Shopify store, Mailchimp, the ads/social platform, and Canva are all
connected to this session. I can build the bundles, collections, SEO rewrites,
discount/shipping logic, email automation, and social/ad creatives directly —
just tell me which to start with. Live, outward-facing changes get confirmed
with you before they go out.
