"use client";

import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";
import {MouseEvent, useEffect, useMemo, useState} from "react";

export type Artwork = {
  _id: string;
  title: string;
  imageUrl: string;
  theme?: "粉墨 (The Stage)" | "浮生 (The World)" | string;
  medium?: "摄影 (Photography)" | "绘画 (Painting)" | string;
  story?: string;
  aspectRatio?: number;
  exif?: {
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    cameraModel?: string;
  };
  materials?: string;
};

const filters = [
  {label: "全部", value: "all"},
  {label: "粉墨", value: "粉墨 (The Stage)"},
  {label: "浮生", value: "浮生 (The World)"},
] as const;

export function Gallery({artworks}: {artworks: Artwork[]}) {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]["value"]>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const filteredArtworks = useMemo(() => {
    if (activeFilter === "all") {
      return artworks;
    }

    return artworks.filter((artwork) => artwork.theme === activeFilter);
  }, [activeFilter, artworks]);

  useEffect(() => {
    if (!selectedArtwork) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArtwork(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedArtwork]);

  const openLightbox = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="sticky top-0 z-10 -mx-5 border-b border-white/10 bg-black/85 px-5 py-5 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
          <nav aria-label="作品分类" className="flex items-center gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`relative h-10 rounded-full px-4 text-sm transition-colors ${
                    isActive
                      ? "text-black"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="active-filter"
                      className="absolute inset-0 rounded-full bg-white"
                      transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                    />
                  ) : null}
                  <span className="relative z-10">{filter.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="columns-1 gap-4 pt-8 sm:columns-2 lg:columns-3 xl:columns-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {opacity: 0},
              visible: {
                opacity: 1,
                transition: {staggerChildren: 0.055, delayChildren: 0.05},
              },
            }}
          >
            {filteredArtworks.map((artwork) => (
              <motion.article
                key={artwork._id}
                className="group mb-4 break-inside-avoid overflow-hidden bg-zinc-950"
                variants={{
                  hidden: {opacity: 0, y: 22},
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {duration: 0.55, ease: [0.22, 1, 0.36, 1]},
                  },
                }}
                layout
              >
                <button
                  type="button"
                  onClick={() => openLightbox(artwork)}
                  className="relative block w-full cursor-zoom-in overflow-hidden bg-zinc-900 text-left"
                  aria-label={`${artwork.title} 详情`}
                >
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={1200}
                    height={Math.round(1200 / (artwork.aspectRatio || 0.75))}
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </button>
                <div className="space-y-2 px-1 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-medium text-white">
                      {artwork.title}
                    </h2>
                    {artwork.medium ? (
                      <span className="shrink-0 text-xs text-white/45">
                        {artwork.medium.replace(/\s*\(.+\)/, "")}
                      </span>
                    ) : null}
                  </div>
                  {artwork.story ? (
                    <p className="line-clamp-2 text-xs leading-5 text-white/45">
                      {artwork.story}
                    </p>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredArtworks.length === 0 ? (
          <div className="flex min-h-[45vh] items-center justify-center text-sm text-white/45">
            暂无作品
          </div>
        ) : null}
      </section>

      <AnimatePresence>
        {selectedArtwork ? (
          <motion.div
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 px-4 py-6 backdrop-blur-xl sm:px-8"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.button
              type="button"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/80 backdrop-blur transition hover:bg-white hover:text-black"
              aria-label="关闭灯箱"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedArtwork(null);
              }}
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9}}
              transition={{duration: 0.22}}
            >
              X
            </motion.button>

            <motion.div
              className="relative flex h-full w-full max-w-7xl items-center justify-center"
              initial={{opacity: 0, scale: 0.96, y: 14}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.96, y: 14}}
              transition={{duration: 0.42, ease: [0.22, 1, 0.36, 1]}}
              onClick={stopPropagation}
            >
              <div className="relative h-[min(78vh,900px)] w-[min(94vw,1180px)]">
                <Image
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  fill
                  priority
                  sizes="94vw"
                  className="object-contain"
                />
              </div>

              <motion.aside
                className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-1 pb-2 text-white sm:left-0 sm:right-auto sm:max-w-sm sm:pb-4 lg:max-w-md"
                initial={{opacity: 0, y: 18}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 18}}
                transition={{delay: 0.08, duration: 0.38}}
              >
                <div className="space-y-4 bg-gradient-to-t from-black via-black/70 to-transparent pt-16 sm:bg-none sm:pt-0">
                  <div className="space-y-2">
                    <h2 className="text-base font-medium tracking-normal text-white sm:text-lg">
                      {selectedArtwork.title}
                    </h2>
                    {selectedArtwork.story ? (
                      <p className="max-w-2xl text-xs leading-6 text-white/65 sm:text-sm">
                        {selectedArtwork.story}
                      </p>
                    ) : null}
                  </div>

                  <ArtworkMeta artwork={selectedArtwork} />
                </div>
              </motion.aside>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function ArtworkMeta({artwork}: {artwork: Artwork}) {
  const exifItems = [
    artwork.exif?.cameraModel,
    artwork.exif?.focalLength,
    artwork.exif?.aperture,
    artwork.exif?.shutterSpeed,
  ].filter(Boolean);

  if (exifItems.length > 0) {
    return (
      <p className="text-[11px] leading-5 text-white/50 sm:text-xs">
        {exifItems.join(" | ")}
      </p>
    );
  }

  if (artwork.materials) {
    return (
      <p className="text-[11px] leading-5 text-white/50 sm:text-xs">
        {artwork.materials}
      </p>
    );
  }

  return null;
}
