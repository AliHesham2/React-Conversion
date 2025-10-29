import React from 'react';
import styles from './style.module.css';

const SimpleFoodCard = ({ title, price, description }) => {
  return (
    <div className={styles.outer}>
      <div className={styles.inner}></div>
      <div className={styles.item}>
        <div className={styles.itemName}>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className={styles.itemPrice}>
          <p>&#36; {price}</p>
          <div className={styles.rating}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFoodCard;