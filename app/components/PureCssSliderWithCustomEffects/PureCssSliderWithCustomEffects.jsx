"use client";

import React, { useState } from "react";
import styles from "./PureCssSliderWithCustomEffects.module.css";

export default function PureCssSliderWithCustomEffects() {
  // Controlled selection state to reliably show the active slide in React
  const [selected, setSelected] = useState(1);

  return (
    <div className={styles.sliderRoot}>
      <div className={styles["slider"]}>
        {/* radios remain for accessibility and keyboard control, but we also
            control active slide via React state to avoid fragile CSS-module
            sibling selector issues */}
        <input
          name="control"
          id="page1"
          type="radio"
          checked={selected === 1}
          onChange={() => setSelected(1)}
        />
        <input
          name="control"
          id="page2"
          type="radio"
          checked={selected === 2}
          onChange={() => setSelected(2)}
        />
        <input
          name="control"
          id="page3"
          type="radio"
          checked={selected === 3}
          onChange={() => setSelected(3)}
        />
        <input
          name="control"
          id="page4"
          type="radio"
          checked={selected === 4}
          onChange={() => setSelected(4)}
        />

  <div className={`${styles["slider--el"]} ${styles["slider--el-1"]} ${styles["anim-4parts"]} ${selected === 1 ? styles.active : ""}`}>
          <div className={styles["slider--el-bg"]}>
            <div className={`${styles.part} ${styles.top} ${styles.left}`} />
            <div className={`${styles.part} ${styles.top} ${styles.right}`} />
            <div className={`${styles.part} ${styles.bot} ${styles.left}`} />
            <div className={`${styles.part} ${styles.bot} ${styles.right}`} />
          </div>
          <div className={styles["slider--el-content"]}>
            <h2 className={styles["slider--el-heading"]}>First slide</h2>
          </div>
        </div>

  <div className={`${styles["slider--el"]} ${styles["slider--el-2"]} ${styles["anim-9parts"]} ${selected === 2 ? styles.active : ""}`}>
          <div className={styles["slider--el-bg"]}>
            <div className={`${styles.part} ${styles["left-top"]}`} />
            <div className={`${styles.part} ${styles["mid-top"]}`} />
            <div className={`${styles.part} ${styles["right-top"]}`} />
            <div className={`${styles.part} ${styles["left-mid"]}`} />
            <div className={`${styles.part} ${styles["mid-mid"]}`} />
            <div className={`${styles.part} ${styles["right-mid"]}`} />
            <div className={`${styles.part} ${styles["left-bot"]}`} />
            <div className={`${styles.part} ${styles["mid-bot"]}`} />
            <div className={`${styles.part} ${styles["right-bot"]}`} />
          </div>
          <div className={styles["slider--el-content"]}>
            <h2 className={styles["slider--el-heading"]}>Second slide</h2>
          </div>
        </div>

  <div className={`${styles["slider--el"]} ${styles["slider--el-3"]} ${styles["anim-5parts"]} ${selected === 3 ? styles.active : ""}`}>
          <div className={styles["slider--el-bg"]}>
            <div className={`${styles.part} ${styles["part-1"]}`} />
            <div className={`${styles.part} ${styles["part-2"]}`} />
            <div className={`${styles.part} ${styles["part-3"]}`} />
            <div className={`${styles.part} ${styles["part-4"]}`} />
            <div className={`${styles.part} ${styles["part-5"]}`} />
          </div>
          <div className={styles["slider--el-content"]}>
            <h2 className={styles["slider--el-heading"]}>Third slide</h2>
          </div>
        </div>

  <div className={`${styles["slider--el"]} ${styles["slider--el-4"]} ${styles["anim-3parts"]} ${selected === 4 ? styles.active : ""}`}>
          <div className={styles["slider--el-bg"]}>
            <div className={`${styles.part} ${styles.left}`} />
            <div className={`${styles.part} ${styles.mid}`} />
            <div className={`${styles.part} ${styles.right}`} />
          </div>
          <div className={styles["slider--el-content"]}>
            <h2 className={styles["slider--el-heading"]}>Fourth slide</h2>
          </div>
        </div>

        <div
          className={`${styles["slider--control"]} ${styles.left}`}
          onClick={() => setSelected(selected === 1 ? 4 : selected - 1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelected(selected === 1 ? 4 : selected - 1);
            }
          }}
        >
          <label className={styles["page1-left"]} htmlFor="page1" />
          <label className={styles["page2-left"]} htmlFor="page2" />
          <label className={styles["page3-left"]} htmlFor="page3" />
          <label className={styles["page4-left"]} htmlFor="page4" />
        </div>
        <div
          className={`${styles["slider--control"]} ${styles.right}`}
          onClick={() => setSelected(selected === 4 ? 1 : selected + 1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelected(selected === 4 ? 1 : selected + 1);
            }
          }}
        >
          <label className={styles["page1-right"]} htmlFor="page1" />
          <label className={styles["page2-right"]} htmlFor="page2" />
          <label className={styles["page3-right"]} htmlFor="page3" />
          <label className={styles["page4-right"]} htmlFor="page4" />
        </div>
      </div>
    </div>
  );
}
