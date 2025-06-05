import { axiosinstance } from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import  { useEffect, useState, ReactNode } from 'react';



const AuthProviders = ({ children }: { children: ReactNode }) => {
    const { getToken, userId } = useAuth(); 
    const [loading, setLoading] = useState(true); 
    const {checkAdminStatus} = useAuthStore()

    const updateApiToken = (token: string | null) => {
        if (token) {
            axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosinstance.defaults.headers.common['Authorization'];
        }
    };

    const {initSocket, disconnectSocket}= useChatStore() 


    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);

                if(token){
                    await checkAdminStatus()

                    if(userId) {
                        initSocket(userId); 
                    }

                }
            } catch (error) {
                updateApiToken(null);
                console.log("Error in Auth Providers", error);
            } finally {
                setLoading(false);
            }
        };


		// clean up
		

        initAuth();

        return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

    if (loading) {
        return (
            <div className='h-screen w-full flex items-center justify-center'>
                <Loader className='size-8 text-emerald-500 animate-spin' />
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
};

export default AuthProviders;