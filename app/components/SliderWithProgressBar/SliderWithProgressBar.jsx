"use client";

import React, { useEffect, useRef } from 'react';
import styles from './SliderWithProgressBar.module.css';

export default function SliderWithProgressBar() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mainProgressBar = root.querySelector(
      ".progress-bar--primary .progress-bar__fill"
    );
    const mainPosts = root.querySelectorAll(".main-post");
    const posts = root.querySelectorAll(".post");

    let i = 0;
    let postIndex = 0;
    let currentPost = posts[postIndex];
    let currentMainPost = mainPosts[postIndex];

    function progress() {
      if (i === 100) {
        i = -5;
        // reset progress bar
        if (currentPost) {
          const fill = currentPost.querySelector(".progress-bar__fill");
          if (fill) fill.style.width = 0;
          currentPost.classList.remove("post--active");
        }
        if (mainProgressBar) mainProgressBar.style.width = 0;

        postIndex++;

        if (currentMainPost) {
          currentMainPost.classList.add("main-post--not-active");
          currentMainPost.classList.remove("main-post--active");
        }

        // reset postIndex to loop over the slides again
        if (postIndex === posts.length) {
          postIndex = 0;
        }

        currentPost = posts[postIndex];
        currentMainPost = mainPosts[postIndex];
      } else {
        i++;
        if (currentPost) {
          const fill = currentPost.querySelector(".progress-bar__fill");
          if (fill) fill.style.width = `${i}%`;
        }
        if (mainProgressBar) mainProgressBar.style.width = `${i}%`;
        if (currentPost) currentPost.classList.add("post--active");

        if (currentMainPost) {
          currentMainPost.classList.add("main-post--active");
          currentMainPost.classList.remove("main-post--not-active");
        }
      }
    }

    const progressInterval = setInterval(progress, 100);

    const clickHandlers = [];

    posts.forEach((post, index) => {
      const handler = () => {
        // disable posts temporarily
        posts.forEach((p) => p.classList.add('post--disabled'));
        setTimeout(() => {
          posts.forEach((p) => p.classList.remove('post--disabled'));
        }, 2500);

        i = 0; // Reset the progress bar
        postIndex = index;
        // update posts similar to original updatePosts()
        posts.forEach((p) => {
          const f = p.querySelector('.progress-bar__fill');
          if (f) f.style.width = 0;
          p.classList.remove('post--active');
        });
        mainPosts.forEach((mp) => {
          mp.classList.add('main-post--not-active');
          mp.classList.remove('main-post--active');
        });

        currentPost = posts[postIndex];
        currentMainPost = mainPosts[postIndex];

        if (currentPost) {
          const f = currentPost.querySelector('.progress-bar__fill');
          if (f) f.style.width = `${i}%`;
          currentPost.classList.add('post--active');
        }
        if (currentMainPost) {
          currentMainPost.classList.add('main-post--active');
          currentMainPost.classList.remove('main-post--not-active');
        }
      };
      clickHandlers.push({ el: post, handler });
      post.addEventListener('click', handler);
    });

    return () => {
      clearInterval(progressInterval);
      clickHandlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={"carousel " + styles.carousel} ref={rootRef}>
        <div className={"progress-bar progress-bar--primary hide-on-desktop " + styles['progress-bar'] + " " + styles['hide-on-desktop']}>
          <div className={"progress-bar__fill " + styles['progress-bar__fill']}></div>
        </div>

        <header className={"main-post-wrapper " + styles['main-post-wrapper']}>
          <div className={"slides " + styles.slides}>
            <article className={"main-post main-post--active " + styles['main-post']}>
              <div className={"main-post__image " + styles['main-post__image']}>
                <img src="https://www.formula1.com/content/dam/fom-website/manual/Misc/2019-Races/Monaco2019/McLarenMonaco19.jpg.transform/9col/image.jpg" alt="New McLaren wind tunnel 'critical' to future performance, says Tech Director Key" loading="lazy" />
              </div>
              <div className={"main-post__content " + styles['main-post__content']}>
                <div className={"main-post__tag-wrapper " + styles['main-post__tag-wrapper']}>
                  <span className={"main-post__tag " + styles['main-post__tag']}>News</span>
                </div>
                <h1 className={"main-post__title " + styles['main-post__title']}>New McLaren wind tunnel critical to future performance, says Tech Director Key</h1>
                <a className={"main-post__link " + styles['main-post__link']} href="#">
                  <span className={"main-post__link-text " + styles['main-post__link-text']}>find out more</span>
                  <svg
                    className={"main-post__link-icon main-post__link-icon--arrow " + styles['main-post__link-icon--arrow']}
                    width="37"
                    height="12"
                    viewBox="0 0 37 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 6H36.0001M36.0001 6L31.0001 1M36.0001 6L31.0001 11"
                      stroke="white"
                    />
                  </svg>
                </a>
              </div>
            </article>

            <article className={"main-post main-post--not-active " + styles['main-post']}>
              <div className={"main-post__image " + styles['main-post__image']}>
                <img src="https://www.formula1.com/content/dam/fom-website/sutton/2019/Hungary/Saturday/1017645792-LAT-20190803-_2ST5188.jpg.transform/9col-retina/image.jpg" alt="What To Watch For in the 2019 Hungarian Grand Prix" loading="lazy" />
              </div>
              <div className={"main-post__content " + styles['main-post__content']}>
                <div className={"main-post__tag-wrapper " + styles['main-post__tag-wrapper']}>
                  <span className={"main-post__tag " + styles['main-post__tag']}>Video</span>
                </div>
                <h1 className={"main-post__title " + styles['main-post__title']}>What To Watch For in the 2019 Hungarian Grand Prix</h1>
                <a className={"main-post__link " + styles['main-post__link']} href="#">
                  <svg
                    className={"main-post__link-icon main-post__link-icon--play-btn " + styles['main-post__link-icon--play-btn']}
                    width="30"
                    height="30"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="#C20000"
                      strokeWidth="2"
                    />
                    <path d="M14 10L8 6V14L14 10Z" fill="white" />
                  </svg>
                  <span className={"main-post__link-text " + styles['main-post__link-text']}>play video</span>
                </a>
              </div>
            </article>

            <article className={"main-post main-post--not-active " + styles['main-post']}>
              <div className={"main-post__image " + styles['main-post__image']}>
                <img src="https://www.formula1.com/content/dam/fom-website/manual/Misc/2019-Races/Austria-2019/Top3Austria2019.jpg.transform/9col-retina/image.jpg" alt="Hamilton wants harder championship fight from Leclerc and Verstappen" loading="lazy" />
              </div>
              <div className={"main-post__content " + styles['main-post__content']}>
                <div className={"main-post__tag-wrapper " + styles['main-post__tag-wrapper']}>
                  <span className={"main-post__tag " + styles['main-post__tag']}>News</span>
                </div>
                <h1 className={"main-post__title " + styles['main-post__title']}>Hamilton wants harder championship fight from Leclerc and Verstappen</h1>
                <a className={"main-post__link " + styles['main-post__link']} href="#">
                  <span className={"main-post__link-text " + styles['main-post__link-text']}>find out more</span>
                  <svg
                    className={"main-post__link-icon main-post__link-icon--arrow " + styles['main-post__link-icon--arrow']}
                    width="37"
                    height="12"
                    viewBox="0 0 37 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 6H36.0001M36.0001 6L31.0001 1M36.0001 6L31.0001 11"
                      stroke="white"
                    />
                  </svg>
                </a>
              </div>
            </article>
          </div>
        </header>

  <div className={"posts-wrapper hide-on-mobile " + styles['posts-wrapper'] + " " + styles['hide-on-mobile']}>
          <article className={"post post--active " + styles.post}>
            <div className={"progress-bar " + styles['progress-bar']}>
              <div className={"progress-bar__fill " + styles['progress-bar__fill']}></div>
            </div>
            <header className={"post__header " + styles['post__header']}>
              <span className={"post__tag " + styles['post__tag']}>News</span>
              <p className="post__published">16 August 2019</p>
            </header>
            <h2 className={"post__title " + styles['post__title']}>New McLaren wind tunnel critical to future performance, says Tech Director Key</h2>
          </article>
          <article className={"post " + styles.post}>
            <div className={"progress-bar " + styles['progress-bar']}>
              <div className={"progress-bar__fill " + styles['progress-bar__fill']}></div>
            </div>
            <header className={"post__header " + styles['post__header']}>
              <span className={"post__tag " + styles['post__tag']}>Video</span>
              <p className="post__published">12 August 2019</p>
            </header>
            <h2 className={"post__title " + styles['post__title']}>What To Watch For in the 2019 Hungarian Grand Prix</h2>
          </article>
          <article className={"post " + styles.post}>
            <div className={"progress-bar " + styles['progress-bar']}>
              <div className={"progress-bar__fill " + styles['progress-bar__fill']}></div>
            </div>
            <header className={"post__header " + styles['post__header']}>
              <span className={"post__tag " + styles['post__tag']}>News</span>
              <p className="post__published">08 August 2019</p>
            </header>
            <h2 className={"post__title " + styles['post__title']}>Hamilton wants harder championship fight from Leclerc and Verstappen</h2>
          </article>
        </div>
      </div>
    </div>
  );
}
