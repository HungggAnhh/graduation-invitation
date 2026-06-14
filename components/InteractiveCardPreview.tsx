"use client"

import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'

export interface InteractiveCardPreviewRef {
  triggerDownload: (onComplete: () => void) => void
}

const InteractiveCardPreview = forwardRef<InteractiveCardPreviewRef, { guestName: string }>((props, ref) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'active' | 'success'>('idle')
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Array<{ id: number; left: string; size: string; delay: string; duration: string }>>([])

  // Generate particles on client side
  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        size: `${Math.random() * 3 + 2}px`,
        delay: `${Math.random() * 4}s`,
        duration: `${Math.random() * 4 + 3}s`,
      }))
    )
  }, [])

  useImperativeHandle(ref, () => ({
    triggerDownload: (onComplete: () => void) => {
      if (downloadStatus !== 'idle') return
      setDownloadStatus('active')

      // 1. Tilt and shrink card + golden flash: active state
      // 2. Play checkmark success after flash: success state
      setTimeout(() => {
        setDownloadStatus('success')
      }, 700)

      // 3. Trigger modal popup and download after checkmark completes
      setTimeout(() => {
        onComplete()
        setDownloadStatus('idle')
      }, 1800)
    }
  }))

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || downloadStatus === 'active') return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate mouse position relative to center of card (-1 to 1)
    const xc = rect.width / 2
    const yc = rect.height / 2
    const dx = (x - xc) / xc
    const dy = (y - yc) / yc

    // Maximum rotation angle: 18 degrees
    const rotateX = -dy * 18
    const rotateY = dx * 18

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`

    // Update glare position
    if (glareRef.current) {
      glareRef.current.style.opacity = '1'
      glareRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 55%)`
    }
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease'
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease'
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
    if (glareRef.current) {
      glareRef.current.style.transition = 'opacity 0.6s ease'
      glareRef.current.style.opacity = '0'
    }
  }

  // Determine container styling based on current state
  const getCardTransform = () => {
    if (downloadStatus === 'active') {
      return 'perspective(1000px) rotateX(-15deg) rotateY(5deg) scale3d(0.92, 0.92, 0.92)'
    }
    if (downloadStatus === 'success') {
      return 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1.02, 1.02, 1.02)'
    }
    return undefined // will let inline class animation handle it
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatCard {
          0% {
            transform: translateY(0px) rotateX(1deg) rotateY(-2deg) scale(1);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px rgba(197, 160, 89, 0.1);
          }
          50% {
            transform: translateY(-8px) rotateX(-1deg) rotateY(2deg) scale(1.01);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(197, 160, 89, 0.25);
          }
          100% {
            transform: translateY(0px) rotateX(1deg) rotateY(-2deg) scale(1);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px rgba(197, 160, 89, 0.1);
          }
        }

        @keyframes driftGold {
          0% {
            transform: translateY(20px) translateX(0) scale(0.5);
            opacity: 0;
          }
          40% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-160px) translateX(15px) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes goldFlashAnim {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          40% {
            opacity: 0.9;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }

        @keyframes drawCheckStroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes popCheckScale {
          0%, 100% {
            transform: scale3d(1, 1, 1);
          }
          50% {
            transform: scale3d(1.15, 1.15, 1);
          }
        }
      `}} />

      <div style={{
        position: 'relative',
        width: '100%',
        height: '340px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
      }}>
        {/* Floating golden particles background */}
        {downloadStatus === 'idle' && particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              bottom: '40px',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.6)',
              boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
              animation: `driftGold ${p.duration} ease-in-out ${p.delay} infinite`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        ))}

        {/* Card Component */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            width: '230px',
            height: '320px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fefdfa 0%, #f7f3e6 50%, #eee8d5 100%)',
            border: '2px solid #c5a059',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 30px rgba(197, 160, 89, 0.15)',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            zIndex: 2,
            transition: downloadStatus !== 'idle' ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : undefined,
            transform: getCardTransform(),
            animation: (downloadStatus === 'idle' && !isHovering) ? 'floatCard 4.5s ease-in-out infinite' : undefined,
          }}
        >
          {/* Subtle paper-like grain overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(rgba(139, 92, 26, 0.03) 1px, transparent 0), radial-gradient(rgba(139, 92, 26, 0.02) 1px, transparent 0)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px',
            borderRadius: '14px',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Inner Golden border margin */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: '1px solid rgba(197, 160, 89, 0.45)',
            borderRadius: '10px',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Glare Reflection layer */}
          <div
            ref={glareRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '14px',
              pointerEvents: 'none',
              zIndex: 10,
              opacity: 0,
            }}
          />

          {/* Card Content Container */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 5,
            transform: 'translateZ(20px)', // Create depth for inner text
            textAlign: 'center',
          }}>
            {/* Top Emblem */}
            <div style={{ marginTop: '14px' }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#0a122c" strokeWidth="1.2">
                {/* Graduation Cap */}
                <path d="M22 10L12 5L2 10L12 15L22 10Z" fill="rgba(10, 18, 44, 0.06)" />
                <path d="M6 12.5V16C6 17 8.5 19 12 19C15.5 19 18 17 18 16V12.5" />
                <path d="M21.5 10.5V16.5" />
                {/* Small Tassel details */}
                <circle cx="21.5" cy="17" r="1" fill="#c5a059" />
                <path d="M12 15L12 16" stroke="#c5a059" />
              </svg>
            </div>

            {/* Typography Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <p style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '9px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#c5a059',
                fontWeight: 600,
                margin: 0,
              }}>
                Lễ Tốt Nghiệp
              </p>

              <h4 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0a122c',
                margin: '2px 0 4px 0',
                letterSpacing: '0.02em',
                lineHeight: 1.2,
              }}>
                GRADUATION
              </h4>

              <div style={{
                width: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #c5a059, transparent)',
              }} />

              <p style={{
                fontFamily: '"Great Vibes", cursive',
                fontSize: '26px',
                color: '#c5a059',
                margin: '2px 0',
                lineHeight: 1,
              }}>
                Invitation
              </p>

              <p style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '11px',
                color: '#0a122c',
                letterSpacing: '0.05em',
                fontWeight: 500,
                opacity: 0.85,
                margin: 0,
              }}>
                {props.guestName || 'Thân mời'}
              </p>
            </div>

            {/* Bottom Seal / Emblem */}
            <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '8px',
                letterSpacing: '0.3em',
                color: 'rgba(10, 18, 44, 0.5)',
                fontWeight: 600,
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}>
                Năm 2026
              </p>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #c5a059',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
              }}>
                <span style={{ fontSize: '8px', color: '#0a122c', fontWeight: 'bold' }}>🎓</span>
              </div>
            </div>
          </div>

          {/* Golden Flash Overlay */}
          {downloadStatus === 'active' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '14px',
              background: 'radial-gradient(circle, rgba(255, 235, 120, 0.95) 0%, rgba(212, 175, 55, 0.45) 50%, transparent 100%)',
              zIndex: 15,
              animation: 'goldFlashAnim 0.6s ease-out forwards',
              pointerEvents: 'none',
            }} />
          )}

          {/* Success Checkmark Overlay */}
          {downloadStatus === 'success' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(10, 18, 44, 0.88)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              animation: 'fadeIn 0.3s ease-out forwards',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                animation: 'popCheckScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              }}>
                <svg width="60" height="60" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="24" fill="none" stroke="#c5a059" strokeWidth="2.5" style={{
                    strokeDasharray: 166,
                    strokeDashoffset: 166,
                    animation: 'drawCheckStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards',
                  }} />
                  <path fill="none" stroke="#c5a059" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M15 27.5l7.5 7.5 15-15" style={{
                    strokeDasharray: 48,
                    strokeDashoffset: 48,
                    animation: 'drawCheckStroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards',
                  }} />
                </svg>
                <span style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '12px',
                  color: '#f7f3e6',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>
                  ĐANG TẢI...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
})

InteractiveCardPreview.displayName = 'InteractiveCardPreview'

export default InteractiveCardPreview
