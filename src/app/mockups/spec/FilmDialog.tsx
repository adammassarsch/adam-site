"use client";

import { useRef } from "react";

type Props = {
  label: string;
  video: { src: string; poster: string; label: string };
};

/** A text link that opens the film in a native dialog. Nothing loads until it opens. */
export function FilmDialog({ label, video }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);

  return (
    <>
      <button type="button" className="sp-link" onClick={() => dialog.current?.showModal()}>
        {label}
      </button>
      <dialog
        ref={dialog}
        className="sp-dialog"
        onClose={() => player.current?.pause()}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <video ref={player} controls muted playsInline preload="none" poster={video.poster} aria-label={video.label}>
          <source src={video.src} type="video/mp4" />
        </video>
        <form method="dialog">
          <button className="sp-link">Close</button>
        </form>
      </dialog>
    </>
  );
}
