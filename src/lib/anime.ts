export type AnimeTarget = Element | Element[] | NodeListOf<Element> | null | undefined;

export interface AnimeOptions {
  targets: AnimeTarget;
  translateY?: [number, number];
  translateX?: [number, number];
  scale?: [number, number];
  opacity?: [number, number];
  rotate?: [number, number];
  duration?: number;
  delay?: number | ((el: Element, index: number) => number);
  easing?: string;
}

const easings: Record<string, string> = {
  'easeOutExpo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'easeOutBack': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'easeInOutSine': 'cubic-bezier(0.37, 0, 0.63, 1)',
};

function toElements(targets: AnimeTarget): Element[] {
  if (!targets) return [];
  if (targets instanceof Element) return [targets];
  return Array.from(targets);
}

function transformFor(options: AnimeOptions, index: 0 | 1) {
  const transforms = [];
  if (options.translateY) transforms.push(`translateY(${options.translateY[index]}px)`);
  if (options.translateX) transforms.push(`translateX(${options.translateX[index]}px)`);
  if (options.scale) transforms.push(`scale(${options.scale[index]})`);
  if (options.rotate) transforms.push(`rotate(${options.rotate[index]}deg)`);
  return transforms.join(' ');
}

export function anime(options: AnimeOptions) {
  const elements = toElements(options.targets);
  const duration = options.duration ?? 700;
  const easing = easings[options.easing ?? 'easeOutExpo'] ?? options.easing ?? easings.easeOutExpo;

  const animations = elements.map((element, index) => {
    const delay = typeof options.delay === 'function' ? options.delay(element, index) : options.delay ?? 0;
    const fromTransform = transformFor(options, 0);
    const toTransform = transformFor(options, 1);
    const keyframes: Keyframe[] = [
      {
        opacity: options.opacity?.[0],
        transform: fromTransform || undefined,
      },
      {
        opacity: options.opacity?.[1],
        transform: toTransform || undefined,
      },
    ];

    return element.animate(keyframes, { duration, delay, easing, fill: 'both' });
  });

  return {
    animations,
    finished: Promise.all(animations.map((animation) => animation.finished.catch(() => undefined))),
    pause: () => animations.forEach((animation) => animation.pause()),
    play: () => animations.forEach((animation) => animation.play()),
    cancel: () => animations.forEach((animation) => animation.cancel()),
  };
}

export const stagger = (step = 80, start = 0) => (_element: Element, index: number) => start + index * step;
