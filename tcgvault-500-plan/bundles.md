# TCGVault — Bundle Spec

Bundles are TCGVault's main margin lever. They take a thin-margin **sealed**
anchor (≈15%) and wrap it in fat-margin **accessories** (≈45%), sold at a small
discount the customer feels as value — while *your* blended margin goes **up**.

All figures below are produced and verified by `bundle_calc.py` (run it to
re-check with your real COGS). Component prices and stock are from the live
Shopify catalog on 2026-06-10.

## Why bundles, in one line
> Selling a Chaos Rising booster alone = **€1.20 profit (15%)**.
> The same booster inside the Starter Kit = **€7.45 profit (30%)** and **+€17 AOV**.

Across the four launchable bundles, blended margin is **26.9%** vs **~18%** on
today's sealed-heavy mix. That is the exact jump the profit model needs to bring
the €500 target down from €9,400/month of revenue to €2,475/month.

---

## The five bundles

### 1. Pull Protector Kit — €6.99  *(pure-margin attach / cart upsell)*
Penny Sleeves 100ct + Toploaders 25ct + ONE-TOUCH Magnetic Holder.
- **Profit €2.88 · margin 41% · stock for ~4**
- Role: the **one-click add-on** offered in the cart on *every* sealed order
  ("Protect your best pulls"). Doesn't need to be a deal — it's convenience.
- This is the single highest-ROI thing to enable, because it attaches to your
  existing sealed traffic with zero new customer acquisition.

### 2. Starter Collector Kit — €24.95  *(beginner / cadeau)*
Chaos Rising Booster + Penny Sleeves + Toploaders + Charmander Playmat.
MSRP €27.46, **customer saves €2.51**.
- **Profit €7.45 · margin 30% · stock for ~2**
- vs. the booster alone: **+€6.25 profit, +€17 AOV**.
- Role: the entry gift/beginner SKU. Targets your `kind` / `ouder` / `cadeau`
  audience tags. Great Google Shopping + social item.

### 3. Player's Battle Bundle — €32.95  *(spelen)*
Zapdos ex Deluxe Battle Deck + Dragon Shield Black 100ct + Eclipse Deck Box.
MSRP €35.47, **customer saves €2.52**.
- **Profit €7.44 · margin 23% · stock for ~2**
- vs. the deck alone: **+€4.45 profit, +€13 AOV**.
- Role: ready-to-play kit for the competitive/`gevorderd` crowd.

### 4. Gift Box — €39.95  *(cadeau / Q4)*
Pikachu Plush + Chaos Rising Booster + Funko POP.
MSRP €42.97, **customer saves €3.02**.
- **Profit €10.42 · margin 26% · stock for ~1**
- Role: birthday/holiday gift. Highest absolute profit per unit of the
  in-stock set. Toys carry better margin than sealed and photograph well for
  social.

### 5. Mega Evolution Collector's Bundle — €109.95  *(HERO — blocked on stock)*
Mega Evolution Perfect Order ETB + Mega Charizard Binder + Dragon Shield Black.
MSRP €115.97, **customer saves €6.02**.
- **Profit €22.17 · margin 20% · stock for 0 (ETB out of stock)**
- vs. the ETB alone: **+€10.17 profit, +€30 AOV** — your biggest AOV lever.
- Role: the flagship. **Cannot launch until the Mega Evolution ETBs are
  restocked** — which is itself Phase-1 priority B in the plan.

| Bundle | Price | Profit | Margin | +AOV vs anchor | Units now |
|---|---:|---:|---:|---:|---:|
| Pull Protector Kit | €6.99 | €2.88 | 41% | — | ~4 |
| Starter Collector Kit | €24.95 | €7.45 | 30% | +€17 | ~2 |
| Player's Battle Bundle | €32.95 | €7.44 | 23% | +€13 | ~2 |
| Gift Box | €39.95 | €10.42 | 26% | +€32 | ~1 |
| Mega Collector's (hero) | €109.95 | €22.17 | 20% | +€30 | 0 (restock) |

---

## The catch: stock is the limiter
Every launchable bundle is capped at **1–2 units** because the cheap, fat-margin
**accessories and toys are barely stocked** (playmats 2, battle decks 2, plush/
Funko 1 each, toploaders 4). Bundles can't scale on 2 units.

**The cheapest, highest-leverage restock in the whole plan is the bundle
components**, not more sealed:
- Penny sleeves (€1.49), toploaders (€2.99), deck boxes (€4.49), ONE-TOUCH
  (€2.99) — tiny per-unit cost, 45% margin, and they *multiply* the value of
  every sealed unit you sell.
- Restock the 1–2 anchor sealed lines (Chaos Rising booster is fine at 16; get
  the Mega ETBs back for bundle #5).

Order of operations: **restock components → launch bundles → push them on
sealed product pages + social.**

---

## How to build them on Shopify Basic

Shopify Basic has no native multi-product bundles, so pick one:

1. **Shopify Bundles app (first-party, free)** — *recommended.* Creates a fixed
   bundle whose inventory is **linked to the components**, so you can't oversell
   the playmat. Install once, build all five.
2. **Manual bundle product** (no app) — create a new product/SKU per bundle with
   its own price and a manually set quantity. Simplest, but inventory is *not*
   linked to components, so you must hand-manage stock. Fine for a quick test.
3. **Cart upsell for #1 (Pull Protector)** — surface it as a one-click add-on at
   checkout via a free upsell app or the theme's "pairs well with" block, rather
   than a standalone product.

Either way, for each bundle:
- Reuse the component product photos; have Canva composite a single "set" hero
  image (the connected Canva tools can do this).
- Title with set + audience keyword ("Mega Evolution Collector's Bundle — sleeves
  & binder included").
- Tag `bundle`, plus the relevant role/audience tags already in use
  (`upsell`, `cadeau`, `verzamelen`, `spelen`, `beginner`/`gevorderd`).
- Add a **bundle block on the matching sealed product page** ("Complete your
  setup — save €X").

## Pricing rules (so a bundle never costs you margin)
- Discount is **5–15% of MSRP**, funded entirely by accessory margin.
- **Never let a bundle's blended margin fall below ~20%** — `bundle_calc.py`
  flags this; re-run after any price change.
- Keep at least one bundle **above the €60 free-shipping threshold** so the
  bundle also pulls the shipping economics the right way.

## Rollout order
1. **Pull Protector Kit** as a cart add-on — instant, attaches to current orders.
2. **Starter Collector Kit** + **Player's Battle Bundle** — in-stock, gift+player.
3. Restock components, then widen units and add **Gift Box**.
4. Restock Mega ETBs → launch the **hero Collector's Bundle** (biggest AOV win).
