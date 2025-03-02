"use client";
import { Progress } from 'rsuite';
export default function ProgressCircle() {
  <div className='flex justify-center'>
    <Progress.Circle className="w-40 " strokeColor="#ffc107" trailColor="#222423" percent={30} />
  </div>
}
