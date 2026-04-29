import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LinkPreview } from "@/components/ui/link-preview";

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
        className="fixed inset-0 z-50 bg-[#060606]"
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
        <span className="text-[#F5F1E9] text-xs font-bold tracking-widest text-center">
          LOGO
        </span>
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
              className="text-[clamp(3.5rem,7vw,7.5rem)] tracking-normal leading-[1.1] text-[#F5F1E9] normal-case"
              style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}
            >
              AssalamuAlaikum!
              <br />
              <span className="inline-block mt-2">I’m Ashwera</span>
            </h2>
          </div>

          {/* Right Side: CS Undergrad Text (Was Left) */}
          <div className="w-full md:w-[45%] flex flex-col text-left md:text-right justify-center order-2 mt-8 md:mt-0">
            <p className="text-[clamp(1.2rem,2vw,1.8rem)] font-bold tracking-tight leading-[1.3] text-[#F5F1E9] normal-case">
              A CS undergrad hungry to learn, thriving on code and 142 failed
              test cases.
            </p>
            <div className="h-[2px] w-12 bg-white/40 my-5 rounded-full self-start md:self-end"></div>
            <p className="text-[clamp(1rem,1.4vw,1.25rem)] font-medium tracking-tight leading-[1.5] text-gray-300 normal-case mb-8">
              I learn fast, build things, and break them better.
            </p>

            <div className="flex flex-row items-center justify-start md:justify-end gap-4">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=syedashwerahasan@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-transparent border border-solid border-white/80 text-white font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all"
              >
                Say Hello
              </a>
              <a
                href="/resume"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-transparent border border-solid border-white/80 text-white font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all"
              >
                My Resume
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY TEXT (BELOW HERO) --- */}
      <div className="w-full flex flex-col items-center pt-10 pb-24 md:pt-16 md:pb-40">
        {/* Body Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="flex flex-col items-center w-full max-w-4xl px-6 md:px-8 text-center mb-8"
        >
          <div className="w-12 md:w-20 h-[2px] bg-[#0d0d0d]/30 mb-8 md:mb-12 rounded-full"></div>

          <p className="text-[clamp(1.1rem,2vw,1.75rem)] font-medium tracking-wide leading-[1.6] text-[#232323] flex flex-wrap justify-center overflow-hidden">
            <span className="overflow-hidden inline-block mr-[0.25em] mb-[0.2em]">
              <motion.span
                variants={{
                  hidden: { y: "100%", opacity: 0 },
                  visible: {
                    y: "0%",
                    opacity: 1,
                    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
                  },
                }}
                className="inline-block"
              >
                <LinkPreview
                  url="https://github.com/ashwera"
                  isStatic
                  imageSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop"
                  className="font-bold underline decoration-2 decoration-[#E21F26] hover:text-[#E21F26] transition-colors"
                >
                  I’M A FULL-STACK DEVELOPER
                </LinkPreview>
              </motion.span>
            </span>

            {"FOCUSED ON BUILDING SYSTEMS THAT HOLD UP UNDER PRESSURE. FROM BACKEND-HEAVY APPLICATIONS TO DATA-DRIVEN WORKFLOWS, I CARE ABOUT PERFORMANCE, EDGE CASES, AND REAL-WORLD USABILITY. I ENJOY ADDING THE COMPETITIVE PROGRAMMING EDGE TO MY PROJECTS, LEVELLING UP OPTIMIZATION LIKE TARGETED GAMEPLAY."
              .split(" ")
              .map((word, i) => (
                <span
                  key={i}
                  className="overflow-hidden inline-block mr-[0.25em] mb-[0.2em]"
                >
                  <motion.span
                    variants={{
                      hidden: { y: "100%", opacity: 0 },
                      visible: {
                        y: "0%",
                        opacity: 1,
                        transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
                      },
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
          </p>

          <div className="w-12 md:w-20 h-[2px] bg-[#0d0d0d]/30 mt-8 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
