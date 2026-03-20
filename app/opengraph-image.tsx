import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Clevis Gikenyi — Full-Stack Software Engineer'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0c0c0a',
          width:  '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top — availability badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#10b981',
          }} />
          <span style={{ color: '#10b981', fontSize: 16, fontWeight: 500 }}>
            Available for new projects and roles
          </span>
        </div>

        {/* Middle — name + title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#f0f0ec',
            lineHeight: 1.05,
            letterSpacing: '-2px',
          }}>
            Clevis Gikenyi
          </div>
          <div style={{
            fontSize: 28,
            color: '#818cf8',
            fontWeight: 500,
            letterSpacing: '-0.5px',
          }}>
            Full-Stack Software Engineer
          </div>
          <div style={{
            fontSize: 20,
            color: '#a8a8a0',
            maxWidth: 640,
            lineHeight: 1.5,
          }}>
            Python · Django · Next.js · React · Cardiff, UK
          </div>
        </div>

        {/* Bottom — projects + award */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { value: '2',    label: 'Production systems' },
              { value: '30+',  label: 'API endpoints' },
              { value: '25+',  label: 'Feature modules' },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#818cf8' }}>{value}</span>
                <span style={{ fontSize: 14, color: '#5a5a52' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#1a1a2e',
            border: '1px solid #3730a3',
            borderRadius: 12,
            padding: '10px 20px',
          }}>
            <span style={{ fontSize: 14, color: '#818cf8' }}>
              Cardiff Award — Best Project 2025
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
