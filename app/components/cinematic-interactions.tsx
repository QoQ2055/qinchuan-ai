"use client";

import { useEffect } from "react";

export function CinematicInteractions() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = [...document.querySelectorAll<HTMLElement>("header, section, figure")];
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav-links a")];
    const progress = document.getElementById("reading-progress");
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty("--reading-progress", `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
      const current = sections.findLast((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.4)?.id;
      links.forEach((link) => link.setAttribute("aria-current", link.getAttribute("href") === `#${current}` ? "true" : "false"));
    };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-revealed")), { threshold: 0.08 });
    sections.forEach((section) => { if (reduced) section.classList.add("is-revealed"); else observer.observe(section); });
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", update); };
  }, []);
  return <div id="reading-progress" aria-hidden="true" />;
}
