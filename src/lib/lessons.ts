import { getCollection, type CollectionEntry } from 'astro:content';

export type Lesson = CollectionEntry<'lessons'>;

function codeValue(code: string): number {
  const [a, b] = code.split('.').map(Number);
  return a * 100 + b;
}

export async function getLessons(): Promise<Lesson[]> {
  const all = await getCollection('lessons');
  return all.sort((x, y) => codeValue(x.data.code) - codeValue(y.data.code));
}
