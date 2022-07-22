import namor from "namor";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newProposal = () => {
  const statusChance = Math.random();
  return {
    proposal: namor.generate({ words: 1, numbers: 0 }),
    vote_url: namor.generate({ words: 4, numbers: 0 }),
    rationale: namor.generate({ words: 4, numbers: 0 }),
    vote: Math.floor(Math.random() * 10),
    result: Math.floor(Math.random() * 10),
    visits: Math.floor(Math.random() * 100),
    date: Math.floor(Math.random() * 1000000)
  };
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newProposal(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      };
    });
  };

  return makeDataLevel();
}
