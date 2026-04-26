import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface CardData {
  id: string;
  frontImage: string;
  backText: string;
  status: 'deck' | 'slot1' | 'slot2' | 'slot3';
  scatterX: number;
  scatterY: number;
  scatterRotate: number;
}

interface SolitaireCardProps {
  card: CardData;
  isDeck: boolean;
  stackIndex: number;
  onDragEnd: (cardId: string, info: PanInfo, isDeck: boolean) => void;
}

const SolitaireCard: React.FC<SolitaireCardProps> = ({ card, isDeck, stackIndex, onDragEnd }) => {
  return (
    <motion.div 
      layoutId={card.id}
      drag={true}
      dragSnapToOrigin={true}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      onDragEnd={(e, info) => onDragEnd(card.id, info, isDeck)}
      className={`absolute top-0 left-0 w-full h-full group [perspective:1200px] cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform`}
      initial={false}
      animate={isDeck ? {
        rotate: card.scatterRotate,
        x: card.scatterX,
        y: card.scatterY,
        zIndex: 10 + stackIndex,
      } : {
        rotate: 0,
        x: 0,
        y: stackIndex * 20, // Stacking offset!
        zIndex: 20 + stackIndex,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div 
        className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d]"
        style={{ transform: !isDeck ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front side (Playing Card Photo) */}
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg md:rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden bg-white p-1.5 md:p-2 border border-gray-200">
          <img 
            src={card.frontImage} 
            alt="Card Front" 
            className="w-full h-full object-cover rounded-md md:rounded-lg pointer-events-none select-none" 
            draggable="false"
          />
        </div>

        {/* Back side (Story Text) */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg md:rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] bg-[#1a1a1a] text-[#f4f4f4] p-3 md:p-5 flex flex-col items-center justify-center text-center border-4 border-gray-900 overflow-hidden">
          <div className="w-6 md:w-8 h-0.5 bg-gray-500 mx-auto mb-2 md:mb-4 rounded-full"></div>
          <p className="text-[0.65rem] sm:text-[0.75rem] md:text-sm font-medium leading-snug tracking-wide select-none">{card.backText}</p>
        </div>
      </div>
    </motion.div>
  );
};

const INITIAL_CARDS: CardData[] = [
  {
    id: 'card1',
    frontImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=600',
    backText: 'I started coding to solve problems, not just write syntax.',
    status: 'deck',
    scatterX: -80,
    scatterY: 20,
    scatterRotate: -12,
  },
  {
    id: 'card2',
    frontImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400&h=600',
    backText: 'Building robust architectures is what keeps me awake at night.',
    status: 'deck',
    scatterX: 0,
    scatterY: -15,
    scatterRotate: 4,
  },
  {
    id: 'card3',
    frontImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400&h=600',
    backText: '142 test cases. Finding the edge case is half the fun.',
    status: 'deck',
    scatterX: 90,
    scatterY: 10,
    scatterRotate: 18,
  },
  {
    id: 'card4',
    frontImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=600',
    backText: 'I believe in shipping fast, iterating quickly, and writing clean code.',
    status: 'deck',
    scatterX: -40,
    scatterY: -5,
    scatterRotate: -22,
  },
  {
    id: 'card5',
    frontImage: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400&h=600',
    backText: 'When I’m not coding, you’ll find me exploring new coffee shops.',
    status: 'deck',
    scatterX: 45,
    scatterY: -20,
    scatterRotate: -8,
  }
];

const AboutSection: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);

  const updateCardStatus = (cardId: string, newStatus: CardData['status']) => {
    setCards(prev => {
      const otherCards = prev.filter(c => c.id !== cardId);
      const movedCard = prev.find(c => c.id === cardId);
      if (!movedCard) return prev;
      return [...otherCards, { ...movedCard, status: newStatus }];
    });
  };

  const handleDragEnd = (cardId: string, info: PanInfo, currentlyInDeck: boolean) => {
    const isClick = Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5;

    // If clicked while in a slot, return it to the deck
    if (isClick && !currentlyInDeck) {
      updateCardStatus(cardId, 'deck');
      return;
    }
    // If clicked while in deck, do nothing
    if (isClick && currentlyInDeck) {
      return;
    }

    const pointerX = info.point.x;
    const pointerY = info.point.y;

    const hitSlot = ['slot1', 'slot2', 'slot3'].find(slotId => {
      const el = document.getElementById(slotId);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const padding = 20;
      return (
        pointerX >= rect.left - padding && 
        pointerX <= rect.right + padding && 
        pointerY >= rect.top - padding && 
        pointerY <= rect.bottom + padding
      );
    });

    if (hitSlot) {
      updateCardStatus(cardId, hitSlot as any);
    } else {
      // If dropped outside any slot, and it wasn't in the deck, return to deck
      if (!currentlyInDeck) {
        updateCardStatus(cardId, 'deck');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] w-full text-black px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-center gap-4 relative">
      {/* Left section: Typography */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tighter leading-[1] text-gray-900">
          Hi, I’m Ashwera
        </h2>
        <div className="flex flex-col space-y-3 max-w-[min(95vw,680px)] md:max-w-xl mt-4">
          <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] leading-[1.5] tracking-[0.01em] text-[rgba(8,8,8,0.76)]">
            A CS undergrad hungry to learn, thriving on code and 142 test cases.
          </p>
          <div className="h-[2px] w-12 bg-black/20 my-1"></div>
          <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] leading-[1.5] tracking-[0.01em] text-[rgba(8,8,8,0.76)]">
            I learn fast, build things, and break them better.
          </p>
        </div>
      </div>

      {/* Right section: Scattered Solitaire Layout */}
      <div className="w-full lg:w-[55%] flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 relative z-10">
        
        {/* TOP: 3 Placeholders (Slots) */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-[800px] mt-4">
          {['slot1', 'slot2', 'slot3'].map((slotId) => {
            const slotCards = cards.filter(c => c.status === slotId);
            return (
              <div 
                key={slotId} 
                id={slotId}
                className="relative w-[90px] h-[126px] sm:w-[110px] sm:h-[154px] md:w-[130px] md:h-[182px] lg:w-[140px] lg:h-[196px]"
              >
                <div className="absolute inset-0 border border-black/10 rounded-lg md:rounded-xl"></div>
                {slotCards.map((card, index) => (
                  <SolitaireCard 
                    key={card.id}
                    card={card}
                    isDeck={false}
                    stackIndex={index}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* BOTTOM: Scattered Deck */}
        <div className="relative w-full h-[140px] sm:h-[160px] flex items-center justify-center mt-2">
           {cards.filter(c => c.status === 'deck').map((card, index) => (
             <div 
               key={card.id} 
               className="absolute w-[90px] h-[126px] sm:w-[110px] sm:h-[154px] md:w-[130px] md:h-[182px] lg:w-[140px] lg:h-[196px]"
             >
               <SolitaireCard 
                 card={card}
                 isDeck={true}
                 stackIndex={index}
                 onDragEnd={handleDragEnd}
               />
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default AboutSection;
