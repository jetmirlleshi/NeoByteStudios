import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'NeoByteStudios — Where AI Meets Imagination'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Subtle gradient accent line at the top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
          }}
        />

        {/* Main title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          NeoByteStudios
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#a0a0b0',
            letterSpacing: '0.05em',
          }}
        >
          Where AI Meets Imagination
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #3b82f6, #7c3aed)',
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  )
}
