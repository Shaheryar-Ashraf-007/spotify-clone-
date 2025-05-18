import { useMusicApp } from "@/stores/useMusicStore"

const SongTable = () => {

    const {songs, isLoading, error} = useMusicApp()

    if(isLoading) return <div className="text-center text-2xl">Loading...</div>

    if(error) return <div className="text-center text-2xl">Error: {error}</div>
  return (
    <div>

        
        
    </div>
  )
}

export default SongTable