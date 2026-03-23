import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastStyles = `
  .Toastify__toast-container {
    z-index: 99999 !important;
  }
  .Toastify__toast {
    background: #0d0d2b !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 14px !important;
    color: #fff !important;
    font-size: 14px !important;
    font-family: inherit !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
    padding: 14px 16px !important;
  }
  .Toastify__toast--success {
    border-left: 3px solid #6ee7b7 !important;
  }
  .Toastify__toast--error {
    border-left: 3px solid #fca5a5 !important;
  }
  .Toastify__toast--success .Toastify__toast-icon svg { fill: #6ee7b7; }
  .Toastify__toast--error .Toastify__toast-icon svg { fill: #fca5a5; }
  .Toastify__toast-body { color: #f1f1f1 !important; font-weight: 500; }
  .Toastify__progress-bar {
    background: linear-gradient(90deg, rgba(9,9,121,1), rgba(99,102,241,1)) !important;
  }
  .Toastify__close-button { color: rgba(255,255,255,0.4) !important; }
`;

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [stars, setStars] = useState([]);
  const [status, setStatus] = useState("idle");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const starArray = [];
    for (let i = 0; i < 220; i++) {
      starArray.push({
        id: i,
        size: Math.random() * 2 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 3 + 3,
      });
    }
    setStars(starArray);
  }, []);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!userType) {
      toast.error("Please select your role before joining.");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      // const response = await fetch("https://backend-lp.onrender.com/api/waitlist/join", {
        const response = await fetch("http://localhost:4000/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, user_type: userType, phoneNumber }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data = {};
      const contentType = response.headers.get("content-type");
      if (response.status !== 204 && contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        setStatus("success");
        toast.success(" You're on the waitlist! We'll be in touch.");
        setEmail("");
        setPhoneNumber("");
        setUserType("");
      } else {
        setStatus("idle");
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Submission error:", err);
      setStatus("idle");
      if (err.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error("Could not connect to the server. Please check your internet and try again.");
      }
    }
  };

  return (
    <div className="h-[100dvh] relative overflow-hidden text-white flex flex-col bg-black">
      <style>{toastStyles}</style>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{ zIndex: 99999 }}
      />

      {/* STARS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute bg-white rounded-full"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.left}%`,
              top: `${s.top}%`,
              opacity: isMobile ? s.opacity : 1,
              animation: isMobile ? `twinkle ${s.duration}s infinite ease-in-out` : "none",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col h-screen">

        {/* HEADER — DESKTOP ONLY */}
        <header className="hidden sm:flex px-6 sm:px-12 lg:px-20 pt-6 justify-between items-center">
          <img
            src={logo}
            alt="FoundU Logo"
            className="h-14 md:h-16 lg:h-20 xl:h-24 w-auto drop-shadow-[0_0_14px_rgba(255,255,255,0.35)]"
          />
        </header>

        {/* MAIN */}
        <main className="flex-1 flex flex-col items-center px-6 sm:px-12 lg:px-20 py-10 sm:py-20 relative z-20 sm:justify-between">

          {/* TOP SECTION */}
          <div className="text-center w-full max-w-5xl mt-6 sm:-mt-6 lg:-mt-10">

            {/* MOBILE LOGO */}
            <div className="flex sm:hidden justify-center mb-6">
              <img
                src={logo}
                alt="FoundU Logo"
                className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </div>

            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-medium text-gray-500 mb-6 backdrop-blur-md uppercase tracking-[0.2em]">
              Waitlist • Coming Soon
            </div>

            <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold leading-[1.1] mb-6 tracking-tight text-white px-5 sm:px-0">
              Good things come <br /> to those <span className="italic font-serif text-indigo-200/90">who wait.</span>
            </h1>

            <p className="max-w-xl mx-auto text-sm sm:text-lg text-gray-400 mb-8 leading-relaxed font-light px-5 sm:px-0">
              FoundU is the ultimate platform to find your startup match. <br className="hidden sm:block" />
              Build the hype and join the elite waitlist today.
            </p>
          </div>

          {/* BOTTOM SECTION — form */}
          <div className="
  w-[92vw] sm:max-w-2xl
  mx-auto pb-8 sm:pb-16 z-30
">
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-2 sm:p-3 rounded-[2rem] shadow-2xl">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-1.5 sm:gap-2"
              >
                {/* Line 1 (Mobile) */}
                <div className="flex gap-1.5 sm:contents">
                  {/* Role */}
                  <div className="relative flex-shrink-0">
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="
                        w-[72px] sm:w-40 px-2 sm:px-5 py-3 sm:py-4 rounded-2xl
                        bg-white/5
                        border border-white/10
                        text-white appearance-none
                        focus:outline-none focus:ring-2 focus:ring-white/10
                        cursor-pointer text-[11px] sm:text-sm
                      "
                    >
                      <option value="" disabled className="bg-[#020024]">Role</option>
                      <option value="freelancer" className="bg-[#020024]">Freelancer</option>
                      <option value="cofounder" className="bg-[#020024]">Co-founder</option>
                      <option value="founder" className="bg-[#020024]">Founder</option>
                      <option value="influencer" className="bg-[#020024]">Influencers</option>
                    </select>
                    <span className="absolute top-2 right-2 text-red-500 select-none pointer-events-none">*</span>
                  </div>

                  <div className="flex-1 relative min-w-0">
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        w-full px-3 sm:px-6 py-3 sm:py-4 rounded-2xl
                        bg-white/5
                        border border-white/10
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-white/10
                        text-[11px] sm:text-sm
                      "
                    />
                    <span className="absolute top-2 right-3 text-red-500 select-none pointer-events-none">*</span>
                  </div>
                </div>

                {/* Line 2 (Mobile) */}
                <div className="flex gap-1.5 sm:contents">
                  <div className="flex-1 relative min-w-0">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="
                        w-full px-3 sm:px-6 py-3 sm:py-4 rounded-2xl
                        bg-white/5
                        border border-white/10
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-white/10
                        text-[11px] sm:text-sm
                      "
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="
                      flex-shrink-0 px-3 sm:px-8 py-3 sm:py-4 rounded-2xl
                      bg-white text-black
                      font-bold text-[11px] sm:text-sm
                      hover:bg-indigo-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      whitespace-nowrap
                    "
                  >
                    <span className="sm:hidden">{status === "loading" ? "..." : "Notify"}</span>
                    <span className="hidden sm:inline">{status === "loading" ? "Joining..." : "Get Notified"}</span>
                  </button>
                </div>
              </form>
            </div>

            <p className="mt-4 text-center text-[10px] sm:text-xs text-gray-400 font-medium tracking-widest uppercase opacity-80">
              Created by <span className="text-gray-200">FoundU Team</span>
            </p>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="relative z-20 px-6 sm:px-12 lg:px-20 pb-6 sm:pb-8 text-center text-sm text-gray-500 font-medium">
          © {new Date().getFullYear()} FoundU. All rights reserved.
        </footer>
      </div>

      {/* Outer diffuse purple glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[1] pointer-events-none"
        style={{
          bottom: "-10%",
          width: "80%",
          height: "40%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(80, 40, 160, 0.55) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* PLANET ARC — perfect circle, only rim visible */}
      <div
        className="planet-arc absolute left-1/2 -translate-x-1/2 z-[2] rounded-[100%] pointer-events-none"
        style={{
          width: "280vw",
          height: "280vw",
          bottom: "-252vw",
          background: "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
        }}
      >
        {/* Atmospheric glow rim */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "18%",
            borderRadius: "100%",
            background: "radial-gradient(ellipse at 50% 0%, rgba(80, 60, 200, 0.35) 0%, transparent 100%)",
            filter: "blur(22px)",
          }}
        />
      </div>

      <style>{`
        @media (min-width: 640px) {
          .planet-arc {
            width: 180vw !important;
            height: 180vw !important;
            bottom: -158vw !important;
          }
        }
        @media (min-width: 1024px) {
          .planet-arc {
            width: 160vw !important;
            height: 160vw !important;
            bottom: -138vw !important;
          }
        }
      `}</style>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-twinkle {
          animation: twinkle 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;