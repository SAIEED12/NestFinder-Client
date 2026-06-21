import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
    const session =  await auth.api.getSession({
    headers: await headers() // headers containing the user's session token
});

    if(!session && !session?.user){
        return NextResponse.redirect(new URL('/login', request.url))
    }
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [
    // Tenant Protected Routes
    '/all-properties/:id',            
    '/dashboard/tenant/bookings',   
    '/dashboard/tenant/favorites',  
    '/dashboard/tenant/profile',   

    // Owner Protected Routes
    '/dashboard/owner/home',             
    '/dashboard/owner/add-property',     
    '/dashboard/owner/my-properties',   
    '/dashboard/owner/booking-requests', 
    '/dashboard/owner/profile',         

    // Admin Protected Route
    '/dashboard/admin/all-users',       
    '/dashboard/admin/all-properties',  
    '/dashboard/admin/all-bookings',    
    '/dashboard/admin/transactions',    
    '/dashboard/admin/profile',         
  ]
}