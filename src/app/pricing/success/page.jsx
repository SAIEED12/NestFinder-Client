// app/pricing/success/page.jsx
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

export default async function SuccessPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const session_id = resolvedParams?.session_id;
  const temp_id = resolvedParams?.temp_id;  // ✅ This is the MongoDB ObjectId

  if (!session_id) {
    return redirect("/all-properties");
  }

  // Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.status !== "complete") {
    return redirect("/all-properties");
  }

  // ✅ Update payment status only (booking remains PENDING)
  let paymentConfirmed = false;
  try {
    const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    const syncResponse = await fetch(`${expressApiUrl}/api/bookings/fulfill`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stripeSessionId: session.id,
        tempId: temp_id,  // ✅ Pass the ObjectId
        paymentIntentId: session.payment_intent,
      }),
    });

    const syncData = await syncResponse.json();
    paymentConfirmed = syncResponse.ok && syncData.success;

  } catch (err) {
    console.error("Payment confirmation error:", err);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-zinc-950 py-12 px-6">
      <div className="w-full max-w-xl bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900/80 rounded-[36px] p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 mb-6">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight mb-3">
          Payment Successful!
        </h1>

        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold max-w-sm mx-auto leading-relaxed mb-6">
          Your payment has been confirmed. 
          {paymentConfirmed && (
            <span className="text-emerald-500 font-extrabold block mt-2">
              ✓ Payment Status: Paid
            </span>
          )}
        </p>

        {/* Show pending status message */}
        <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3 justify-center">
            <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
              Booking Status: <span className="uppercase">Pending</span>
            </p>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400/70 mt-1">
            The property owner will review and approve your booking request shortly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
          <Link href="/dashboard/tenant/bookings" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#E05638] hover:bg-[#c9492e] text-white font-bold text-xs px-6 h-11 rounded-xl">
              View My Bookings
            </button>
          </Link>

          <Link href="/all-properties" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto font-bold text-xs text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 h-11 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
              Return to Listings
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}