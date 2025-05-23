import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicApp } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";

const SongsTable = () => {
    const { songs, isLoading, error, deleteSong } = useMusicApp();

    // Loading state
    if (isLoading) {
        return <div className='flex items-center justify-center py-8'>Loading songs...</div>;
    }

    // Error state
    if (error) {
        return <div className='flex items-center justify-center py-8'>{error}</div>;
    }

    // Check if songs is an array
    if (!Array.isArray(songs)) {
        return <div className='flex items-center justify-center py-8'>No songs available.</div>;
    }

    // Songs table
    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-zinc-800/50'>
                    <TableHead className='w-[50px]'></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {songs.map((song) => (
                    <TableRow key={song._id} className='hover:bg-zinc-800/50'>
                        <TableCell>
                            <img src={song.imageUrl} alt={song.title} className='h-10 w-10 rounded object-cover' />
                        </TableCell>
                        <TableCell className='font-medium'>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>
                            <span className='inline-flex items-center gap-1 text-zinc-400'>
                                <Calendar className='h-4 w-4' />
                                {new Date(song.createdAt).toLocaleDateString()}
                            </span>
                        </TableCell>
                        <TableCell className='text-right text-red-500'>
                            <Button onClick={() => deleteSong(song._id)}>
                                <Trash2 className='h-4 w-4' />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SongsTable;