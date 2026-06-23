// app/api/payment/route.js
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
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const price = formData.get('price');
    const title = formData.get('title');
    const propertyId = formData.get('propertyId');
    const moveInDate = formData.get('moveInDate');
    const contactNumber = formData.get('contactNumber');
    const additionalNotes = formData.get('additionalNotes');

    if (!price || !propertyId || !moveInDate || !contactNumber) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    // ✅ STEP 1: Create booking with "Pending" status
    // The Express server will generate a MongoDB ObjectId as tempId
    const bookingData = {
      propertyId,
      moveInDate,
      contactNumber,
      additionalNotes: additionalNotes || "",
      rentAmount: parseFloat(price),
      tenantId: user.id,
      tenantName: user.name || "",
      tenantEmail: user.email,
      bookingStatus: "Pending",
      paymentStatus: "Pending",
      title: title || "Property Lease",
    };

    const createBookingResponse = await fetch(
      `${expressApiUrl}/api/bookings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      }
    );

    if (!createBookingResponse.ok) {
      const error = await createBookingResponse.json();
      console.error('Booking creation failed:', error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    const bookingResult = await createBookingResponse.json();
    const bookingId = bookingResult.bookingId;
    const tempId = bookingResult.tempId;  // ✅ This is a MongoDB ObjectId string

    // ✅ STEP 2: Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(price) * 100),
            product_data: {
              name: `Booking: ${title || "Property Lease"}`,
              description: `Property ID: ${propertyId}`,
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        tempId: tempId,  // ✅ Pass the ObjectId as tempId
        bookingId: bookingId.toString(),
        propertyId: propertyId,
        userId: user.id,
      },
      mode: "payment",
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}&temp_id=${tempId}`,
      cancel_url: `${origin}/all-properties/${propertyId}`,
    });

    // ✅ STEP 3: Update booking with Stripe session ID
    await fetch(`${expressApiUrl}/api/bookings/${bookingId}/stripe-session`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stripeSessionId: session.id }),
    });

    // Redirect to Stripe
    return NextResponse.redirect(session.url, 303);

  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}