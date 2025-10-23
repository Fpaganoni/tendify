"use client";

import type React from "react";

import { useEffect, useRef } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeInUp"
    | "fadeInLeft"
    | "fadeInRight"
    | "scaleIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "bounceIn"
    | "rotateIn"
    | "flipIn"
    | "zoomIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean; // Si debe animar solo una vez
}

export function ScrollAnimation({
  children,
  className = "",
  animation = "fadeInUp",
  delay = 0,
  duration = 1000,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  once = true,
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in");

              // Agregar clases específicas para animaciones especiales
              if (animation === "bounceIn") {
                entry.target.classList.add("bounce-in");
              } else if (animation === "rotateIn") {
                entry.target.classList.add("rotate-in");
              } else if (animation === "flipIn") {
                entry.target.classList.add("flip-in");
              } else if (animation === "zoomIn") {
                entry.target.classList.add("zoom-in");
              }

              // Si once es true, dejar de observar después de la primera animación
              if (once) {
                observer.unobserve(entry.target);
              }
            }, delay);
          } else if (!once) {
            // Si once es false, remover la animación cuando sale del viewport
            entry.target.classList.remove(
              "animate-in",
              "bounce-in",
              "rotate-in",
              "flip-in",
              "zoom-in"
            );
          }
        });
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold, rootMargin, once, animation]);

  const animationClasses = {
    fadeInUp: `opacity-0 translate-y-12 transition-all duration-${duration} ease-out`,
    fadeInLeft: `opacity-0 -translate-x-8 transition-all duration-${duration} ease-out`,
    fadeInRight: `opacity-0 translate-x-8 transition-all duration-${duration} ease-out`,
    scaleIn: `opacity-0 scale-95 transition-all duration-${duration} ease-out`,

    // Nuevas animaciones más suaves
    slideUp: `opacity-0 translate-y-20 transition-all duration-${duration} ease-out`,
    slideDown: `opacity-0 -translate-y-20 transition-all duration-${duration} ease-out`,
    slideLeft: `opacity-0 translate-x-20 transition-all duration-${duration} ease-out`,
    slideRight: `opacity-0 -translate-x-20 transition-all duration-${duration} ease-out`,

    // Animaciones con efectos especiales
    bounceIn: `opacity-0 scale-50 transition-all duration-${duration} ease-out`,
    rotateIn: `opacity-0 rotate-12 scale-95 transition-all duration-${duration} ease-out`,
    flipIn: `opacity-0 rotate-y-90 transition-all duration-${duration} ease-out`,
    zoomIn: `opacity-0 scale-75 transition-all duration-${duration} ease-out`,
  };

  const getAnimationStyles = () => {
    const baseClass = animationClasses[animation];
    return `${baseClass} ${className}`;
  };

  return (
    <div
      ref={elementRef}
      className={getAnimationStyles()}
      style={{
        transitionTimingFunction: "cubic-bezier(0.4, 0.2, 0.1, 1)", // Más suave que ease-out
      }}
    >
      {children}
    </div>
  );
}
