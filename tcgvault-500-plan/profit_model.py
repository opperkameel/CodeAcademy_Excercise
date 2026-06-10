#!/usr/bin/env python3
"""
TCGVault profit model — what does it actually take to net EUR 500/month?

This turns the plan's assumptions into one place you can tune. Replace the
INPUTS with your real cost numbers (COGS %, shipping, fees) and run:

    python3 profit_model.py

It prints (1) where you are now, and (2) the revenue / orders / traffic you
need to hit the profit goal under your numbers. Every default is an estimate
from public Pokémon TCG / Belgian e-commerce economics, clearly labelled.
No dependencies — standard library only.
"""

from dataclasses import dataclass

# ----------------------------------------------------------------------------
# INPUTS — edit these to match reality, then re-run.
# ----------------------------------------------------------------------------

GOAL_NET_PROFIT = 500.0          # EUR/month, the target

# --- Product mix (must sum to 1.0) and gross margin per category ---
# Gross margin = (price - cost of goods) / price, BEFORE fees/shipping/fixed.
MIX = {
    # category:        (share_of_revenue, gross_margin)
    "sealed":          (0.60, 0.15),   # ETBs, boosters, bundles  (thin)
    "accessories":     (0.30, 0.45),   # sleeves, binders, toploaders (fat)
    "toys":            (0.10, 0.35),   # Funko, plush
}

# Today's mix, for the "where you are now" snapshot.
MIX_TODAY = {
    "sealed":          (0.85, 0.15),
    "accessories":     (0.10, 0.45),
    "toys":            (0.05, 0.35),
}

# --- Per-order and percentage costs ---
AOV = 50.0                       # target average order value (EUR)
AOV_TODAY = 48.0                 # current AOV
PAYMENT_FEE_PCT = 0.022          # ~2.2% blended (Mollie/Bancontact/cards + fixed)
SHIPPING_SUBSIDY_PER_ORDER = 0.0 # EUR lost per order on shipping. Target = 0
                                 # (set free-ship threshold so it breaks even).
SHIPPING_SUBSIDY_TODAY = 4.50    # what you're currently eating per order
PACKAGING_PER_ORDER = 0.75       # mailer + toploader/tape per order

# --- Fixed monthly costs ---
FIXED_MONTHLY = 27 + 15 + 10     # Shopify Basic + email/tools + misc
AD_SPEND = 0.0                   # set >0 only if ads are net-positive; the model
                                 # treats ad spend as a straight cost here.

# --- Conversion, for the traffic requirement ---
CONVERSION_RATE = 0.03           # 3% target
CONVERSION_TODAY = 0.025

# ----------------------------------------------------------------------------
# MODEL
# ----------------------------------------------------------------------------

@dataclass
class Scenario:
    name: str
    mix: dict
    aov: float
    shipping_subsidy: float
    conversion: float

    def blended_gross_margin(self) -> float:
        assert abs(sum(s for s, _ in self.mix.values()) - 1.0) < 1e-6, \
            f"{self.name}: mix shares must sum to 1.0"
        return sum(share * margin for share, margin in self.mix.values())

    def contribution_margin_pct(self) -> float:
        """Fraction of each revenue-euro left after variable costs, before fixed."""
        gm = self.blended_gross_margin()
        per_order_cost = self.shipping_subsidy + PACKAGING_PER_ORDER
        per_order_cost_pct = per_order_cost / self.aov
        return gm - PAYMENT_FEE_PCT - per_order_cost_pct

    def net_profit_at_revenue(self, revenue: float) -> float:
        return revenue * self.contribution_margin_pct() - FIXED_MONTHLY - AD_SPEND

    def revenue_needed(self, goal: float) -> float:
        cm = self.contribution_margin_pct()
        if cm <= 0:
            return float("inf")
        return (goal + FIXED_MONTHLY + AD_SPEND) / cm

    def report(self, goal: float):
        gm = self.blended_gross_margin()
        cm = self.contribution_margin_pct()
        rev = self.revenue_needed(goal)
        orders = rev / self.aov
        sessions = orders / self.conversion
        print(f"\n=== {self.name} ===")
        print(f"  Blended gross margin .......... {gm*100:5.1f}%")
        print(f"  Contribution margin ........... {cm*100:5.1f}%  (after fees/ship/packaging)")
        if cm <= 0:
            print("  Contribution margin is <= 0 — you lose money on every sale. "
                  "Fix mix/shipping before scaling.")
            return
        print(f"  Revenue needed for EUR {goal:.0f}/mo .. EUR {rev:,.0f}/month")
        print(f"  -> orders/month ............... {orders:5.0f}   (~{orders/30:.1f}/day)")
        print(f"  -> sessions/month ............. {sessions:5.0f}   (~{sessions/30:.1f}/day)")


def main():
    print("=" * 64)
    print(" TCGVault — path to EUR {:.0f} net profit / month".format(GOAL_NET_PROFIT))
    print("=" * 64)

    today = Scenario(
        name="Today (snapshot)",
        mix=MIX_TODAY, aov=AOV_TODAY,
        shipping_subsidy=SHIPPING_SUBSIDY_TODAY, conversion=CONVERSION_TODAY,
    )
    target = Scenario(
        name="Target (fixed mix + breakeven shipping)",
        mix=MIX, aov=AOV,
        shipping_subsidy=SHIPPING_SUBSIDY_PER_ORDER, conversion=CONVERSION_RATE,
    )

    # Snapshot: what is today's ~EUR800 actually earning?
    current_rev = 800.0
    print(f"\nAt today's run rate (~EUR {current_rev:.0f}/month revenue):")
    print(f"  contribution margin .... {today.contribution_margin_pct()*100:.1f}%")
    print(f"  est. net profit ........ EUR {today.net_profit_at_revenue(current_rev):,.0f}/month")

    target.report(GOAL_NET_PROFIT)
    today.report(GOAL_NET_PROFIT)

    # Sensitivity: how the revenue target moves with the margin fixes.
    print("\n--- Why the fixes matter (revenue needed for the goal) ---")
    for label, sc in [("if you change nothing", today),
                      ("with the planned fixes", target)]:
        print(f"  {label:26s}: EUR {sc.revenue_needed(GOAL_NET_PROFIT):,.0f}/month")
    print("\nTune the INPUTS at the top with your real COGS and re-run.\n")


if __name__ == "__main__":
    main()
