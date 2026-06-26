import { useEffect } from 'react';
import { authService } from '@/lib/supabase/auth';
import { useAuth } from '@/store';

export const useAuthListener = () => {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const { data: subscription } = authService.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { data } = await authService.getCurrentUser();
          if (data?.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              full_name: data.user.user_metadata?.full_name,
              avatar_url: data.user.user_metadata?.avatar_url,
              created_at: data.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, [setUser, setLoading]);
};
