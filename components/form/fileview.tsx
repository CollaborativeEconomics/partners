import React, { forwardRef, HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
//import Image from 'next/image';

interface FileProps {
  id?: string;
  source?: string;
  className?: string;
  width?: number;
  height?: number;
  register: UseFormRegisterReturn;
}

function onPreviewFile(event){
  console.log('PREVIEW!', event)
  const file = event?.target?.files[0];
  if(!file){ return }
  const reader = new FileReader();
  reader.onload = function(e) {
    console.log('READER!', e)
    //document.getElementById('file-image').setAttribute('src', e.target.result.toString());
    const img = document.getElementById('file-image') as HTMLInputElement
    //img.src = e.target.result;
    img.setAttribute('src', e.target.result.toString())
  }
  reader.readAsDataURL(file);
}

const FileView = forwardRef(
  (
    {
      id,
      source,
      className,
      width,
      height,
      register,
      ...props
    }: FileProps & HTMLProps<HTMLInputElement>,
    ref
  ) => {
    if(!width){ width = 250 }
    if(!height){ height = 250 }
    const size = `w-[${width}px] h-[${height}px]`
    return (
    <div className={`relative ${size} mt-4 mb-4 ${className ?? ''}`} >
      <input type="file" id={id} ref={ref} {...props} {...register} onChange={(event)=>onPreviewFile(event)} className="block absolute top-0 left-0 w-full h-full opacity-0 z-10 cursor-pointer" />
      <img id="file-image" className="mx-auto w-64 h-64" src={source} width={width} height={height} alt="profile picture" />
    </div>
  )}
);

FileView.displayName = 'FileView';

export default FileView;
