import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark, HiOutlineCalendarDays, HiOutlineCommandLine, HiArrowTopRightOnSquare, HiOutlineBuildingOffice2, HiOutlineUserCircle, HiOutlineGlobeAlt, HiOutlineLockClosed } from "react-icons/hi2";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Configurazione Dati Statici
const GITHUB_HISTORY = {
  organizations: [
    { name: "Socio Fondatore", id: "rockandror", label: "Rockandror" },
    { name: "Ayuntamiento de Madrid", id: "AyuntamientoMadrid", label: "Madrid City Council" },
    { name: "Consul Democracy", id: "consuldemocracy", label: "Consul Democracy" }
  ],
  // Inserisci qui il numero approssimativo dei tuoi repo privati
  privateReposCount: 36
};

const GithubSection = forwardRef(({ username = "agileontheweb", repo = "curriculum-react" }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commits, setCommits] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      fetchData();
    },
    close: handleClose
  }));

  const fetchData = async () => {
    if (commits.length > 0) return;
    setLoading(true);
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const userJson = await userRes.json();
      setUserData(userJson);

      const commitRes = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=100`);
      const commitJson = await commitRes.json();
      if (Array.isArray(commitJson)) setCommits(commitJson);
    } catch (error) {
      console.error("Errore API GitHub:", error);
    } finally {
      setLoading(false);
    }
  };

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleClose = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
      }
    });
    tl.to(".github-content", { opacity: 0, y: -20, duration: 0.3 })
      .to(containerRef.current, { y: '-100%', duration: 0.6, ease: 'power3.in' }, "-=0.1");
  });

  useGSAP(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      gsap.set(containerRef.current, { y: '100%', visibility: 'visible' });
      tl.to(containerRef.current, { y: '0%', duration: 0.7, ease: 'power4.out' })
        .to(".github-content", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
        .to(".github-close", { opacity: 1, duration: 0.3 }, "-=0.3");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div ref={containerRef} className="github-wrapper bg-agile-navy">
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 md:top-10 md:right-10 z-[150] bg-agile-navy/80 backdrop-blur-md border border-white/10 p-2 rounded-full text-white hover:text-agile-sky transition-all shadow-lg"
      >
        <HiXMark size={24} />
      </button>

      <div className="github-content pt-24 md:pt-32 px-4 md:px-0">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-stretch">

          {/* CARD 1: RADICI & STATS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-agile-sky font-mono text-[10px] md:text-xs uppercase tracking-widest">
              <HiOutlineUserCircle className="w-4 h-4" />
              <span>Le mie radici</span>
            </div>

            <div className="p-6 md:p-8 bg-agile-sky/5 border border-agile-sky/20 rounded-2xl h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                  Inizio percorso GitHub
                </h2>
                <div className="text-slate-400 text-sm md:text-base">
                  Profilo creato il <span className="text-agile-sky font-bold">Marzo 2012</span>
                </div>
              </div>

              {/* STATISTICHE REPO */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                {/* Pubblici (Dati Reali) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-agile-sky/10 flex items-center justify-center text-agile-sky">
                    <HiOutlineGlobeAlt size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg leading-none">
                      {userData ? userData.public_repos : '--'}
                    </span>
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Public Repo</span>
                  </div>
                </div>

                {/* Privati (Dati Statici) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                    <HiOutlineLockClosed size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg leading-none">
                      {GITHUB_HISTORY.privateReposCount}+
                    </span>
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Private Repo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: ESPERIENZE */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-agile-sky font-mono text-[10px] md:text-xs uppercase tracking-widest">
              <HiOutlineBuildingOffice2 className="w-4 h-4" />
              <span>Esperienze Professionali</span>
            </div>

            <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl h-full flex flex-col justify-center">
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-6 text-white">
                Collaborazioni <span className="text-agile-sky">Istituzionali</span>
              </h3>

              <div className="space-y-5">
                {GITHUB_HISTORY.organizations.map(org => (
                  <div key={org.id} className="flex items-center gap-4 group">
                    <img
                      src={`https://github.com/${org.id}.png`}
                      alt={org.name}
                      className="w-10 h-10 rounded-lg border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold">@{org.id}</span>
                      <span className="text-[10px] text-agile-sky font-bold uppercase tracking-wider mt-0.5">{org.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE COMMIT */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-agile-sky font-mono mb-4 text-xs md:text-sm">
            <HiOutlineCommandLine className="w-4 h-4" />
            <span>Collegamento API GitHub</span>
          </div>
          <h3 className="text-xl md:text-3xl font-bold uppercase tracking-tighter mb-10">
            Commit di questo <span className="text-agile-sky">repositorio</span>
          </h3>

          <div className="relative pb-20">
            <div className="absolute left-[17px] top-2 bottom-0 w-[1px] bg-white/10 md:left-1/2 md:-ml-[0.5px]"></div>

            <div className="space-y-8">
              {loading ? (
                <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
              ) : (
                commits.map((item, index) => (
                  <div key={item.sha} className="relative flex items-start md:justify-center group">
                    <div className="absolute left-1 md:left-1/2 md:-ml-4 w-8 h-8 rounded-full bg-agile-navy border border-white/20 z-10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-slate-500 group-hover:bg-agile-sky rounded-full transition-colors"></div>
                    </div>

                    <div className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                      <div className="github-repo-card !p-5 hover:border-agile-sky/30 transition-colors bg-white/[0.02]">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-2 uppercase">
                          <HiOutlineCalendarDays className="text-agile-sky" />
                          {new Date(item.commit.author.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <h4 className="text-slate-200 text-sm font-medium italic mb-3 leading-snug">"{item.commit.message}"</h4>
                        <div className="flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-mono tracking-tighter">SHA: {item.sha.substring(0, 7)}</span>
                          <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="text-agile-sky text-[9px] flex items-center gap-1 font-bold hover:underline">
                            APRI <HiArrowTopRightOnSquare size={10} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default GithubSection;