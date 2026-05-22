'use client';
import { twMerge } from "tailwind-merge";

type Props=React.ComponentPropsWithoutRef<"button">

export default function NormalButton({children, className, ...props}:Props){
  return (
    <button className={twMerge(`
      w-fit
      cursor-pointer 
      rounded-full 
      bg-[#4E95D9] 
      text-[#f0f0f0] 
      px-3 py-1
      shadow-[0_5px_0_0_#999999] 
      transition-all 
      duration-100 
      
      active:enabled:translate-y-[4px]
      active:enabled:shadow-[0_1px_0_0]

      disabled:cursor-default 
      disabled:bg-[#909090]
      disabled:shadow-none`
      ,className)}
      {...props}>{children}
    </button>
  )
}