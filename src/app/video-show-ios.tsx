'use client'
import ReactPlayer from 'react-player'
export default function Home() {
  return (
    <div className='w-[50] h-[50] bg-slate-300 rounded-sm'>
      <ReactPlayer controls playing url='https://s3dev-gramick.sgp1.cdn.digitaloceanspaces.com/24carfix/booking/file_e0b305cc-d891-4b84-9b9d-5e83dbddc262.MOV' width={200} height={200}/>
    </div>
  );
}
