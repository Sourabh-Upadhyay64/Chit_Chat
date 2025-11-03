import React from 'react'

const logo = () => {
  return (
   <>
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="loveChat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff4b6e; stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff8fb1; stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="200" height="200" rx="40" fill="url(#loveChat)" />

  <path d="M50 80 Q50 60 70 60 H130 Q150 60 150 80 V120 Q150 140 130 140 H70 Q50 140 50 120 Z"
        fill="#fff" />

  <path d="M100 105 C85 90 70 105 80 120 C90 135 110 135 120 120 C130 105 115 90 100 105 Z"
        fill="url(#loveChat)" />

  <circle cx="80" cy="95" r="6" fill="url(#loveChat)" />
  <circle cx="120" cy="95" r="6" fill="url(#loveChat)" />
</svg>

   </>
  )
}

export default logo;