import { useEffect, useRef, useState } from "react";
import "./scrollRocket.css";

export default function ScrollRocket() {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState("down");
  const [progress, setProgress] = useState(0);

  const lastScrollY = useRef(0);
  const hideTimeout = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollProgress =
        documentHeight > 0 ? currentScrollY / documentHeight : 0;

      if (currentScrollY > lastScrollY.current) {
        setDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setDirection("up");
      }

      setProgress(scrollProgress);
      setIsVisible(true);
      lastScrollY.current = currentScrollY;

      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      hideTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  const rocketPosition = 18 + progress * 62;

  return (
    <div
      className={`scroll-rocket ${isVisible ? "show" : ""} ${direction}`}
      style={{ top: `${rocketPosition}%` }}
      aria-hidden="true"
    >
      <div className="rocket-trail"></div>

      <div className="rocket">
        <div className="rocket-aura"></div>

        <div className="rocket-nose">
          <span></span>
        </div>

        <div className="rocket-body">
          <div className="rocket-window"></div>
          <div className="rocket-stripe"></div>
          <div className="rocket-brand">KS</div>
        </div>

        <div className="rocket-boosters">
          <span></span>
          <span></span>
        </div>

        <div className="rocket-fins">
          <span></span>
          <span></span>
        </div>

        <div className="rocket-flame">
          <span className="flame-outer"></span>
          <span className="flame-inner"></span>
        </div>
      </div>
    </div>
  );
}