const shapeTypes: string[] = [
  'circle', 'square', 'triangle', 'rectangle', 'ellipse', 'pentagon', 'hexagon',
  'star', 'diamond', 'parallelogram', 'trapezoid', 'blob'
];

const colorPalettes: string[][] = [
  ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'],
  ['#034F84', '#F7786B', '#B565A7', '#DD4124', '#45B8AC'],
  ['#EFC050', '#5B5EA6', '#9B2335', '#DFCFBE', '#55B4B0'],
  ['#E15D44', '#7FCDCD', '#BC243C', '#C3447A', '#98B4D4'],
];

const adjectives: string[] = ['Whimsical', 'Electric', 'Silent', 'Dancing', 'Melancholy', 'Radiant', 'Quantum', 'Celestial', 'Vivid', 'Nebulous'];
const nouns: string[] = ['Dream', 'Pulse', 'Echo', 'Fragment', 'Whisper', 'Spectrum', 'Mirage', 'Riddle', 'Serenade', 'Paradox'];

const effects: string[] = [
  'rain', 'lightning', 'sparkles', 'fog', 'wind', 'none'
];

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function getRandomColors(count: number): string[] {
  const palette = colorPalettes[getRandomInt(colorPalettes.length)];
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(palette[getRandomInt(palette.length)]);
  }
  return colors;
}

function randomGradient(): string {
  const types: string[] = ['linear', 'radial', 'conic'];
  const type = types[getRandomInt(types.length)];
  const angle = getRandomInt(360);
  const colors = getRandomColors(3 + getRandomInt(2));
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  } else if (type === 'radial') {
    return `radial-gradient(circle, ${colors.join(', ')})`;
  } else {
    return `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
  }
}

function random3DTransform(): string {
  const rotateX = getRandomInt(60) - 30;
  const rotateY = getRandomInt(60) - 30;
  const rotateZ = getRandomInt(360);
  const scale = 0.8 + Math.random() * 0.7;
  return `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
}

function generateRandomName(): string {
  const adj = adjectives[getRandomInt(adjectives.length)];
  const noun = nouns[getRandomInt(nouns.length)];
  //return `${adj} ${noun}`;
  return "Na Na";
}

interface Shape {
  type: string;
}

function generateRandomShape(): Shape {
  const type = shapeTypes[getRandomInt(shapeTypes.length)];
  return { type };
}

function randomAnimationClass(): string {
  const animations: string[] = ['spin', 'pulse', 'float', 'wobble', 'skew'];
  return animations[getRandomInt(animations.length)];
}

function renderShape(type: string): HTMLDivElement {
  const shape = document.createElement('div');
  shape.className = `shape ${type}`;
  // Gradient background for all shapes
  const gradient = randomGradient();
  // 3D effect for some shapes
  if (Math.random() > 0.5) {
    shape.classList.add('three-d');
    shape.style.transform = random3DTransform();
  } else {
    shape.style.transform = '';
  }
  // Set gradient or border color depending on shape type
  if ([
    'circle', 'square', 'rectangle', 'ellipse', 'hexagon',
    'star', 'diamond', 'parallelogram', 'trapezoid', 'blob'
  ].includes(type)) {
    shape.style.background = gradient;
  } else if (type === 'triangle' || type === 'pentagon') {
    shape.style.borderBottomColor = getRandomColors(1)[0];
    // Add a filter for a fake gradient look
    shape.style.filter = `drop-shadow(0 0 16px ${getRandomColors(1)[0]})`;
  }
  // Add random animation
  shape.classList.add(randomAnimationClass());
  return shape;
}

function createRainEffect(): HTMLDivElement {
  const rainContainer = document.createElement('div');
  rainContainer.className = 'rain-container';
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    rainContainer.appendChild(drop);
  }
  return rainContainer;
}

function createLightningEffect(): HTMLDivElement {
  const lightning = document.createElement('div');
  lightning.className = 'lightning';
  return lightning;
}

function createSparklesEffect(): HTMLDivElement {
  const sparklesContainer = document.createElement('div');
  sparklesContainer.className = 'sparkles-container';
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    sparklesContainer.appendChild(sparkle);
  }
  return sparklesContainer;
}

function createFogEffect(): HTMLDivElement {
  const fog = document.createElement('div');
  fog.className = 'fog';
  return fog;
}

function createWindEffect(): HTMLDivElement {
  const windContainer = document.createElement('div');
  windContainer.className = 'wind-container';
  for (let i = 0; i < 15; i++) {
    const wind = document.createElement('div');
    wind.className = 'wind-line';
    wind.style.top = `${Math.random() * 100}%`;
    wind.style.animationDuration = `${1 + Math.random() * 2}s`;
    wind.style.animationDelay = `${Math.random() * 2}s`;
    windContainer.appendChild(wind);
  }
  return windContainer;
}

function addEffect(container: HTMLElement, effectType: string): void {
  switch (effectType) {
    case 'rain':
      container.appendChild(createRainEffect());
      break;
    case 'lightning':
      container.appendChild(createLightningEffect());
      break;
    case 'sparkles':
      container.appendChild(createSparklesEffect());
      break;
    case 'fog':
      container.appendChild(createFogEffect());
      break;
    case 'wind':
      container.appendChild(createWindEffect());
      break;
  }
}

document.getElementById('generate-btn')!.addEventListener('click', () => {
  const { type } = generateRandomShape();
  const name = generateRandomName();
  const shapeContainer = document.getElementById('shape-container')!;
  shapeContainer.innerHTML = '';

  // Add the shape
  const shape = renderShape(type);
  shapeContainer.appendChild(shape);

  // Add random effect
  const effectType = effects[getRandomInt(effects.length)];
  if (effectType !== 'none') {
    addEffect(shapeContainer, effectType);
  }

  document.getElementById('art-name')!.textContent = name;
});
