"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Download, ImagePlus, Loader2, Palette, UploadCloud, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store/use-app-store";

const sampleImage =
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85";

type BackgroundMode = "transparent" | "white" | "indigo" | "sky" | "custom";

const modes: { id: BackgroundMode; label: string; swatch: string }[] = [
  { id: "transparent", label: "Transparent", swatch: "checkerboard" },
  { id: "white", label: "White", swatch: "bg-white" },
  { id: "indigo", label: "Violet", swatch: "bg-indigo-500" },
  { id: "sky", label: "Sky", swatch: "bg-sky-400" },
  { id: "custom", label: "Custom", swatch: "bg-gradient-to-br from-fuchsia-400 to-amber-300" }
];

export function UploaderStudio() {
  const [image, setImage] = useState<string>(sampleImage);
  const [fileName, setFileName] = useState("studio-portrait.jpg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(52);
  const [mode, setMode] = useState<BackgroundMode>("transparent");
  const [batchCount, setBatchCount] = useState(1);
  const customInput = useRef<HTMLInputElement>(null);
  const { notify } = useToast();
  const { spendCredit, addHistory } = useAppStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const first = acceptedFiles[0];
      setBatchCount(acceptedFiles.length);
      setFileName(first.name);
      setImage(URL.createObjectURL(first));
      setIsProcessing(true);
      window.setTimeout(() => {
        setIsProcessing(false);
        spendCredit();
        addHistory({
          id: crypto.randomUUID(),
          name: acceptedFiles.length > 1 ? `${acceptedFiles.length} image batch` : first.name,
          status: "Processed",
          createdAt: "Just now",
          size: `${Math.max(1, Math.round(first.size / 1024 / 1024))} MB`
        });
        notify("Background removed. Preview is ready.");
      }, 1550);
    },
    [addHistory, notify, spendCredit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
    maxFiles: 12
  });

  const backgroundClass = useMemo(() => {
    if (mode === "transparent") return "checkerboard";
    if (mode === "white") return "bg-white";
    if (mode === "indigo") return "bg-gradient-to-br from-indigo-500 to-violet-500";
    if (mode === "sky") return "bg-gradient-to-br from-sky-300 to-cyan-100";
    return "bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=70')] bg-cover bg-center";
  }, [mode]);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-[2rem] p-4 sm:p-5"
      >
        <div
          {...getRootProps()}
          className={cn(
            "focus-ring grid min-h-[310px] cursor-pointer place-items-center rounded-[1.5rem] border-2 border-dashed border-indigo-200 bg-white/80 p-6 text-center transition dark:border-indigo-400/30 dark:bg-white/5",
            isDragActive && "scale-[0.99] border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
          )}
          role="button"
          aria-label="Upload images for background removal"
        >
          <input {...getInputProps()} />
          <div className="mx-auto max-w-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-600 text-white shadow-glow">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight">Upload an image</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Drag and drop single images or batch upload up to 12 files. PNG, JPG, JPEG, and WEBP are supported.</p>
            <Button className="mt-6" variant="gradient" size="lg">
              <ImagePlus className="h-5 w-5" />
              Choose files
            </Button>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">No credit card required</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["API ready", "Batch upload", "HD export"].map((label) => (
            <div key={label} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        viewport={{ once: true }}
        className="glass overflow-hidden rounded-[2rem] p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Live AI preview</p>
            <h3 className="font-black tracking-tight">{batchCount > 1 ? `${batchCount} files queued` : fileName}</h3>
          </div>
          <Button variant="secondary" onClick={() => notify("Stripe checkout and HD export endpoint placeholder triggered.")}>
            <Download className="h-4 w-4" />
            Download HD
          </Button>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-900">
          <div className={cn("relative aspect-[1.18] min-h-[330px]", backgroundClass)}>
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
              <Image src={image} alt="Original uploaded preview" fill className="object-cover" unoptimized />
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative h-[82%] w-[64%] overflow-hidden rounded-[2rem] shadow-soft">
                <Image src={image} alt="Background removed preview" fill className="object-cover" unoptimized />
                <div className={cn("absolute inset-0 mix-blend-screen", mode === "transparent" ? "bg-white/0" : "bg-white/15")} />
              </div>
            </div>
            <input
              aria-label="Before and after comparison"
              type="range"
              min="12"
              max="88"
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="absolute inset-x-6 bottom-6 z-10 accent-indigo-600"
            />
            <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm">Original</div>
            <div className="absolute right-6 top-6 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-bold text-white shadow-sm">Removed</div>
            {isProcessing ? (
              <div className="absolute inset-0 grid place-items-center bg-white/68 backdrop-blur-md dark:bg-slate-950/60">
                <div className="rounded-3xl bg-white p-6 text-center shadow-soft dark:bg-slate-900">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-indigo-600" />
                  <p className="mt-3 font-black">AI is separating the subject</p>
                  <p className="mt-1 text-sm text-muted-foreground">Edge refinement, hair detail, shadows</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Palette className="h-4 w-4" />
            Background
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {modes.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "focus-ring flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 text-left text-xs font-bold transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5",
                  mode === item.id && "ring-2 ring-indigo-500"
                )}
                onClick={() => {
                  setMode(item.id);
                  if (item.id === "custom") customInput.current?.click();
                }}
              >
                <span className={cn("h-8 w-8 rounded-xl border border-slate-200", item.swatch)} />
                {item.label}
              </button>
            ))}
          </div>
          <input ref={customInput} type="file" className="hidden" accept="image/*" onChange={() => notify("Custom background upload placeholder selected.")} />
        </div>
        <div className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-950 dark:bg-indigo-500/10 dark:text-indigo-100">
          <div className="flex items-start gap-3">
            <WandSparkles className="mt-0.5 h-5 w-5" />
            <p><strong>Integration placeholder:</strong> replace the simulated timer with your background removal API, then store exports in Cloudinary or S3.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
