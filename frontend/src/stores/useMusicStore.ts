import { axiosinstance } from "@/lib/axios"
import {create} from "zustand"

export const useMusicApp = create((set )=>({
    albums:[],
    songs:[],

    isLoading: false,
    error: null,


    fetchAlbums: async()=>{

        set({
            isLoading:true,
            error:null,
        })

        try {

            const response = await axiosinstance.get('/albums')
            set({albums:response.data})

            
        } catch (error:any) {
            set({error:error.response.data.message})
            console.log(error)
            
        } finally{
            set({isLoading:false})
        }

    }
}))