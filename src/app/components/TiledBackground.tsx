import React from "react";
import styles from "../page.module.css";
const TiledBackground = () => {
  let arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push(i);
  }
  return (
    <div className={styles.grid}>
      {arr.map((i) => (
        <div
        key={i}
          style={{
            backgroundColor: i % 2 ? "rgb(212, 212, 212)" : "rgb(79, 79, 79)",
          }}
          className={styles["home-tile"]}
        >
        </div>
      ))}
    </div>
  );
};

export default TiledBackground;
