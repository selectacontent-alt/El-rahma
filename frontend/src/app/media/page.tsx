"use client";

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../App'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950">
      <div className="relative mb-4 flex h-24 w-40 items-center justify-center sm:h-32 sm:w-48">
        <img
          src="/logo.png"
          alt="Loading..."
          className="absolute inset-0 h-full w-full object-contain opacity-10 grayscale blur-[1px]"
        />
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden"
          style={{ animation: 'fillUp 2.5s cubic-bezier(0.4 0 0.2 1) infinite alternate' }}
        >
          <div className="relative h-24 w-40 sm:h-32 sm:w-48">
            <img
              src="/logo.png"
              alt="Loading Filled"
              className="absolute bottom-0 left-0 h-full w-full object-contain drop-shadow-[0_0_15px_rgba(157,2,124,0.5)]"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-[#9d027c]" style={{ animation: 'dotGrow 1.5s infinite 0ms' }} />
        <div className="h-2.5 w-2.5 rounded-full bg-[#9d027c]" style={{ animation: 'dotGrow 1.5s infinite 200ms' }} />
        <div className="h-2.5 w-2.5 rounded-full bg-[#9d027c]" style={{ animation: 'dotGrow 1.5s infinite 400ms' }} />
      </div>
    </div>
  )
});

export default function MediaPage() {
  return <App />;
}
