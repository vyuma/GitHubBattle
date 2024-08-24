import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/home', '/test', '/communities','community'];

export async function middleware(req: NextRequest) {
    try {
        const res = NextResponse.next();
        const supabase = createMiddlewareClient({ req, res });
        const { data: { session } } = await supabase.auth.getSession();

        //console.log('Session:', session);

        const path = req.nextUrl.pathname;
        //console.log('Path:', path);

        if (protectedPaths.some(protectedPath => path.startsWith(protectedPath)) && !session) {
            const redirectUrl = new URL('/login', req.url);
            redirectUrl.searchParams.set('redirectTo', path);
            return NextResponse.redirect(redirectUrl);
        }

        return res;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/home', '/test', '/community','/communities', '/login', '/home/(.*)', '/test/(.*)', '/community/(.*)', '/communities/(.*)'],
}