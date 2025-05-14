import { axiosinstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
    isAdmin: boolean;
    error: string | null;
    isLoading: boolean;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosinstance.get("/admin/check");
            console.log(response.data); 

            set({ isAdmin: response.data.admin }); 
        } catch (error: any) {
            set({ isAdmin: false, error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ isAdmin: false, error: null, isLoading: false }),
}));