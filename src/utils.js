const letters = ['s', 'r', 'n', 'i', 'd', 'l', 't', 'c', 'm'];
const vowels = ['e', 'a', 'o', 'u'];
export const randomName = () => {
  const randInt = (l) => Math.floor(Math.random() * l);

  const length = 3 + randInt(5);
  let result = '';
  for(let i=0; i<length; i++) {
    if(i%2===0) {
      result += letters[randInt(letters.length)];
      if(i===0) {
        result = result.toUpperCase();
      }
    } else {
      result += vowels[randInt(vowels.length)];
    }
  }

  return result;
}
