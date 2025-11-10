import React, { useEffect } from 'react';
import styles from './PricingPureCss16.module.css';

export default function PricingPureCss16() {


  return (
    <div className={styles.pricingRoot}>
      <a href="https://front.codes/" className={styles.logo} target="_blank" rel="noreferrer noopener">
        <img src="https://assets.codepen.io/1462889/fcb.png" alt="" />
      </a>

      <div className={`${styles.section} ${styles['over-hide']}`}>
        <div className={styles.container}>
          <div className={`${styles.row} ${styles['full-height']}`}>
            <div className="col-12 text-center align-self-center py-5">
              <div className={`${styles.section} text-center py-5 py-md-0`}>
                <input className={styles.pricing} type="checkbox" id="pricing" name="pricing" />
                <label htmlFor="pricing">
                  <span className={styles['block-diff']}>
                    <span className={styles.mainText}>kayaking</span>
                    <span className={`${styles['float-right']} ${styles.altText}`}>camping</span>
                  </span>
                </label>
                <div className={`${styles['card-3d-wrap']} mx-auto`}>
                  <div className={styles['card-3d-wrapper']}>
                    <div className={styles['card-front']}>
                      <div className={styles['pricing-wrap']}>
                        <h4 className="mb-5">Kayaking</h4>
                        <h2 className="mb-2"><sup>$</sup>39 / 4<sup>hrs</sup></h2>
                        <p className="mb-4">per person</p>
                        <p className="mb-1"><i className={`uil uil-location-pin-alt ${styles['size-22']}`}></i></p>
                        <p className="mb-4">Drina, Serbia</p>
                        <a href="#0" className={styles.link}>Choose Date</a>
                        <div className={`${styles['img-wrap']} ${styles['img-2']}`}>
                          <img src="https://assets.codepen.io/1462889/sea.png" alt="" />
                        </div>
                        <div className={`${styles['img-wrap']} ${styles['img-1']}`}>
                          <img src="https://assets.codepen.io/1462889/kayak.png" alt="" />
                        </div>
                        <div className={`${styles['img-wrap']} ${styles['img-3']}`}>
                          <img src="https://assets.codepen.io/1462889/water.png" alt="" />
                        </div>
                        <div className={`${styles['img-wrap']} ${styles['img-6']}`}>
                          <img src="https://assets.codepen.io/1462889/Stone.png" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className={styles['card-back']}>
                      <div className={styles['pricing-wrap']}>
                        <h4 className="mb-5">Camping</h4>
                        <h2 className="mb-2"><sup>$</sup>29 / 8<sup>hrs</sup></h2>
                        <p className="mb-4">per person</p>
                        <p className="mb-1"><i className={`uil uil-location-pin-alt ${styles['size-22']}`}></i></p>
                        <p className="mb-4">Tara, Serbia</p>
                        <a href="#0" className={styles.link}>Choose Date</a>
                        <div className={`${styles['img-wrap']} ${styles['img-2']}`}>
                          <img src="https://assets.codepen.io/1462889/grass.png" alt="" />
                        </div>
                        <div className={`${styles['img-wrap']} ${styles['img-4']}`}>
                          <img src="https://assets.codepen.io/1462889/camp.png" alt="" />
                        </div>
                        <div className={`${styles['img-wrap']} ${styles['img-5']}`}>
                          <img src="https://assets.codepen.io/1462889/Ivy.png" alt="" />
                        </div>
                        <div className={`${styles['img-wrap']} ${styles['img-7']}`}>
                          <img src="https://assets.codepen.io/1462889/IvyRock.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
