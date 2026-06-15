'use client'

import { useRef, useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { CountdownBanner } from '~/components/countdown-banner'
import { Wrapper } from '~/components/wrapper'
import WelcomeOverlay from '~/components/WelcomeOverlay'
import InteractiveCardPreview, { type InteractiveCardPreviewRef } from '~/components/InteractiveCardPreview'

// ==========================================
// CONSTANTS
// ==========================================
const CONTACT_LINKS = [
  {
    label: 'Chỉ đường tới trường',
    href: 'https://maps.app.goo.gl/9bRzpZ4yMcYc4Ecv6',
    icon: '📍',
    isExternal: true,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/vo.mai.hung.anh.2024/',
    icon: '💬',
    isExternal: true,
  },
  {
    label: '0366718765',
    href: 'tel:0366718765',
    icon: '📞',
    isExternal: false,
  },
] as const

const GALLERY_IMAGES = [
  
  { src: '/image9.webp', alt: 'Kỷ niệm 1' },
  { src: '/image2.webp', alt: 'Kỷ niệm 2' },
  { src: '/image3.webp', alt: 'Kỷ niệm 3' },
]

const TARGET_DATE = new Date('2026-06-20T14:30:00+07:00')

// ==========================================
// PARTICLE BACKGROUND
// ==========================================
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; r: number; dx: number; dy: number; o: number; phase: number }[] = []
    const count = Math.min(80, Math.floor(window.innerWidth / 15))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 + p.phase)
        const isGold = p.phase > Math.PI
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = isGold
          ? `rgba(201, 169, 110, ${p.o * twinkle})`
          : `rgba(96, 165, 250, ${p.o * twinkle * 0.7})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

// ==========================================
// AUDIO VISUALIZER BUTTON
// ==========================================
function AudioVisualizer({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barsRef = useRef<number[]>(Array.from({ length: 12 }, () => Math.random() * 0.3 + 0.1))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, 64, 64)
      const cx = 32, cy = 32, r = 24
      const bars = barsRef.current

      // Draw outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(201,169,110,0.2)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw visualizer bars
      for (let i = 0; i < bars.length; i++) {
        const angle = (i / bars.length) * Math.PI * 2 - Math.PI / 2
        if (isPlaying) {
          bars[i] += (Math.random() - 0.5) * 0.15
          bars[i] = Math.max(0.1, Math.min(1, bars[i]))
        } else {
          bars[i] += (0.15 - bars[i]) * 0.08
        }
        const barLen = bars[i] * 10
        const x1 = cx + Math.cos(angle) * (r - 2)
        const y1 = cy + Math.sin(angle) * (r - 2)
        const x2 = cx + Math.cos(angle) * (r - 2 + barLen)
        const y2 = cy + Math.sin(angle) * (r - 2 + barLen)

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, 'rgba(37,99,235,0.8)')
        gradient.addColorStop(1, 'rgba(201,169,110,0.9)')

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      // Inner icon
      ctx.font = '16px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(isPlaying ? '♪' : '🔇', cx, cy + 1)

      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [isPlaying])

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed', bottom: '24px', left: '24px', zIndex: 999,
        background: 'linear-gradient(135deg, rgba(30,36,68,0.85), rgba(15,27,61,0.95))',
        border: '1px solid rgba(201,169,110,0.3)', borderRadius: '50%',
        width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(10px)', cursor: 'pointer', transition: 'all 0.3s', padding: 0,
        boxShadow: isPlaying
          ? '0 0 20px rgba(37,99,235,0.3), 0 0 40px rgba(201,169,110,0.1)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <canvas ref={canvasRef} width={64} height={64} style={{ width: '64px', height: '64px' }} />
    </button>
  )
}

// ==========================================
// VIRTUAL GRADUATION SCROLL (REPLACES VIP TICKET)
// ==========================================
function GraduationScroll({ guestName }: { guestName: string }) {
  const [isOpened, setIsOpened] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isOpened) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  const handleMouseLeave = () => setMousePos({ x: 0.5, y: 0.5 })

  const rotateX = isOpened ? 0 : (mousePos.y - 0.5) * -15
  const rotateY = isOpened ? 0 : (mousePos.x - 0.5) * 15

  const handleOpen = () => {
    if (!isOpened) {
      setIsOpened(true)
      // Burst confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpen}
      style={{
        width: '100%',
        maxWidth: isOpened ? '600px' : '420px',
        margin: '0 auto',
        perspective: '1000px',
        cursor: isOpened ? 'default' : 'pointer',
        transition: 'max-width 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          position: 'relative',
        }}
      >
        {!isOpened ? (
          /* CLOSED SCROLL VIEW */
          <div
            className="closed-scroll-design"
            style={{
              background: 'linear-gradient(135deg, #0e1738 0%, #060b1e 100%)',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '20px',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(37,99,235,0.15)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '260px',
            }}
          >
            {/* Background glowing grid */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* The Scroll Cylindrical Body (drawn horizontally) */}
            <div style={{
              width: '240px',
              height: '50px',
              background: 'linear-gradient(to bottom, #9a1c24 0%, #c82333 30%, #9a1c24 70%, #5a1015 100%)',
              borderRadius: '6px',
              position: 'relative',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'floatScroll 3s ease-in-out infinite',
            }}>
              {/* Left knob */}
              <div style={{
                position: 'absolute', left: '-12px', width: '12px', height: '60px',
                background: 'linear-gradient(to bottom, #c9a96e, #b39255, #c9a96e)',
                borderRadius: '4px 0 0 4px',
                borderRight: '2px solid #5a1015',
                boxShadow: '-3px 4px 10px rgba(0,0,0,0.3)',
              }} />
              <div style={{
                position: 'absolute', left: '-16px', width: '6px', height: '30px',
                background: '#b39255', borderRadius: '3px 0 0 3px',
              }} />

              {/* Right knob */}
              <div style={{
                position: 'absolute', right: '-12px', width: '12px', height: '60px',
                background: 'linear-gradient(to bottom, #c9a96e, #b39255, #c9a96e)',
                borderRadius: '0 4px 4px 0',
                borderLeft: '2px solid #5a1015',
                boxShadow: '3px 4px 10px rgba(0,0,0,0.3)',
              }} />
              <div style={{
                position: 'absolute', right: '-16px', width: '6px', height: '30px',
                background: '#b39255', borderRadius: '0 3px 3px 0',
              }} />

              {/* Gold Ribbon tied in the middle */}
              <div style={{
                width: '32px',
                height: '100%',
                background: 'linear-gradient(90deg, #c9a96e, #e8d5a8, #b39255)',
                position: 'absolute',
                boxShadow: '0 0 8px rgba(0,0,0,0.3)',
              }} />

              {/* Wax Seal / Seal Badge */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #e22d3d 0%, #a81c27 100%)',
                border: '2px solid #c9a96e',
                boxShadow: '0 4px 10px rgba(0,0,0,0.4), 0 0 15px rgba(201,169,110,0.4)',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#fff',
                fontWeight: 'bold',
                zIndex: 3,
              }}
              className="wax-seal-hover"
              >
                🎓
              </div>
            </div>

            {/* Instruction Text */}
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
              color: '#e8d5a8',
              fontWeight: 600,
              marginTop: '40px',
              letterSpacing: '0.05em',
            }}>
              NHẤP ĐỂ MỞ CUỘN THƯ
            </p>
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '11px',
              color: 'rgba(238,240,247,0.4)',
              marginTop: '6px',
            }}>
              Một lời ngỏ đặc biệt dành riêng cho bạn ✨
            </p>
          </div>
        ) : (
          /* OPENED PARCHMENT CERTIFICATE VIEW */
          <div
            style={{
              background: 'linear-gradient(135deg, #fdfbf7 0%, #f5eedc 100%)',
              border: '4px double #c9a96e',
              borderRadius: '16px',
              padding: 'clamp(24px, 6vw, 48px) clamp(20px, 5vw, 40px)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 50px rgba(201,169,110,0.15)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'unrollScroll 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              transformOrigin: 'top center',
              color: '#1c223a',
              textAlign: 'center',
            }}
          >
            {/* Elegant corner ornaments */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderTop: '2px solid #c9a96e', borderLeft: '2px solid #c9a96e' }} />
            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderTop: '2px solid #c9a96e', borderRight: '2px solid #c9a96e' }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderBottom: '2px solid #c9a96e', borderLeft: '2px solid #c9a96e' }} />
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderBottom: '2px solid #c9a96e', borderRight: '2px solid #c9a96e' }} />

            {/* Certificate Header */}
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: '#a38752',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              LỄ TỐT NGHIỆP 2026
            </p>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
              fontWeight: 700,
              color: '#1c2e5a',
              marginBottom: '6px',
            }}>
              CHỨNG NHẬN TRI KỶ
            </h3>
            
            {/* Decorative divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              margin: '16px 0 24px',
            }}>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#c9a96e' }} />
              <span style={{ color: '#c9a96e', fontSize: '14px' }}>❖</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#c9a96e' }} />
            </div>

            {/* Certificate Body */}
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#8d8c89',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              TRÂN TRỌNG CHỨNG NHẬN KHÁCH MỜI
            </p>

            <h4 style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 'clamp(2.2rem, 6.5vw, 3.4rem)',
              color: '#b59452',
              margin: '8px 0 16px',
              lineHeight: 1.2,
            }}>
              {guestName}
            </h4>

            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(14px, 4vw, 17px)',
              lineHeight: 1.8,
              color: '#3c404f',
              maxWidth: '460px',
              margin: '0 auto 28px',
              fontStyle: 'italic',
            }}>
"Mỗi cuộc gặp gỡ đều để lại một dấu ấn. Cảm ơn vì đã trở thành một phần trong thanh xuân của mình."            </p>

            {/* Event Details on Parchment */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              borderTop: '1px solid rgba(201,169,110,0.3)',
              borderBottom: '1px solid rgba(201,169,110,0.3)',
              padding: '16px 0',
              maxWidth: '380px',
              margin: '0 auto 28px',
            }}>
              {[
                { label: 'NGÀY HỘI', value: '20 / 06 / 2026' },
                { label: 'GIỜ ĐÓN', value: '14:30 AM' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '9px', letterSpacing: '0.1em', color: '#8d8c89', textTransform: 'uppercase' }}>{item.label}</p>
                  <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '15px', color: '#1c2e5a', fontWeight: 600, marginTop: '2px' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Signature Area */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '420px',
              margin: '0 auto',
            }}>
              {/* Seal badge */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '1px dashed #b59452',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: '#b59452',
                  transform: 'rotate(-10deg)',
                  background: 'rgba(201,169,110,0.03)',
                }}>
                  🎓
                </div>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '8px', color: '#8d8c89', marginTop: '6px', letterSpacing: '0.1em' }}>GRADUATION 2026</span>
              </div>

              {/* Signature */}
              <div style={{ textAlign: 'center', paddingRight: '20px' }}>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', color: '#8d8c89', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Người gửi tri ân</p>
                <p style={{
                  fontFamily: '"Playfair Display", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: '28px',
                  color: '#1c2e5a',
                  lineHeight: 1.2,
                  marginBottom: '6px',
                }}>
                  Hùng Anh
                </p>
                <div style={{ width: '100px', height: '1px', backgroundColor: 'rgba(201,169,110,0.4)', margin: '0 auto' }} />
              </div>
            </div>

            {/* Roll Up Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpened(false);
              }}
              style={{
                marginTop: '36px',
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(201,169,110,0.4)',
                background: 'transparent',
                color: '#a38752',
                fontFamily: '"Inter", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
              className="roll-up-btn"
            >
              ▲ Cuộn lại thư
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// THIẾT BỊ NHẬP TÊN (NAME INPUT MODAL WITH NATIVE KEYBOARD)
// ==========================================
function LaptopKeyboardModal({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Tự động focus ô nhập tên khi modal hiển thị
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.15) 0%, rgba(8,13,26,0.98) 65%)',
      padding: '20px',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(135deg, rgba(25, 32, 68, 0.85) 0%, rgba(13, 22, 48, 0.95) 100%)',
          border: '1.5px solid rgba(201, 169, 110, 0.3)',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 40px) clamp(20px, 5vw, 32px)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.65), 0 0 50px rgba(37,99,235,0.15)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow decoration */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(96,165,250,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Decorative Badge */}
          <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(37,99,235,0.1))',
          border: '1px solid rgba(201,169,110,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', color: '#c9a96e', marginBottom: '20px',
          boxShadow: '0 0 20px rgba(201,169,110,0.2)',
        }}>
          🎓
          </div>

        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '11px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(96,165,250,0.6)',
          marginBottom: '12px'
          }}>
          Lễ Tốt Nghiệp 2026
        </p>

        <h3 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 600,
          color: '#eef0f7',
          marginBottom: '28px',
          lineHeight: 1.3,
        }}>
          Vui lòng nhập tên của bạn
        </h3>

        {/* Input container */}
        <div style={{ width: '100%', position: 'relative', marginBottom: '8px' }}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 28))}
            placeholder="Nhập tên tại đây..."
            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: '14px',
              background: 'rgba(10, 16, 32, 0.75)',
              border: '1.5px solid rgba(201, 169, 110, 0.25)',
              color: '#eef0f7',
              fontSize: '22px',
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            }}
            className="name-input-glow"
          />
          <style dangerouslySetInnerHTML={{
            __html: `
            .name-input-glow:focus {
              border-color: #c9a96e !important;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), 0 0 15px rgba(201,169,110,0.25), 0 0 30px rgba(37,99,235,0.15) !important;
              background: rgba(14, 22, 44, 0.95) !important;
            }
            .name-input-glow::placeholder {
              color: rgba(238, 240, 247, 0.22);
              font-family: "Inter", sans-serif;
              font-style: normal;
              font-size: 15px;
            }
          `}} />
        </div>

        {/* Character Counter */}
        <p style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          color: 'rgba(96,165,250,0.45)',
          marginBottom: '28px'
        }}>
          {name.length}/28 ký tự
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!name.trim()}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '12px',
            border: 'none',
            background: name.trim()
              ? 'linear-gradient(135deg, #c9a96e 0%, #2563eb 100%)'
              : 'rgba(255, 255, 255, 0.05)',
            color: name.trim() ? '#080d1a' : 'rgba(255,255,255,0.25)',
            fontWeight: 800,
            fontSize: '15px',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: name.trim() ? '0 4px 20px rgba(37,99,235,0.25), 0 0 15px rgba(201,169,110,0.15)' : 'none',
          }}
          onMouseEnter={e => {
            if (name.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,0.45), 0 0 25px rgba(201,169,110,0.3)'
            }
          }}
          onMouseLeave={e => {
            if (name.trim()) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.25), 0 0 15px rgba(201,169,110,0.15)'
            }
          }}
        >
          XÁC NHẬN 🎓
                    </button>
      </form>
    </div>
  )
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function Home() {
  // State
  const [guestName, setGuestName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false)
  const invitationRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [wishText, setWishText] = useState('')
  const [isWishSent, setIsWishSent] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; left: string }[]>([])

  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())


  const cardPreviewRef = useRef<InteractiveCardPreviewRef>(null)
  const [cardBlob, setCardBlob] = useState<Blob | null>(null)

  // Init audio and pre-fetch invitation card image (moved to handleEnterInvitation to optimize initial load)
  useEffect(() => {
    // Deferring large assets for optimized First Contentful Paint
  }, [])

  // Scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id))
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const sections = document.querySelectorAll('[data-animate-section]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [isModalOpen])

  const isSectionVisible = (id: string) => visibleSections.has(id)

  // Handlers
  const handlePreloaderComplete = () => setIsPreloaderComplete(true)

  const handleEnterInvitation = (name: string) => {
    setGuestName(name)
    setIsModalOpen(false)
    setShowWelcomeOverlay(true)

    // Delay loading the 5MB audio loop until the guest enters their name to optimize initial load
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio('/nhac-nen.mp3')
      audio.loop = true
      audioRef.current = audio
    }

    // Delay pre-fetching the invitation card image until after name submission
    fetch('/thiep-moi.webp')
      .then(res => res.blob())
      .then(blob => setCardBlob(blob))
      .catch(err => console.error("Lỗi tải trước thiệp:", err))
  }

  const handleStartInvitation = () => {
    setShowWelcomeOverlay(false)
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 }
    const r = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)
      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: r(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#c9a96e', '#2563eb', '#60a5fa', '#e8d5a8'] })
      confetti({ ...defaults, particleCount, origin: { x: r(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#c9a96e', '#2563eb', '#60a5fa', '#e8d5a8'] })
    }, 250)

    audioRef.current?.play().then(() => setIsPlaying(true)).catch(err => console.warn("Lỗi phát nhạc:", err))
  }

  const handleSendWish = async () => {
    if (!wishText.trim()) return
    setIsWishSent(true)
    setHearts(Array.from({ length: 15 }).map((_, i) => ({ id: Date.now() + i, left: `${Math.random() * 80 + 10}%` })))
    setTimeout(() => setHearts([]), 3000)

    try {
      await fetch(process.env.NEXT_PUBLIC_FORMSPREE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Người_gửi: guestName, Lời_chúc: wishText, Thời_gian: new Date().toLocaleString('vi-VN') })
      })
    } catch (error) { console.error("Lỗi gửi lời chúc:", error) }
  }

  const handleDownloadCard = async () => {
    const fileName = `Thiep_Moi_Tot_Nghiep_${guestName || 'Khach'}.webp`
    const imageUrl = '/thiep-moi.webp'

    // Detect iOS devices
    const isIOS = typeof window !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )

    try {
      // Use pre-fetched blob if available, otherwise fetch dynamically
      let blob = cardBlob
      if (!blob) {
        const response = await fetch(imageUrl)
        blob = await response.blob()
      }

      const file = new File([blob], fileName, { type: 'image/webp' })

      if (isIOS && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Thiệp mời tốt nghiệp',
        })
        return
      }

      if (isIOS) {
        // Fallback for iOS webviews/browsers without navigator.share file support:
        // Open the image in a new tab so the user can long-press to save it
        window.open(imageUrl, '_blank')
        return
      }

      // Default for Android/Desktop: direct download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Lỗi khi tải hoặc chia sẻ thiệp:', error)
      // Hard fallback: open in new tab
      if (isIOS) {
        window.open(imageUrl, '_blank')
      } else {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      }
    }
  }





  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      <ParticleCanvas />
      {/* AUDIO VISUALIZER BUTTON */}
      {!isModalOpen && !showWelcomeOverlay && (
        <AudioVisualizer
          isPlaying={isPlaying}
          onClick={() => {
            if (isPlaying) audioRef.current?.pause()
            else audioRef.current?.play()
            setIsPlaying(!isPlaying)
          }}
        />
      )}

      {/* LAPTOP KEYBOARD MODAL */}
      {isModalOpen && (
        <LaptopKeyboardModal
          onSubmit={(name) => {
            handleEnterInvitation(name)
          }}
        />
      )}

      {/* WELCOME OVERLAY */}
      {showWelcomeOverlay && (
        <WelcomeOverlay
          guestName={guestName}
          backgroundRef={invitationRef}
          onClose={handleStartInvitation}
        />
      )}



      {/* LIGHTBOX */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99990, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,13,26,0.95)', cursor: 'zoom-out', padding: '20px' }}>
          <img src={lightboxImg} alt="Preview" decoding="async" style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '16px', border: '1px solid rgba(201,169,110,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
        </div>
      )}

      {/* MAIN CONTENT (with click-to-firework) */}
      <Wrapper theme="light" className="overflow-x-clip z-10" onPreloaderComplete={handlePreloaderComplete}>
        {!isModalOpen && guestName && (
          <div
            ref={invitationRef}
            style={{
              position: 'relative',
              zIndex: 1,
              filter: showWelcomeOverlay ? 'blur(12px)' : 'none',
              WebkitFilter: showWelcomeOverlay ? 'blur(12px)' : 'none',
              transform: showWelcomeOverlay ? 'scale(1.03)' : 'scale(1)',
              opacity: showWelcomeOverlay ? 0.5 : 1,
              transition: 'filter 0.8s ease-out, -webkit-filter 0.8s ease-out, transform 0.8s ease-out, opacity 0.8s ease-out',
            }}
            onClick={(e) => {
              // Click-to-firework: click anywhere to launch fireworks
              const target = e.target as HTMLElement
              if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('button') || target.closest('a')) return
              const x = e.clientX / window.innerWidth
              const y = e.clientY / window.innerHeight
              confetti({
                particleCount: 30, spread: 60, startVelocity: 20,
                origin: { x, y }, colors: ['#c9a96e', '#2563eb', '#60a5fa', '#e8d5a8'],
                gravity: 0.8, ticks: 80, zIndex: 99999,
              })
            }}
          >

            {/* ===== HERO SECTION ===== */}
            <section
              id="hero" data-animate-section
              style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                padding: '40px 20px', position: 'relative',
                opacity: isSectionVisible('hero') ? 1 : 0,
                transform: isSectionVisible('hero') ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s ease-out',
              }}
            >
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '13px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(96,165,250,0.6)', marginBottom: '20px' }}>
                Lễ Tốt Nghiệp 2026
              </p>

              <h1 style={{
                fontFamily: '"Playfair Display", serif', fontWeight: 700,
                fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', lineHeight: 1.1,
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #e8d5a8 0%, #c9a96e 40%, #60a5fa 70%, #c9a96e 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmerGold 4s linear infinite',
              }}>
                Hùng Anh
              </h1>

              <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, #2563eb, #c9a96e)', margin: '0 auto 24px', borderRadius: '2px' }} />

              <p style={{
                fontFamily: '"Inter", sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: '#eef0f7', maxWidth: '600px', lineHeight: 1.7, marginBottom: '10px',
              }}>
                Xin chào, <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 600, fontSize: '1.45em', color: '#c9a96e' }}>{guestName}</span>
              </p>

              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: 'rgba(238,240,247,0.65)', maxWidth: '550px', lineHeight: 1.8, marginBottom: '40px' }}>
                Sau một hành trình dài với nhiều kỷ niệm và cố gắng, mình rất vui khi được chia sẻ khoảnh khắc đặc biệt này cùng bạn.
              </p>

              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scanlineTech {
                  0% { background-position: 0% -100%; }
                  100% { background-position: 0% 200%; }
                }
              `}} />
              <div style={{
                position: 'relative', width: '90%', maxWidth: '340px', aspectRatio: '340 / 476',
                borderRadius: '170px 170px 20px 20px', overflow: 'hidden',
                border: '2px solid rgba(201,169,110,0.3)',
                boxShadow: '0 20px 60px rgba(37,99,235,0.15), 0 0 80px rgba(201,169,110,0.08), inset 0 0 40px rgba(37,99,235,0.2)',
                margin: '0 auto'
              }}>
                {/* Tech HUD Corners */}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '25px', borderBottom: '3px solid rgba(96,165,250,0.8)', borderLeft: '3px solid rgba(96,165,250,0.8)', zIndex: 10, borderRadius: '0 0 0 6px' }} />
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '25px', height: '25px', borderBottom: '3px solid rgba(96,165,250,0.8)', borderRight: '3px solid rgba(96,165,250,0.8)', zIndex: 10, borderRadius: '0 0 6px 0' }} />

                {/* Scanning Laser Line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(96,165,250,0.1) 10%, rgba(96,165,250,0.6) 50%, rgba(96,165,250,0.1) 90%, transparent 100%)',
                  backgroundSize: '100% 15%', backgroundRepeat: 'no-repeat',
                  animation: 'scanlineTech 3s ease-in-out infinite', zIndex: 5, pointerEvents: 'none',
                }} />
                {/* Image */}
                <img src="/image9.webp" alt="Graduation" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ marginTop: '60px', animation: 'floatSlow 3s ease-in-out infinite' }}>
                <span style={{ fontSize: '14px', color: 'rgba(96,165,250,0.4)', letterSpacing: '0.2em', fontFamily: '"Inter", sans-serif' }}>CUỘN XUỐNG</span>
                <div style={{ marginTop: '8px', width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(96,165,250,0.3), transparent)', margin: '8px auto 0' }} />
              </div>
            </section>

            {/* ===== COUNTDOWN ===== */}
            <section
              id="countdown" data-animate-section
              style={{
                padding: '80px 20px', textAlign: 'center',
                opacity: isSectionVisible('countdown') ? 1 : 0,
                transform: isSectionVisible('countdown') ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              <div className="section-divider" style={{ marginBottom: '60px' }} />
              <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '12px', color: 'rgba(96,165,250,0.5)', marginBottom: '12px' }}>Đếm ngược</p>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600, marginBottom: '40px' }} className="gold-text">
                Sự kiện đã diễn ra!
              </h2>
              <CountdownBanner targetDate={TARGET_DATE} isActive={isPreloaderComplete} />
            </section>

            {/* ===== EVENT DETAILS ===== */}
            <section
              id="event" data-animate-section
              style={{
                padding: '60px 20px 80px', maxWidth: '800px', margin: '0 auto',
                opacity: isSectionVisible('event') ? 1 : 0,
                transform: isSectionVisible('event') ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              <div className="section-divider" style={{ marginBottom: '60px' }} />
              <div className="glass-card" style={{ padding: 'clamp(28px, 5vw, 48px)', textAlign: 'center' }}>
                <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '11px', color: 'rgba(96,165,250,0.5)', marginBottom: '20px' }}>Chi tiết sự kiện</p>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 600, marginBottom: '28px' }} className="gold-text">
                  Lễ Tốt Nghiệp
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                  {[
                    { icon: '📅', label: 'Ngày', value: 'Thứ Bảy, 20/06/2026' },
                    { icon: '⏰', label: 'Giờ', value: '14:30 - 16:00 chiều' },
                    { icon: '🏫', label: 'Địa điểm', value: 'Đại học Nguyễn Tất Thành (NTTU) Cơ sở Quận 12' },
                  ].map((item) => (
                    <div key={item.label} style={{
                      padding: '20px', borderRadius: '16px',
                      background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.1)',
                    }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(96,165,250,0.5)', marginBottom: '6px' }}>{item.label}</p>
                      <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '15px', color: '#e8d5a8', fontWeight: 500 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                  {CONTACT_LINKS.map((link) => (
                    <a key={link.label} href={link.href} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        padding: '14px 20px', borderRadius: '12px',
                        background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(201,169,110,0.15)',
                        color: '#eef0f7', fontFamily: '"Inter", sans-serif', fontSize: '14px',
                        textDecoration: 'none', transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.2)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.4)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.15)' }}
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                      <span style={{ marginLeft: 'auto', opacity: 0.4 }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== GALLERY ===== */}
            <section
              id="gallery" data-animate-section
              style={{
                padding: '40px 20px 80px', maxWidth: '1000px', margin: '0 auto',
                opacity: isSectionVisible('gallery') ? 1 : 0,
                transform: isSectionVisible('gallery') ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              <div className="section-divider" style={{ marginBottom: '60px' }} />
              <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '12px', color: 'rgba(96,165,250,0.5)', marginBottom: '12px', textAlign: 'center' }}>Kỷ niệm</p>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600, marginBottom: '40px', textAlign: 'center' }} className="gold-text">
                Những Khoảnh Khắc
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
                gap: '16px',
              }}>
                {GALLERY_IMAGES.map((img) => (
                  <div key={img.src} onClick={() => setLightboxImg(img.src)} style={{
                    borderRadius: '16px', overflow: 'hidden', cursor: 'zoom-in',
                    aspectRatio: '3/4',
                    border: '1px solid rgba(201,169,110,0.1)',
                    transition: 'all 0.4s', position: 'relative',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.4)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.1)' }}
                  >
                    <img src={img.src} alt={img.alt} decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>

            {/* ===== VIRTUAL GRADUATION SCROLL ===== */}
            <section
              id="graduation-scroll" data-animate-section
              style={{
                padding: '40px 20px 80px', textAlign: 'center',
                opacity: isSectionVisible('graduation-scroll') ? 1 : 0,
                transform: isSectionVisible('graduation-scroll') ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
              }}
            >
              <div className="section-divider" style={{ marginBottom: '60px' }} />
              <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '12px', color: 'rgba(96,165,250,0.5)', marginBottom: '12px' }}>Dành riêng cho bạn</p>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600, marginBottom: '12px' }} className="gold-text">
                Cuộn Thư Tri Kỷ
              </h2>
              <p style={{ fontFamily: '"Inter", sans-serif', color: 'rgba(238,240,247,0.45)', fontSize: '14px', marginBottom: '36px', maxWidth: '400px', margin: '0 auto 36px' }}>
                Nhấp vào cuộn thư để mở rộng lời nhắn đặc biệt dành riêng cho bạn ✨
              </p>
              <GraduationScroll guestName={guestName} />
            </section>
            {/* ===== WISHES & CARD ===== */}
            <section
              id="wishes" data-animate-section
              style={{
                padding: '40px 20px 80px', maxWidth: '860px', margin: '0 auto',
                opacity: isSectionVisible('wishes') ? 1 : 0,
                transform: isSectionVisible('wishes') ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              <div className="section-divider" style={{ marginBottom: '60px' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', textAlign: 'center' }}>
                <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '12px', color: 'rgba(96,165,250,0.5)', marginBottom: '12px' }}>Kỷ niệm & Tương tác</p>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600 }} className="gold-text">
                  Thiệp Mời & Lời Chúc 💌
                </h2>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'center', width: '100%' }}>
                {/* CARD 1: TẢI THIỆP MỜI */}
                <div className="glass-card" style={{ flex: '1 1 360px', maxWidth: '400px', minWidth: '280px', padding: 'clamp(24px, 4vw, 36px)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                  <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '11px', color: 'rgba(96,165,250,0.5)', marginBottom: '12px' }}>QUÀ TẶNG</p>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', fontWeight: 600, marginBottom: '16px' }} className="gold-text">
                    Tải Thiệp Mời 🎓
                  </h3>
                  <p style={{ fontFamily: '"Inter", sans-serif', color: 'rgba(238,240,247,0.5)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', textAlign: 'center' }}>
                    Nhấp vào nút bên dưới để tải thiệp mời đặc biệt (bản động) về điện thoại của bạn.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', marginTop: 'auto' }}>
                    <InteractiveCardPreview ref={cardPreviewRef} guestName={guestName} />
                    <button
                      type="button"
                      onClick={() => {
                        cardPreviewRef.current?.triggerDownload(() => {})
                        handleDownloadCard()
                      }}
                      style={{
                        width: '100%', padding: '16px 24px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2563eb, #1a2f6b)',
                        border: '1px solid rgba(201,169,110,0.3)',
                        color: '#eef0f7', fontFamily: '"Inter", sans-serif', fontWeight: 600,
                        fontSize: '15px', cursor: 'pointer', transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(37,99,235,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(37,99,235,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,99,235,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                    >
                      Tải thiệp mời 🎓
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* CARD 2: GỬI LỜI CHÚC */}
                <div className="glass-card" style={{ flex: '1 1 360px', maxWidth: '400px', minWidth: '280px', padding: 'clamp(24px, 4vw, 36px)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                  {hearts.map(heart => (
                    <div key={heart.id} className="flying-heart" style={{ position: 'absolute', left: heart.left, bottom: '20px', fontSize: '24px', pointerEvents: 'none' }}>❤️</div>
                  ))}

                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <p style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '11px', color: 'rgba(96,165,250,0.5)', marginBottom: '12px' }}>GUESTBOOK</p>
                    <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', fontWeight: 600, marginBottom: '16px' }} className="gold-text">
                      Gửi Lời Chúc ✍️
                    </h3>

                    {!isWishSent ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                        <p style={{ fontFamily: '"Inter", sans-serif', color: 'rgba(238,240,247,0.5)', fontSize: '14px', lineHeight: 1.6, marginBottom: '4px' }}>
                          Hãy gửi một lời chúc hoặc lời nhắn gửi của riêng bạn tới mình nhé!
                        </p>
                        <textarea
                          value={wishText} onChange={(e) => setWishText(e.target.value)}
                          placeholder="Viết lời chúc cho mình nhé..."
                          style={{
                            width: '100%', minHeight: '120px', padding: '16px',
                            background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(201,169,110,0.15)',
                            borderRadius: '12px', color: '#eef0f7', outline: 'none', resize: 'none',
                            boxSizing: 'border-box', fontSize: '15px', fontFamily: '"Inter", sans-serif',
                            transition: 'border-color 0.3s',
                          }}
                          onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(37,99,235,0.5)' }}
                          onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(201,169,110,0.15)' }}
                        />
                        <button
                          type="button"
                          onClick={handleSendWish} disabled={!wishText.trim()}
                          style={{
                            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                            background: wishText.trim() ? 'linear-gradient(135deg, #c9a96e, #2563eb)' : 'rgba(255,255,255,0.05)',
                            color: wishText.trim() ? '#080d1a' : 'rgba(255,255,255,0.3)',
                            fontWeight: 700, fontSize: '15px', cursor: wishText.trim() ? 'pointer' : 'not-allowed',
                            fontFamily: '"Inter", sans-serif', transition: 'all 0.3s',
                            boxShadow: wishText.trim() ? '0 4px 20px rgba(201,169,110,0.2)' : 'none',
                            marginTop: 'auto'
                          }}
                        >
                          Gửi lời chúc ✨
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px 0', animation: 'fadeIn 0.5s ease-out' }}>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#e8d5a8', marginBottom: '12px' }}>Đã gửi thành công! 🎉</p>
                        <p style={{ color: 'rgba(96,165,250,0.9)', fontSize: '15px', lineHeight: 1.6, textAlign: 'center' }}>
                          Cảm ơn lời chúc tuyệt vời của <span style={{ color: '#c9a96e', fontWeight: 'bold' }}>{guestName}</span> nha!
                        </p>
                        <div style={{ fontSize: '48px', marginTop: '20px', animation: 'floatSlow 3s ease-in-out infinite' }}>❤️</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={{ padding: '40px 20px 60px', textAlign: 'center' }}>
              <div className="section-divider" style={{ marginBottom: '40px' }} />
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 500, marginBottom: '12px' }} className="gold-text">
                Cảm ơn bạn
              </p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '13px', color: 'rgba(238,240,247,0.35)', lineHeight: 1.8, maxWidth: '400px', margin: '0 auto 20px' }}>
                Hy vọng <span style={{ color: '#c9a96e' }}>{guestName}</span> sẽ đến và cùng mình lưu giữ những khoảnh khắc đáng nhớ ❤️
              </p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(238,240,247,0.2)', letterSpacing: '0.2em' }}>
                © 2026 Hùng Anh — GRADUATION
              </p>
            </footer>

          </div>
        )}
      </Wrapper>
    </>
  )
}