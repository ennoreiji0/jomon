'use client';
import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props{
  href:string;
  target?:string
  children:ReactNode;
  className?:string
}

export default function MyLink({href,target,children,className}:Props){
  return (
    href.startsWith('http') ? 
    <a 
      href={href} 
      className={twMerge(`
        text-[#5192fb]
        font-bold 
        underline`
        ,className)} 
      target={target}>{children}</a> : <Link 
      href={href} className={twMerge(`
        text-[#5192fb]
        font-bold 
        underline`
        ,className)}>{children}</Link>
  )
}