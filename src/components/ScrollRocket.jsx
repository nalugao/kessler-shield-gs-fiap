import { useEffect, useRef, useState } from "react";
import "./scrollRocket.css";

export default function ScrollRocket() {
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);
  const hideTimer = useRef(null);

  const [rocketState, setRocketState] = useState({
    top: 120,
    direction: "down",
    visible: false,
  });

  useEffect(() => {
    function updateRocket(showRocket = true) {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;

      const minTop = 105;
      const maxTop = window.innerHeight - 130;
      const top = minTop + (maxTop - minTop) * progress;

      let direction = rocketState.direction;

      if (scrollTop > lastScrollY.current) {
        direction = "down";
      }

      if (scrollTop < lastScrollY.current) {
        direction = "up";
      }

      lastScrollY.current = scrollTop;

      setRocketState({
        top,
        direction,
        visible: showRocket,
      });

      ticking.current = false;
    }

    function handleScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(() => updateRocket(true));
        ticking.current = true;
      }

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      hideTimer.current = setTimeout(() => {
        setRocketState((prev) => ({
          ...prev,
          visible: false,
        }));
      }, 700);
    }

    function handleResize() {
      updateRocket(false);
    }

    updateRocket(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [rocketState.direction]);

  return (
    <div
      className={
        rocketState.visible
          ? `scroll-rocket scroll-rocket--${rocketState.direction} is-visible`
          : `scroll-rocket scroll-rocket--${rocketState.direction}`
      }
      style={{ top: `${rocketState.top}px` }}
      aria-hidden="true"
    >
      <div className="rocket-shuttle">
        <div className="rocket-nose">
          <span className="rocket-cockpit"></span>
        </div>

        <div className="rocket-main-body">
          <span className="rocket-detail rocket-detail-top"></span>
          <span className="rocket-detail rocket-detail-bottom"></span>
        </div>

        <span className="rocket-side rocket-side-left"></span>
        <span className="rocket-side rocket-side-right"></span>

        <span className="rocket-wing rocket-wing-left"></span>
        <span className="rocket-wing rocket-wing-right"></span>

        <div className="rocket-engines">
          <span></span>
          <span></span>
        </div>

        <div className="rocket-flames">
          <span className="flame flame-left"></span>
          <span className="flame flame-center"></span>
          <span className="flame flame-right"></span>
        </div>
      </div>
    </div>
  );
}