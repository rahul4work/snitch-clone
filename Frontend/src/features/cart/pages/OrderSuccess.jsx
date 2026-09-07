import { Link, useLocation } from "react-router";
import { ArrowRight, Check, Copy, PackageCheck } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  const handleCopyOrderId = async () => {
    if (orderId && navigator.clipboard) {
      await navigator.clipboard.writeText(orderId);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-zinc-50 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Check size={27} strokeWidth={2.5} />
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
          Payment confirmed
        </p>
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Your order is on its way.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base">
          Thanks for shopping with Snitch. We have received your payment and
          will begin preparing your order shortly.
        </p>

        <section className="mt-10 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm">
          <div className="flex items-center gap-4 border-b border-zinc-100 px-5 py-5 sm:px-7">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
              <PackageCheck size={22} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">
                Order confirmed
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                We will send updates as your order moves forward.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 px-5 py-5 sm:px-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Razorpay order ID
            </p>
            <div className="mt-2 flex items-center gap-3">
              <p className="min-w-0 truncate font-mono text-sm text-zinc-800">
                {orderId || "Unavailable"}
              </p>
              {orderId && (
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  aria-label="Copy order ID"
                  title="Copy order ID"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white hover:text-orange-500"
                >
                  <Copy size={15} />
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-orange-200 transition-colors hover:bg-orange-600"
          >
            Continue shopping
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-900 hover:text-black"
          >
            View profile
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
