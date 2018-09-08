export function pickRandom<T>(sources: T[]) {
  return sources[Math.floor(Math.random() * sources.length)];
}

export function pickPseudoRandom<T>(sources: T[], exclude: T[]) {
  let item = pickRandom(sources);

  while (exclude.indexOf(item) >= 0) {
    item = pickRandom(sources);
  }

  return item;
}
