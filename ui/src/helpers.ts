export const health = (character) => {
  const max = 1 + character.attributes.str + character.attributes.end;
  return max - character.current.dmg;
}
