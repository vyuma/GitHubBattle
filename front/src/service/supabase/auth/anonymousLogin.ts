import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export const anonymousLogin = async (): Promise<boolean> => {
    const supabase = createClientComponentClient()


        try {
            const { data, error } = await supabase.auth.signInAnonymously()

            if (error) throw error;

            if (data.user) {
                console.log('Anonymous user signed in successfully:', data.user);
                return true;
            } else {
                return false;
            }

        } catch (error) {
            console.error('Anonymous sign-in error:', error);
            return false;
        }

}