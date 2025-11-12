"use client";

import React, { useCallback, useState } from 'react';
import styles from './Gallery.module.css';

const defaultItems = [
  { id: 0, pos: 0, url: 'https://tinyurl.com/4e6sb4eu' },
  { id: 1, pos: 1, url: 'https://tinyurl.com/2mj4ybmz' },
  { id: 2, pos: 2, url: 'https://tinyurl.com/y75eb7sx' },
  { id: 3, pos: 3, url: 'https://tinyurl.com/363twa27' },
  { id: 4, pos: 4, url: 'https://tinyurl.com/3cksf5nf' },
];

export default function VueResponsiveShuffleGallery({ items: initialItems = defaultItems }) {
  const [items, setItems] = useState(() => initialItems.map((it) => ({ ...it })));

  const shuffle = useCallback((clickedItem) => {
    setItems((prev) => {
      const next = prev.map((it) => ({ ...it }));
      const heroPos = Math.floor(next.length / 2);
      const heroIndex = next.findIndex(({ pos }) => pos === heroPos);
      const targetIndex = next.findIndex(({ id }) => id === clickedItem.id);

      if (heroIndex === -1 || targetIndex === -1) return prev;

      [next[targetIndex].pos, next[heroIndex].pos] = [next[heroIndex].pos, next[targetIndex].pos];

      return next;
    });
  }, []);

  const scaleForPos = (pos) => {
    switch (String(pos)) {
      case '2':
        return 1.8;
      case '1':
      case '3':
        return 1.4;
      default:
        return 1;
    }
  };

  return (
    <div className={styles.root}>
      <ul className={styles.gallery}>
        {items.map((item) => {
          const scale = scaleForPos(item.pos);
          return (
            <li
              key={item.id}
              className={styles.item}
              data-pos={item.pos}
              role="button"
              tabIndex={0}
              onClick={() => shuffle(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') shuffle(item);
              }}
              style={{
                transform: `translateX(calc(var(--width) * 0.2 * ${item.pos})) scale(${scale})`,
                backgroundImage: `url(${item.url})`,
              }}
            />
          );
        })}
      </ul>
    </div>
  );
}
