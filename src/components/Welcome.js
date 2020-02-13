import React from "react";
import { useSpring, animated } from "react-spring";

const Welcome = () => {
    const props = useSpring({
      reverse: false,
      from: {
        scale: 10,
        opacity: 0,
        transform: "scale(0.9)",
        freq: "0.0175, 0.0"
      },
      to: { scale: 150, opacity: 1, transform: "scale(1)", freq: "0.0, 0.0" },
      config: { duration: 1500 }
    });
  return <animated.h1 style={props}>Welcome to Tetris Hooks!</animated.h1>;
};

export default Welcome;
