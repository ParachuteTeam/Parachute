import React, { useEffect, useState } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const updateMouse = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMouse);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
    };
  }, []);

  return position;
};

export const useMouseRelativeAngle = (x: number, y: number) => {
  const { x: mouseX, y: mouseY } = useMousePosition();

  return (Math.atan2(mouseY - y, mouseX - x) * 180) / Math.PI;
};

export const useElementPosition = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (ref.current) {
      const { top, bottom, left, right } = ref.current.getBoundingClientRect();
      const x = (left + right) / 2;
      const y = (top + bottom) / 2;
      setPosition({ x, y });
    }
  }, [ref]);

  return { ...position, ref };
};

export const useElementMouseRelativeAngle = () => {
  const { x, y, ref } = useElementPosition();
  const angle = useMouseRelativeAngle(x, y);
  return { angle, ref };
};

export const useIsMobile = () => {
  // REVIEW: could use a global state management lib like jotai
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 768);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth < 768);
      });
    };
  }, []);

  return isMobile;
};

export const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
