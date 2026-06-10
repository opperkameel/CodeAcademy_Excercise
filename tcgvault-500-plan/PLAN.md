# TCGVault — Plan to €500 Net Profit / Month

**Store:** shop.tcgvault.be (Belgium, Pokémon TCG, Shopify Basic, EUR)
**Baseline date:** 2026-06-10
**Goal:** €500 *net* profit per month, sustained.

This is not a generic e‑commerce checklist. It is built from TCGVault's own
Shopify data and the unit economics of Pokémon TCG retail in Belgium. Plug your
real cost numbers into `profit_model.py` and re-read the targets — every number
below is an estimate until you replace it with your actual COGS.

---

## 1. Where the store is today (the real numbers)

| Month (2026) | Orders | Revenue | AOV |
|---|---|---|---|
| April | 3 | €255 | €85 |
| May | 17 | €811 | €44 |
| June (1–10) | 5 | €262 | €52 |

- **Run rate: ~€800/month revenue.**
- **Traffic: ~228 sessions in 90 days (~2.5 visitors/day).** Sources: direct 172,
  search 51, unknown 5. **Zero** social, paid, or email-driven traffic.
- **Conversion: 2–8%** (small numbers, so noisy — but not the bottleneck).
- **Top sellers:** Mega Evolution Elite Trainer Boxes (ETBs) and boosters —
  i.e. *sealed product*, the lowest-margin category.
- **Inventory:** the proven bestsellers (Mega Evolution ETBs) are at **0 stock**.
  You are out of stock on the exact things that sell.
- **Shipping:** in May you collected €27 of shipping on 17 orders (~€1.60/order)
  while Belgian bpost parcels cost ~€5–7. You are subsidising ~€4–5 per order,
  silently deleting ~€70–90/month of margin.

### Diagnosis
The constraint, in order:
1. **Traffic** — 2.5 visitors/day cannot produce €500 profit at any conversion rate.
2. **Availability** — bestsellers out of stock means lost sales on the traffic you *do* get.
3. **Margin mix & shipping** — sealed-heavy mix + subsidised shipping means each
   euro of revenue carries too little profit.

You fix all three in parallel. Traffic is the long game; availability and margin
are fixable this week.

---

## 2. The profit math (why €500 ≈ €2,500 revenue)

Pokémon sealed product is a thin-margin traffic driver; accessories are the
profit. Realistic gross margins:

| Category | Examples | Gross margin |
|---|---|---|
| Sealed (ETBs, boosters, bundles) | Mega Evolution ETB, booster boxes | ~12–18% |
| Accessories (`rol-marge`) | Ultra PRO / Dragon Shield sleeves, binders, toploaders | ~40–50% |
| Toys (Funko, plush) | Pikachu plush, Funko POP | ~30–40% |

With today's ~85% sealed mix, blended gross margin is ~17%. After payment fees
(~2.2%), the shipping subsidy, and packaging, **net contribution is ~10%** — so
€800 revenue ≈ €30–60 profit/month, before you even pay for Shopify.

**To reach €500 net/month you need either:**
- **~€2,500/month revenue** *with* a fixed mix (60% sealed / 30% accessories /
  10% toys) **and** shipping that breaks even, **or**
- **~€3,500/month revenue** if you stay sealed-heavy and keep subsidising shipping.

The whole point of this plan is to hit the *lower* number by raising margin per
order, not just chasing more revenue. Run `python3 profit_model.py` to see this
solved for your actual inputs.

### What €2,500/month looks like operationally
- AOV €50 → **~50 orders/month (~1.6/day)**
- At 3% conversion → **~1,650 sessions/month (~55/day)**
- Today you have ~2.5/day. **This plan must roughly 20× traffic.** That is the
  honest core of the work.

---

## 3. The four levers

### Lever A — Traffic (the make-or-break)
You cannot pay your way to profit on sealed product (margin is thinner than ad
cost). So traffic must be **mostly organic**, with paid used surgically.

1. **Organic short-form video — the #1 free lever for TCG.**
   - TikTok + Instagram Reels + YouTube Shorts: pack openings, ETB reviews,
     "best binder for Mega Evolution", restock alerts, top pulls.
   - 1 video/day from stock you already photograph. Pokémon content travels.
   - Goal: one account to 1k followers in 90 days; every video links to the shop.
2. **Google Shopping / SEO.** You already get organic search (51 sessions).
   Pokémon set names are searched constantly in NL/BE.
   - Ensure every product has the set name, language (EN/NL), and "Belgium /
     België" in title + description.
   - Build collection pages per set ("Mega Evolution", "Chaos Rising") — these
     rank and convert.
   - Submit the catalog to Google Merchant Center (free listings).
3. **Belgian marketplaces.** List on **Bol.com** (the dominant BE/NL marketplace)
   and consider **Cardmarket** for singles. This is borrowed traffic with buyers
   already in wallet-out mode. Marketplace fees (~10–15%) are survivable on
   accessories and singles, tight on sealed.
4. **Community.** Belgian/Dutch Pokémon Facebook groups, Discord servers, local
   league/tournament boards. Be a helpful member, not a spammer; restock and
   preorder announcements are welcome there.

### Lever B — Availability (fix this week)
- **Restock the proven sellers.** The Mega Evolution ETBs at €0 stock were your
  top revenue lines. Get them back in stock or remove them from prominent
  placement so you're not advertising dead inventory.
