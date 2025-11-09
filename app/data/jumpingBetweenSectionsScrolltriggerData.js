// Dummy test data for `JumpingBetweenSectionsScrolltrigger` component
// Designed to mirror the original HTML structure in `exports/.../dist/index.html`.

const data = {
  sections: [
    {
      id: 'landing-page',
      className: 'hero-story hero hero1',
      cols: [
        {
          className: 'full-col width-100',
          headingTag: 'h1',
          text: 'Landing Screen',
        },
      ],
    },
    {
      id: 'rooms',
      className: 'hero-story hero second-hero hero2',
      cols: [
        { className: 'left-col width-33', headingTag: 'h2', text: 'Des chambres pour vous' },
        { className: 'right-col width-66 delayed', headingTag: 'h2', text: 'Contenu pour les chambres' },
      ],
    },
    {
      id: 'you',
      className: 'hero-story hero second-hero hero3',
      cols: [
        { className: 'left-col width-33 delayed', headingTag: 'h2', text: 'Contenu gauche pour proche de vous' },
        { className: 'middle-col width-33', headingTag: 'h2', text: 'Proche de vous' },
        { className: 'right-col width-33 delayed', headingTag: 'h2', text: 'Contenu droite pour proche de vous' },
      ],
    },
    {
      id: 'near',
      className: 'hero-story hero second-hero hero4',
      cols: [
        { className: 'left-col width-66 delayed', headingTag: 'h2', text: 'Contenu pour proche de tout' },
        { className: 'right-col width-33', headingTag: 'h2', text: 'Proche de tout' },
      ],
    },
    {
      id: 'footer',
      tag: 'footer',
      className: 'hero-story hero second-hero hero5',
      cols: [
        { className: '', headingTag: 'h2', text: 'Contenu du footer' },
      ],
    },
  ],
};

export default data;
