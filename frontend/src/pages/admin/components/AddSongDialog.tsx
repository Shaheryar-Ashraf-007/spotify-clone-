import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosinstance } from "@/lib/axios";
import { useMusicApp } from "@/stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react";
import { Plus, Upload, Music, Image, Clock, User, Album } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
	title: string;
	artist: string;
	album: string;
	duration: string;
}

const AddSongDialog = () => {
	const { albums } = useMusicApp();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		album: "",
		duration: "0",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const { getToken } = useAuth();

const handleSubmit = async () => {
  setIsLoading(true);

  try {
    if (!files.audio || !files.image) {
      return toast.error("Please upload both audio and image files");
    }

    const token = await getToken(); // ✅ Clerk token

    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newSong.title);
    formData.append("artist", newSong.artist);
    formData.append("duration", newSong.duration);
    if (newSong.album && newSong.album !== "none") {
      formData.append("albumId", newSong.album);
    }
    formData.append("audioFile", files.audio);
    formData.append("imageFile", files.image);

    await axiosinstance.post("/admin/song", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // ✅ Proper Clerk token
      },
    });

    setNewSong({ title: "", artist: "", album: "", duration: "0" });
    setFiles({ audio: null, image: null });
    toast.success("Song added successfully");
  } catch (error: any) {
    toast.error("Failed to add song: " + (error.response?.data?.message || error.message));
  } finally {
    setIsLoading(false);
  }
};



	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
					<Plus className='mr-2 h-5 w-5' />
					Add Song
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white border border-zinc-700/50 rounded-2xl shadow-2xl max-h-[80vh] overflow-auto backdrop-blur-sm'>
				<DialogHeader className='space-y-3 pb-6 border-b border-zinc-700/50'>
					<DialogTitle className='text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent'>
						Add New Song
					</DialogTitle>
					<DialogDescription className='text-zinc-400 text-base'>
						Upload your music and add it to your library
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-6'>
					<input
						type='file'
						accept='audio/*'
						ref={audioInputRef}
						hidden
						onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
					/>

					<input
						type='file'
						ref={imageInputRef}
						className='hidden'
						accept='image/*'
						onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
					/>

					{/* Image upload area */}
					<div className='space-y-3'>
						<label className='flex items-center gap-2 text-sm font-medium text-zinc-300'>
							<Image className='h-4 w-4' />
							Cover Art
						</label>
						<div
							className='relative flex items-center justify-center p-8 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-zinc-800/30 transition-all duration-200 group'
							onClick={() => imageInputRef.current?.click()}
						>
							<div className='text-center'>
								{files.image ? (
									<div className='space-y-3'>
										<div className='p-3 bg-emerald-500/20 rounded-xl inline-block'>
											<Image className='h-8 w-8 text-emerald-400' />
										</div>
										<div>
											<div className='text-emerald-400 font-medium'>Image selected</div>
											<div className='text-zinc-400 text-sm mt-1'>
												{files.image.name.slice(0, 30)}
											</div>
											<div className='text-zinc-500 text-xs'>
												{(files.image.size / (1024 * 1024)).toFixed(2)} MB
											</div>
										</div>
									</div>
								) : (
									<div className='space-y-3'>
										<div className='p-4 bg-zinc-700/50 rounded-xl inline-block group-hover:bg-emerald-500/20 transition-colors'>
											<Upload className='h-8 w-8 text-zinc-400 group-hover:text-emerald-400 transition-colors' />
										</div>
										<div>
											<div className='text-white font-medium mb-2'>Upload Cover Art</div>
											<Button variant='outline' size='sm' className='border-zinc-600 text-zinc-300 hover:bg-zinc-700/50 hover:text-white'>
												Choose Image File
											</Button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Audio upload */}
					<div className='space-y-3'>
						<label className='flex items-center gap-2 text-sm font-medium text-zinc-300'>
							<Music className='h-4 w-4' />
							Audio File
						</label>
						<Button 
							variant='outline' 
							onClick={() => audioInputRef.current?.click()} 
							className='w-full h-14 border-zinc-600 text-zinc-300 hover:bg-zinc-700/50 hover:text-white hover:border-emerald-500/50 transition-all'
						>
							{files.audio ? (
								<div className='flex items-center gap-3'>
									<div className='p-2 bg-emerald-500/20 rounded-lg'>
										<Music className='h-5 w-5 text-emerald-400' />
									</div>
									<div className='text-left'>
										<div className='font-medium'>{files.audio.name.slice(0, 25)}</div>
										<div className='text-sm text-zinc-400'>
											{(files.audio.size / (1024 * 1024)).toFixed(2)} MB
										</div>
									</div>
								</div>
							) : (
								<div className='flex items-center gap-2'>
									<Upload className='h-5 w-5' />
									Choose Audio File
								</div>
							)}
						</Button>
					</div>

					{/* Form Fields */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-3'>
							<label className='flex items-center gap-2 text-sm font-medium text-zinc-300'>
								<Music className='h-4 w-4' />
								Title
							</label>
							<Input
								value={newSong.title}
								onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
								className='bg-zinc-800/50 border-zinc-700/50 text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/50 rounded-xl h-12'
								placeholder='Enter song title'
							/>
						</div>

						<div className='space-y-3'>
							<label className='flex items-center gap-2 text-sm font-medium text-zinc-300'>
								<User className='h-4 w-4' />
								Artist
							</label>
							<Input
								value={newSong.artist}
								onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
								className='bg-zinc-800/50 border-zinc-700/50 text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/50 rounded-xl h-12'
								placeholder='Enter artist name'
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-3'>
							<label className='flex items-center gap-2 text-sm font-medium text-zinc-300'>
								<Clock className='h-4 w-4' />
								Duration (seconds)
							</label>
							<Input
								type='number'
								min='0'
								value={newSong.duration}
								onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
								className='bg-zinc-800/50 border-zinc-700/50 text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/50 rounded-xl h-12'
								placeholder='Duration in seconds'
							/>
						</div>

						<div className='space-y-3'>
							<label className='flex items-center gap-2 text-sm font-medium hover:bg-green-500 text-zinc-300'>
								<Album className='h-4 w-4' />
								Album (Optional)
							</label>
							<Select
								value={newSong.album}
								onValueChange={(value) => setNewSong({ ...newSong, album: value })}
							>
								<SelectTrigger className='bg-zinc-800/50 border-zinc-700/50 text-white focus:border-emerald-500/50 focus:ring-emerald-500/50 rounded-xl h-12'>
									<SelectValue placeholder='Select album' />
								</SelectTrigger>
								<SelectContent className='bg-zinc-800 border-zinc-700 rounded-xl'>
									<SelectItem value='none' className='text-white hover:bg-zinc-700'>
										No Album (Single)
									</SelectItem>
									{albums.map((album) => (
										<SelectItem key={album._id} value={album._id} className='text-white hover:bg-green-700'>
											{album.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DialogFooter className='flex gap-3 pt-6 border-t border-zinc-700/50'>
					<Button 
						variant='outline' 
						onClick={() => setSongDialogOpen(false)} 
						disabled={isLoading}
						className='flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700/50 hover:text-white h-12 rounded-xl'
					>
						Cancel
					</Button>
					<Button 
						onClick={handleSubmit} 
						disabled={isLoading}
						className='flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
					>
						{isLoading ? (
							<div className='flex items-center gap-2'>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
								Uploading...
							</div>
						) : (
							"Add Song"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddSongDialog;