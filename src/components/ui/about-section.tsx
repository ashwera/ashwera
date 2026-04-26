import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CARDS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=600', rotate: -24 },
  { id: 2, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400&h=600', rotate: -12 },
  { id: 3, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400&h=600', rotate: 0 },
  { id: 4, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=600', rotate: 12 },
  { id: 5, image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400&h=600', rotate: 24 },
];

const AboutSection: React.FC = () => {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Transition out the intro after 1.5 seconds
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col uppercase selection:bg-black selection:text-white text-[#060606]">

      {/* --- INTRO PRELOADER OVERLAY --- */}
      <motion.div
        className="fixed inset-0 z-50 bg-[#808080]"
        initial={{ y: 0 }}
        animate={{ y: introFinished ? "-100vh" : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      />

      {/* INTRO LOGO (ANIMATES TO THE SIDE) */}
      <motion.div
        className="fixed z-[60] flex items-center justify-center border-4 border-dashed border-[#F5F1E9]/80 rounded-full"
        initial={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: "160px",
          height: "160px",
        }}
        animate={{
          top: introFinished ? "24px" : "50%",
          left: introFinished ? "24px" : "50%",
          x: introFinished ? "0%" : "-50%",
          y: introFinished ? "0%" : "-50%",
          width: introFinished ? "60px" : "160px",
          height: introFinished ? "60px" : "160px",
        }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        <span className="text-[#F5F1E9] text-xs font-bold tracking-widest text-center">LOGO</span>
      </motion.div>


      {/* --- HERO SECTION WITH BG IMAGE (NO WHITESPACE, NO ANIMATION) --- */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0">
          <img
            src="/about/image.png"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-20 flex flex-col md:flex-row items-center justify-center md:justify-between pt-24 md:pt-0 gap-8 md:gap-0">
          {/* Left Side: Heading (Was Right) */}
          <div className="w-full md:w-[50%] flex flex-col text-left order-1">
            <h2 
              className="text-[clamp(3.5rem,7vw,7.5rem)] tracking-tighter leading-[0.85] text-[#F5F1E9] normal-case"
              style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}
            >
              AssalamuAlaikum!<br />I’m Ashwera
            </h2>
          </div>

          {/* Right Side: CS Undergrad Text (Was Left) */}
          <div className="w-full md:w-[45%] flex flex-col text-left md:text-right justify-center order-2 mt-4 md:mt-0">
            <p className="text-[clamp(1.5rem,2.5vw,2.5rem)] font-bold tracking-tight leading-[1.2] text-[#F5F1E9] normal-case">
              A CS undergrad hungry to learn, thriving on code and 142 test cases.
            </p>
            <div className="h-[2px] w-16 bg-white/40 my-6 rounded-full self-start md:self-end"></div>
            <p className="text-[clamp(1.1rem,1.8vw,1.6rem)] font-medium tracking-tight leading-[1.4] text-gray-300 normal-case">
              I learn fast, build things, and break them better.
            </p>
          </div>

        </div>
      </div>


      {/* --- BODY TEXT AND CARDS (BELOW HERO) --- */}
      <div className="w-full flex flex-col items-center pt-10 pb-24 md:pt-16 md:pb-40">

        {/* Body Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.04 } }
          }}
          className="flex flex-col items-center w-full max-w-4xl px-6 md:px-8 text-center mb-16 md:mb-24"
        >
          <div className="w-12 md:w-20 h-[2px] bg-[#0d0d0d]/30 mb-8 md:mb-12 rounded-full"></div>

          <p className="text-[clamp(1.1rem,2vw,1.75rem)] font-medium tracking-wide leading-[1.6] text-[#232323] flex flex-wrap justify-center overflow-hidden">
            {"I’M A FULL-STACK DEVELOPER FOCUSED ON BUILDING SYSTEMS THAT HOLD UP UNDER PRESSURE. FROM BACKEND-HEAVY APPLICATIONS TO DATA-DRIVEN WORKFLOWS, I CARE ABOUT PERFORMANCE, EDGE CASES, AND REAL-WORLD USABILITY. I ENJOY ADDING THE COMPETITIVE PROGRAMMING EDGE TO MY PROJECTS, LEVELLING UP OPTIMIZATION LIKE TARGETED GAMEPLAY.".split(" ").map((word, i) => (
              <span key={i} className="overflow-hidden inline-block mr-[0.25em] mb-[0.2em]">
                <motion.span
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>

          <div className="w-12 md:w-20 h-[2px] bg-[#0d0d0d]/30 mt-8 md:mt-12 rounded-full"></div>
        </motion.div>

        {/* Cards Spread Out */}
        <div className="relative w-full max-w-5xl h-[300px] sm:h-[400px] md:h-[500px] flex justify-center items-end mt-10">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              className="absolute bottom-0 w-[140px] sm:w-[200px] md:w-[260px] aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/20 cursor-pointer transition-all duration-500 hover:!grayscale-0 hover:!z-50 hover:-translate-y-12 sm:hover:-translate-y-16"
              style={{
                transformOrigin: '50% 150%',
                // Use inline styles for initial grayscale so the transition applies smoothly on hover
                filter: 'grayscale(100%)',
              }}
              initial={{ rotate: 0, y: 100, opacity: 0 }}
              whileInView={{ rotate: card.rotate, y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 12,
                delay: i * 0.1
              }}
            >
              <img
                src={card.image}
                alt={`Card ${card.id}`}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Red overlay to tie into the brand colors, fades out on hover */}
              <div className="absolute inset-0 bg-[#E21F26]/10 mix-blend-multiply opacity-100 transition-opacity duration-500 hover:opacity-0"></div>
            </motion.div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default AboutSection;
