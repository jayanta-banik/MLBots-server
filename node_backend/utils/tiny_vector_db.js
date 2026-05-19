import { pipeline } from '@huggingface/transformers';

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0));
  return vec.map((x) => x / norm);
}

export class TinyVectorDB {
  constructor(embedder) {
    this.embedder = embedder;
    this.items = [];
  }

  static async create({ model = 'Xenova/all-MiniLM-L6-v2' } = {}) {
    const embedder = await pipeline('feature-extraction', model);
    return new TinyVectorDB(embedder);
  }

  async embed(text) {
    const output = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  }

  addVector(id, vector, metadata = {}) {
    this.items.push({
      id,
      vector: normalize(vector),
      metadata,
    });
  }

  async addString(id, text, metadata = {}) {
    const vector = await this.embed(text);

    this.addVector(id, vector, {
      text,
      ...metadata,
    });
  }

  queryVector(vector, topK = 5) {
    const query = normalize(vector);

    return this.items
      .map((item) => ({
        id: item.id,
        score: dot(query, item.vector),
        metadata: item.metadata,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  async queryString(text, topK = 5) {
    const vector = await this.embed(text);
    return this.queryVector(vector, topK);
  }

  clear() {
    this.items = [];
  }

  size() {
    return this.items.length;
  }
}

// Example usage

// const db = await TinyVectorDB.create();
// await db.addString('cat', 'The cat sat on the mat.');
// await db.addString('dog', 'The dog sat on the log.');
// await db.addString('bird', 'The bird flew over the rainbow.');

// console.log(await db.queryString('feline', 2));
