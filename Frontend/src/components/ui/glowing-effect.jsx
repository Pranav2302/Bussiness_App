"use client";
import { memo, useCallback, useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { cn } from "../../lib/utils";

const GlowingEffect = memo(({
  blur = 10,
  inactiveZone = 0.5,
  proximity = 60,
  spread = 15,
  variant = "default",
  glow = true,
  className,
  movementDuration = 2,
  borderWidth = 1,
  disabled = false
}) => {
  const containerRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(0);
  const isHoveringRef = useRef(false);

  // Throttle mouse movement calculations
  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const element = containerRef.current;
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const mouseX = e?.x ?? lastPosition.current.x;
      const mouseY = e?.y ?? lastPosition.current.y;

      if (e) {
        lastPosition.current = { x: mouseX, y: mouseY };
      }

      // Check if mouse is over this specific element
      const isMouseOver = 
        mouseX >= left && 
        mouseX <= left + width && 
        mouseY >= top && 
        mouseY <= top + height;

      // Only process intensive calculations when mouse is near this element
      if (!isMouseOver && !isHoveringRef.current) {
        element.style.setProperty("--active", "0");
        return;
      }

      // Track hover state
      isHoveringRef.current = isMouseOver;

      const center = [left + width * 0.5, top + height * 0.5];
      const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
      const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

      if (distanceFromCenter < inactiveRadius) {
        element.style.setProperty("--active", "0");
        return;
      }

      const isActive =
        mouseX > left - proximity &&
        mouseX < left + width + proximity &&
        mouseY > top - proximity &&
        mouseY < top + height + proximity;

      element.style.setProperty("--active", isActive ? "1" : "0");

      if (!isActive) return;

      const currentAngle = parseFloat(element.style.getPropertyValue("--start")) || 0;
      let targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;

      const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
      const newAngle = currentAngle + angleDiff;

      animate(currentAngle, newAngle, {
        duration: movementDuration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (value) => {
          element.style.setProperty("--start", String(value));
        },
      });
    });
  }, [inactiveZone, proximity, movementDuration]);

  useEffect(() => {
    if (disabled) return;

    // Use a throttled event handler for scroll
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => handleMove(), 100);
    };

    const handlePointerMove = (e) => handleMove(e);

    // Use passive event listeners for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("pointermove", handlePointerMove, { passive: true });

    // Add mouseenter/mouseleave for this specific element
    const element = containerRef.current;
    if (element && element.parentElement) {
      const handleMouseEnter = () => {
        isHoveringRef.current = true;
      };
      
      const handleMouseLeave = () => {
        isHoveringRef.current = false;
        element.style.setProperty("--active", "0");
      };
      
      element.parentElement.addEventListener("mouseenter", handleMouseEnter, { passive: true });
      element.parentElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        clearTimeout(scrollTimeout);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("pointermove", handlePointerMove);
        
        element.parentElement.removeEventListener("mouseenter", handleMouseEnter);
        element.parentElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handleMove, disabled]);

  // Blue-themed gradient specifically for the Briskwell International
  const gradient = variant === "white" 
    ? `repeating-conic-gradient(
        from 236.84deg at 50% 50%,
        #FFFFFF,
        #FFFFFF calc(25% / var(--repeating-conic-gradient-times))
      )`
    : `radial-gradient(circle, #0066cc 10%, #0066cc00 20%),
      radial-gradient(circle at 40% 40%, #2d8efd 5%, #2d8efd00 15%),
      radial-gradient(circle at 60% 60%, #0099ff 10%, #0099ff00 20%), 
      radial-gradient(circle at 40% 60%, #63b3fb 10%, #63b3fb00 20%),
      repeating-conic-gradient(
        from 236.84deg at 50% 50%,
        #0066cc 0%,
        #2d8efd calc(25% / var(--repeating-conic-gradient-times)),
        #0099ff calc(50% / var(--repeating-conic-gradient-times)), 
        #63b3fb calc(75% / var(--repeating-conic-gradient-times)),
        #0066cc calc(100% / var(--repeating-conic-gradient-times))
      )`;

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] border opacity-0 transition-opacity",
          glow && "opacity-100",
          variant === "white" && "border-white"
        )} 
      />
      <div
        ref={containerRef}
        style={{
          "--blur": `${blur}px`,
          "--spread": spread,
          "--start": "0",
          "--active": "0",
          "--glowingeffect-border-width": `${borderWidth}px`,
          "--repeating-conic-gradient-times": "5",
          "--gradient": gradient
        }}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
          glow && "opacity-100",
          blur > 0 && "blur-[var(--blur)]",
          className
        )}>
        <div
          className={cn(
            "glow",
            "rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
            "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
            "after:[background:var(--gradient)] after:[background-attachment:fixed]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
            "after:[mask-clip:padding-box,border-box]",
            "after:[mask-composite:intersect]",
            "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
          )} 
        />
      </div>
    </>
  );
});

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };