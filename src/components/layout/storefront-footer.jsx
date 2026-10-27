import { Link } from "react-router-dom";

function StorefrontFooter() {
  return (
    <footer className="border-t border-cloud bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="text-sm font-bold uppercase tracking-[0.3em]">
              VOQYRA
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Contemporary clothing shaped by bold design, thoughtful details and an editorial point
              of view.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Shop</p>

            <div className="mt-5 flex flex-col gap-3">
              <Link to="/shop" className="text-sm hover:text-coral">
                All products
              </Link>

              <Link to="/shop?sort=newest" className="text-sm hover:text-coral">
                New Drop
              </Link>

              <Link to="/wishlist" className="text-sm hover:text-coral">
                Wishlist
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Account
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link to="/account" className="text-sm hover:text-coral">
                My account
              </Link>

              <Link to="/account" className="text-sm hover:text-coral">
                Orders
              </Link>

              <Link to="/cart" className="text-sm hover:text-coral">
                Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/45">
          © {new Date().getFullYear()} VOQYRA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export { StorefrontFooter };
