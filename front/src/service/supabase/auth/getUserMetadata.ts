import { Session, User } from '@supabase/supabase-js';

export const getUserMetadata = async (session: Session | null): Promise<User | null> => {
    if (!session) return null;

    const { user } = session;

    let githubId = null;
    if (user) {
        githubId = user.app_metadata?.provider_id || user.user_metadata?.provider_id || user.user_metadata?.sub;
        if (!githubId) {
            console.log('Provider ID null');
        }
    } else {
        console.log('User object is null');
    }

    return user;
}