import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = userSession?.user;
    
    // SECURITY GUARD: Fail fast if an unauthenticated request slips past middleware
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access detected." }, { status: 401 });
    }

    const formData = await request.formData();
    
    // 💡 FIXED: Matches name="price" passed from your client component form payload
    const price = formData.get('price'); 
    const title = formData.get('title');
    const propertyId = formData.get('propertyId');

    // 💡 EXTRA EXTRACTION: Grab your new user parameters collected inside the modal
    const moveInDate = formData.get('moveInDate');
    const contactNumber = formData.get('contactNumber');
    const additionalNotes = formData.get('additionalNotes');

    // Validate essential data parameters exist before reaching out to Stripe
    if (!price || !propertyId) {
      return NextResponse.json({ error: "Missing required booking metrics." }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(price) * 100), // Ensures an absolute safe integer value pass
            product_data: {
              name: title || "Property Lease Reservation",
            }
          },
          quantity: 1,
        },
      ],
      // 💡 ALL META RECORDED: Preserved perfectly inside Stripe to sync with your database later
      metadata: {
        price: Number(price),
        userId: user.id || "",
        userEmail: user.email || "",
        title: title || "",
        propertyId: propertyId || "",
        moveInDate: moveInDate || "",
        contactNumber: contactNumber || "",
        additionalNotes: additionalNotes || "",
      },
      mode: "payment",
      // Redirects to your custom localized success page layout view
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/all-properties/${propertyId}`,
    });

    // Redirect with a 303 See Other status code as required by transaction forms
    return NextResponse.redirect(session.url, 303);

  } catch (err) {
    console.error("Stripe Checkout Routing Crash:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Payment Error" },
      { status: err.statusCode || 500 },
    );
  }
}