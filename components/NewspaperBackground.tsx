import React from 'react';

const ARTICLES = [
  {
    publication: "THE BOMBAY CHRONICLE",
    date: "ARCHIVED: 1947",
    headline: "DAWN OF A NEW ERA",
    sub: "SPECIAL EDITION",
    content: "The streets are filled with jubilation as the nation awakes to a new life. Flags are being hoisted across every building in the city.",
    style: "top-[-5%] left-[-5%] rotate-[-4deg] w-[400px] z-0 opacity-40 grayscale sepia brightness-90"
  },
  {
    publication: "THE DAILY TELEGRAPH",
    date: "TODAY'S EDITION",
    headline: "MARKET WATCH",
    sub: "GLOBAL INDICES SURGE",
    content: "In a surprising turn of events, global markets have rallied significantly following the latest economic policy announcements.",
    style: "top-[10%] right-[-5%] rotate-[3deg] w-[350px] z-10 opacity-60 sepia-[0.3]"
  },
  {
    publication: "FINANCIAL GAZETTE",
    date: "EVENING STANDARD",
    headline: "CURRENCY FLUCTUATIONS",
    sub: "REPORT FROM THE DESK",
    content: "The rupee witnessed volatile trading sessions throughout the week. Experts suggest watching the central bank's next move closely.",
    style: "bottom-[15%] left-[5%] rotate-[6deg] w-[320px] z-0 opacity-50 grayscale"
  },
  {
    publication: "THE OBSERVER",
    date: "SUNDAY SPECIAL",
    headline: "POLITICAL LANDSCAPE",
    sub: "ELECTION UPDATES",
    content: "As the polls draw near, campaign trails are heating up in the northern districts. Analysts predict a close contest this term.",
    style: "bottom-[-5%] right-[10%] rotate-[-5deg] w-[380px] z-0 opacity-40 sepia"
  },
  {
    publication: "CITY NEWS",
    date: "LATEST",
    headline: "INFRASTRUCTURE BOOM",
    sub: "NEW METRO LINES",
    content: "Construction on the new metro phase begins next month, promising to ease congestion in the central business district.",
    style: "top-[40%] left-[20%] rotate-[15deg] w-[300px] z-0 opacity-30"
  },
  {
    publication: "TECH WEEKLY",
    date: "DIGITAL FRONTIER",
    headline: "AI REVOLUTION",
    sub: "INDUSTRY 4.0",
    content: "Artificial Intelligence continues to reshape industries, with automation becoming a key driver for productivity growth.",
    style: "top-[60%] right-[30%] rotate-[-10deg] w-[250px] z-0 opacity-30 sepia"
  }
];

export const NewspaperBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#E8E4D9]">
      {/* Old Paper Texture Overlay */}
      <div 
        className="absolute inset-0 z-20 mix-blend-multiply opacity-50" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
          filter: 'sepia(0.5) contrast(1.2)'
        }}
      ></div>

      {/* Vignette */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(62,39,35,0.4)_100%)]"></div>

      {ARTICLES.map((article, idx) => (
        <div 
          key={idx}
          className={`absolute bg-[#F5F1E6] p-6 shadow-lg border border-[#8B7355] blend-multiply transition-all duration-1000 ${article.style}`}
        >
          {/* Header */}
          <div className="border-b-2 border-vintage-ink mb-3 pb-2 flex justify-between items-end border-double">
            <span className="font-headline font-bold text-[0.7rem] uppercase tracking-widest text-vintage-brown">{article.publication}</span>
            <span className="font-typewriter text-[0.6rem] text-vintage-ink">{article.date}</span>
          </div>
          
          {/* Headline */}
          <h1 className="font-headline font-black text-3xl leading-[0.9] mb-2 uppercase text-vintage-ink">
            {article.headline}
          </h1>
          
          {/* Subhead */}
          <h2 className="font-typewriter font-bold text-xs uppercase mb-3 text-vintage-red leading-tight">
            {article.sub}
          </h2>
          
          {/* Content Columns */}
          <div className="text-[0.65rem] font-body leading-snug text-justify text-[#403028] columns-2 gap-4 border-t border-vintage-ink pt-2 italic">
            {article.content}
            <br/><br/>
            {"The quick brown fox jumps over the lazy dog. Local authorities have issued a statement regarding the ongoing developments."}
          </div>
        </div>
      ))}
    </div>
  );
};