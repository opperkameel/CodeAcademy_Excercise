#!/usr/bin/env python3
"""
Bundle economics for TCGVault — verifies that each proposed bundle has a
HIGHER blended margin and more absolute profit than selling the anchor
(sealed) item alone, while still feeling like a deal to the customer.

COGS assumptions (same as profit_model.py — replace with real costs):
  sealed      -> cost = 85% of price (15% gross margin)
  accessories -> cost = 55% of price (45% gross margin)
  toys        -> cost = 65% of price (35% gross margin)

Run: python3 bundle_calc.py
"""

COST_FACTOR = {"sealed": 0.85, "accessory": 0.55, "toy": 0.65}


def cost(price, kind):
    return price * COST_FACTOR[kind]


class Bundle:
    def __init__(self, name, items, bundle_price, max_units_now):
        # items: list of (label, price, kind)
        self.name = name
        self.items = items
        self.bundle_price = bundle_price
        self.max_units_now = max_units_now  # limited by lowest component stock

    @property
    def msrp(self):
        return sum(p for _, p, _ in self.items)

    @property
    def total_cost(self):
        return sum(cost(p, k) for _, p, k in self.items)

    @property
    def profit(self):
        return self.bundle_price - self.total_cost

    @property
    def margin(self):
        return self.profit / self.bundle_price

    @property
    def customer_saves(self):
        return self.msrp - self.bundle_price

    def anchor(self):
        # the sealed item, for the "vs. selling alone" comparison
        for label, p, k in self.items:
            if k == "sealed":
                return label, p, k
        return None

    def report(self):
        print(f"\n=== {self.name} ===")
        for label, p, k in self.items:
            print(f"   {label:42s} €{p:6.2f}  [{k}]")
        print(f"   {'MSRP if bought separately':42s} €{self.msrp:6.2f}")
        print(f"   {'BUNDLE PRICE':42s} €{self.bundle_price:6.2f}"
              f"   (customer saves €{self.customer_saves:.2f})")
        print(f"   bundle cost ........ €{self.total_cost:6.2f}")
        print(f"   bundle PROFIT ...... €{self.profit:6.2f}   margin {self.margin*100:4.1f}%")
        a = self.anchor()
        if a:
            label, p, k = a
            alone_profit = p - cost(p, k)
            alone_margin = alone_profit / p
            print(f"   vs. {label[:28]:28s} alone: €{alone_profit:.2f} profit "
                  f"({alone_margin*100:.0f}%)  ->  bundle adds "
                  f"€{self.profit - alone_profit:+.2f} profit, "
                  f"€{self.bundle_price - p:+.2f} AOV")
        print(f"   launchable now: up to {self.max_units_now} units (limited by lowest-stock item)")


BUNDLES = [
    Bundle(
        "Starter Collector Kit  (beginner / verzamelen / cadeau)",
        [("Chaos Rising Booster Pack", 7.99, "sealed"),
         ("Ultra PRO Penny Sleeves 100ct", 1.49, "accessory"),
         ("Ultra PRO Toploaders 25ct", 2.99, "accessory"),
         ("Ultra PRO 9-Pocket Pro Binder", 16.99, "accessory")],  # collect-and-protect, not a playmat
        bundle_price=26.95, max_units_now=3,   # binder stock = 3
    ),
    Bundle(
        "Player's Battle Bundle — complete  (spelen)",
        [("Zapdos ex Deluxe Battle Deck", 19.99, "sealed"),
         ("Dragon Shield Black 100ct", 10.99, "accessory"),
         ("Eclipse PRO 100+ Deck Box", 4.49, "accessory"),
         ("Charmander Playmat", 14.99, "accessory")],   # playmat lives here, with the players
        bundle_price=46.95, max_units_now=2,   # deck/playmat stock = 2
    ),
    Bundle(
        "Player's Battle Bundle — lean  (spelen, alt.)",
        [("Zapdos ex Deluxe Battle Deck", 19.99, "sealed"),
         ("Dragon Shield Black 100ct", 10.99, "accessory"),
         ("Charmander Playmat", 14.99, "accessory")],   # playmat swapped in for the deck box
        bundle_price=42.95, max_units_now=2,
    ),
    Bundle(
        "Mega Evolution Collector's Bundle  (HERO, needs ETB restock)",
        [("Mega Evolution Perfect Order ETB", 79.99, "sealed"),
         ("Mega Charizard 9-Pocket Binder", 24.99, "accessory"),
         ("Dragon Shield Black 100ct", 10.99, "accessory")],
        bundle_price=109.95, max_units_now=0,  # ETB at 0 stock -> blocked
    ),
    Bundle(
        "Gift Box  (cadeau / Q4)",
        [("Pikachu Plush 20cm", 19.99, "toy"),
         ("Chaos Rising Booster Pack", 7.99, "sealed"),
         ("Funko POP Pokémon", 14.99, "toy")],
        bundle_price=39.95, max_units_now=1,   # plush/funko stock = 1 each
    ),
    Bundle(
        "Pull Protector Kit  (pure-margin attach / upsell)",
        [("Ultra PRO Penny Sleeves 100ct", 1.49, "accessory"),
         ("Ultra PRO Toploaders 25ct", 2.99, "accessory"),
         ("Ultra PRO ONE-TOUCH Magnetic Holder", 2.99, "accessory")],
        bundle_price=6.99, max_units_now=4,    # toploaders/one-touch stock = 4
    ),
]


def main():
    print("=" * 68)
    print(" TCGVault — bundle economics (verified)")
    print("=" * 68)
    for b in BUNDLES:
        b.report()
    print("\n" + "-" * 68)
    print(" Blended margin of the launchable bundles (excl. blocked hero):")
    live = [b for b in BUNDLES if b.max_units_now > 0]
    rev = sum(b.bundle_price for b in live)
    prof = sum(b.profit for b in live)
    print(f"   one of each = €{rev:.2f} revenue, €{prof:.2f} profit, "
          f"{prof/rev*100:.1f}% blended margin")
    print("   (vs. ~18% on the sealed-only mix today)\n")


if __name__ == "__main__":
    main()
