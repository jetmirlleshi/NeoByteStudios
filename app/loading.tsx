export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo wordmark that assembles */}
        <div
          className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06d6a0] bg-clip-text text-transparent"
          style={{
            animation: 'logo-assemble 1.2s ease-out forwards',
          }}
        >
          NeoByteStudios
        </div>

        {/* Glowing progress bar */}
        <div className="w-48 h-1 rounded-full overflow-hidden bg-border-custom">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #06d6a0, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'aurora-shift 1.5s ease-in-out infinite',
              width: '60%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
