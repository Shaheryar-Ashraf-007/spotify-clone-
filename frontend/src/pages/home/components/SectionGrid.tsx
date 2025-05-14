import { Song } from '../../../types/index';


interface SectionGridProps {
  title: string;
  songs: Song[];
}

const SectionGrid = ({title, songs}:SectionGridProps) => {

  console.log(title, songs);
  return (
    <div>SectionGrid</div>
  )
}

export default SectionGrid