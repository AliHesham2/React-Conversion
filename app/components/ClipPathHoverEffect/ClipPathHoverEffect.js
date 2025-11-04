"use client";

import React from 'react';
import './ClipPathHoverEffect.module.css';

export default function ClipPathHoverEffect({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h1>Clip-Path <span className="header-span">Hover Effect</span></h1>
      <hr />
      <div className="all-the-foods">
        {items.map((it) => (
          <div key={it.id} className="clip-path-container" tabIndex={0}>
            <div className="description-holder">
              <h4>{it.title}</h4>
              <p>{it.description}</p>
            </div>
            <div
              className="food"
              style={{ backgroundImage: `url(${it.image})`, backgroundPosition: it.position }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
