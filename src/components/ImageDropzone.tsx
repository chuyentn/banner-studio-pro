import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, X, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileToDataURL } from "@/lib/banner-api";
import { toast } from "sonner";

type Props = {
  label: string;
  hint?: string;
  images: string[];
  onChange: (next: string[]) => void;
  max?: number;
  accent?: "primary" | "accent";
  /** smaller thumbs to fit more visuals on one screen */
  density?: "comfy" | "compact";
};

export function ImageDropzone({
  label,
  hint,
  images,
  onChange,
  max = 12,
  accent = "primary",
  density = "compact",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const [focused, setFocused] = useState(false);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const room = Math.max(0, max - images.length);
    if (room === 0) {
      toast.warning(`Đã đạt tối đa ${max} ảnh`);
      return;
    }
    const slice = arr.slice(0, room);
    const urls = await Promise.all(slice.map(fileToDataURL));
    onChange([...images, ...urls]);
  }, [images, max, onChange]);

  // paste support — works when the dropzone is focused or hovered
  useEffect(() => {
    if (!focused) return;
    const handler = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const it of items) {
        if (it.kind === "file") {
          const f = it.getAsFile();
          if (f && f.type.startsWith("image/")) files.push(f);
        }
      }
      if (files.length) {
        e.preventDefault();
        await addFiles(files);
        toast.success(`Đã dán ${files.length} ảnh`);
      }
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [focused, addFiles]);

  async function pasteFromClipboard() {
    try {
      const items = await (navigator.clipboard as Clipboard & {
        read: () => Promise<ClipboardItems>;
      }).read();
      const files: File[] = [];
      for (const it of items) {
        for (const type of it.types as string[]) {
          if (type.startsWith("image/")) {
            const blob = await it.getType(type);
            files.push(new File([blob], `pasted-${Date.now()}.png`, { type }));
          }
        }
      }
      if (files.length === 0) {
        toast.warning("Clipboard không có ảnh", {
          description: "Copy 1 ảnh rồi bấm Dán, hoặc focus vào ô và Ctrl/Cmd+V.",
        });
        return;
      }
      await addFiles(files);
      toast.success(`Đã dán ${files.length} ảnh`);
    } catch {
      toast.error("Không truy cập được clipboard", {
        description: "Hãy bấm vào ô rồi Ctrl/Cmd+V.",
      });
    }
  }

  const thumbCols = density === "compact" ? "grid-cols-6" : "grid-cols-4";
  const padY = density === "compact" ? "py-3" : "py-6";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-xs font-medium">{label}</div>
          {hint && <div className="truncate text-[10px] text-muted-foreground">{hint}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:border-primary/50 hover:text-foreground"
            title="Dán ảnh từ clipboard"
          >
            <Clipboard className="h-3 w-3" /> Dán
          </button>
          <span className="text-[10px] text-muted-foreground">
            {images.length}/{max}
          </span>
        </div>
      </div>

      <div
        ref={wrapRef}
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative cursor-pointer rounded-lg border border-dashed p-2 outline-none transition-all",
          drag
            ? accent === "accent"
              ? "border-accent bg-accent/10"
              : "border-primary bg-primary/10"
            : "border-border/80 bg-card/40 hover:border-foreground/30 focus-visible:border-primary/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {images.length === 0 ? (
          <div className={cn("flex flex-col items-center justify-center text-center", padY)}>
            <ImagePlus className="mb-1 h-4 w-4 text-muted-foreground" />
            <div className="text-[11px] text-muted-foreground">
              Click · kéo thả · Ctrl/Cmd+V để dán
            </div>
          </div>
        ) : (
          <div className={cn("grid gap-1.5", thumbCols)}>
            {images.map((src, i) => (
              <div
                key={i}
                className="group/item relative aspect-square overflow-hidden rounded-md border border-border/60 bg-muted"
              >
                <img src={src} alt={`upload-${i}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(images.filter((_, idx) => idx !== i));
                  }}
                  className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-background/85 text-foreground opacity-0 transition-opacity group-hover/item:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {images.length < max && (
              <div className="grid aspect-square place-items-center rounded-md border border-dashed border-border/60 text-muted-foreground">
                <ImagePlus className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}