- **Set up back-in-stock email capture** on out-of-stock products (Shopify app or
  Mailchimp form). Every "notify me" is a warm lead and free demand signal.
- **Never run a hero product to zero silently** — see the KPI tracker.

### Lever C — AOV & attach rate (raise margin per order)
- **Free-shipping threshold at €60** (covers your shipping cost and pulls AOV up
  from €44–52). Below it, charge real shipping (~€4.95). Stop subsidising.
- **Attach a `rol-marge` accessory to every sealed order.** You already have the
  right bundle SKUs (Toploader Combo, Booster Bundle). Push them as cart upsells:
  "Protect your pulls — add sleeves + toploaders."
- **Build 2–3 curated bundles** that pair a traffic product with margin product at
  a small discount but a *higher blended margin* than the sealed item alone, e.g.
  "Starter Collector Kit" = booster + penny sleeves + toploaders + binder.

### Lever D — Margin categories (structurally higher profit)
- **Preorders on new Pokémon sets.** Releases are a known calendar. Preorders give
  you cash upfront, guaranteed sell-through, and a reason to email/post every few
  weeks. This is the single best recurring demand engine in TCG.
- **Singles / chase cards via Cardmarket.** Buy collections, sell the hits. Highest
  margin in the hobby. Optional, higher effort — phase 3.
- **Toys (Funko/plush) as gifts.** Higher margin than sealed, great for "cadeau"
  SEO and Q4. You already stock and tag these (`cadeau`).

---

## 4. 90-day execution plan

### Phase 1 — Weeks 1–2: Stop the leaks, lay rails
- [ ] Restock or de-feature the 0-stock Mega Evolution ETBs (Lever B).
- [ ] Set free-shipping threshold to €60; set real shipping €4.95 below it (Lever C).
- [ ] Turn on back-in-stock capture on every out-of-stock product.
- [ ] Create per-set collection pages (Mega Evolution, Chaos Rising) and rewrite
      titles/descriptions for SEO (set name + language + België).
- [ ] Stand up the email list: Mailchimp signup popup ("10% off first order +
      restock alerts"). Connected Mailchimp tools can build this.
- [ ] Create one TikTok + one Instagram account; post the first 3 videos.
- [ ] Build the 2–3 curated bundles and enable cart upsell of accessories.

### Phase 2 — Weeks 3–6: Turn on demand
- [ ] Post short-form video **daily**; double down on whatever format gets views.
- [ ] Submit catalog to Google Merchant Center; turn on free Shopping listings.
- [ ] List 10 best accessories + any singles on **Bol.com**.
- [ ] Launch a preorder for the next Pokémon set; email + post it.
- [ ] First email campaign to the list (restock + bundle spotlight). Aim: monthly
      cadence minimum, weekly during a release.
- [ ] If running paid: a small **€5–10/day** Meta/Google test **on accessories or
      bundles only** (never sealed — the margin won't cover the click). Kill
      anything below break-even ROAS fast.

### Phase 3 — Weeks 7–12: Scale what works
- [ ] Concentrate budget/time on the 1–2 channels that produced orders.
- [ ] Add Cardmarket singles if you can source collections (highest margin).
- [ ] Lock in a reliable restock cadence on the 5 proven sellers.
- [ ] Launch a loyalty/referral nudge to returning customers (you already have
      repeat buyers — see Shopify customers).
- [ ] Q4/holiday gift push on plush + Funko + bundles ("cadeau").

### Target trajectory (revenue, conservative)
| Month | Revenue target | Net profit (at ~20% contribution) |
|---|---|---|
| Now | €800 | ~€40–80 |
| +1 | €1,200 | ~€150 |
| +2 | €1,800 | ~€300 |
| +3 | €2,500+ | **~€500** |

These assume the margin-mix and shipping fixes land. If mix stays sealed-heavy,
slide each revenue target up ~40%.

---

## 5. The numbers to watch (weekly)
Track these in `tracking/kpi_tracker.md`. If only one moves, make it **sessions/day**.

1. **Sessions/day** (today ~2.5 → target ~55)
2. **Conversion rate** (hold ≥2.5%)
3. **AOV** (today ~€48 → target ≥€55 via threshold + upsell)
4. **Blended gross margin %** (today ~17% → target ≥25%)
5. **Orders/month** (today ~17 → target ~50)
6. **Out-of-stock count on `rol-traffic` heroes** (target: 0)
7. **Email list size** (today ~0 → grow weekly)
8. **Net profit** (the goal — computed in `profit_model.py`)

---

## 6. What I can execute for you with the connected tools
The store, email, ads, and design tools are all connected to this session. On
your go-ahead I can do any of these directly (these are live, outward-facing
changes, so I'll confirm scope before pulling the trigger):

- **Shopify:** create the curated bundle products, build per-set collections,
  rewrite SEO titles/descriptions, create discount codes, set the free-shipping
  threshold logic via a discount, fix inventory tracking.
- **Mailchimp:** build the welcome/first-order discount automation and the first
  restock campaign.
- **Vibiz (ads/social):** generate ICPs and offers, produce ad/video creatives,
  and — only on your explicit approval and budget — launch small accessory/bundle
  ad tests on Meta/Google/TikTok.
- **Canva:** design the social templates and bundle product imagery.

See `README.md` for how the pieces fit together and `profit_model.py` to tune the
targets to your real costs.
