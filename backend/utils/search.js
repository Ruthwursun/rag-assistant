import fs from "fs";

const docs = JSON.parse(
  fs.readFileSync("./data/docs.json", "utf-8")
);

export async function search(query) {
  const lowerQuery = query.toLowerCase();

  const scored = docs.map((doc) => {
    let score = 0;

    if (doc.title.toLowerCase().includes(lowerQuery)) score += 2;
    if (doc.content.toLowerCase().includes(lowerQuery)) score += 3;

    const queryWords = lowerQuery.split(" ");
    for (const word of queryWords) {
      if (doc.content.toLowerCase().includes(word)) score += 1;
      if (doc.title.toLowerCase().includes(word)) score += 1;
    }

    return {
      ...doc,
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3);
}