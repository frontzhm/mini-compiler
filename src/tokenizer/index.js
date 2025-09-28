export function tokenizer(code) {
  const tokens = []
  let current = 0
  const length = code.length
  while (current < length) {
    let char = code[current]
    if (char === "(") {
      tokens.push({ type: "paren", value: "(" })
      current++
    }
    if (char === ")") {
      tokens.push({ type: "paren", value: ")" })
      current++
    }

    {
      const whiteSpace = /\s/
      if (whiteSpace.test(char)) {
        current++
      }
    }

    {
      let LETTERS = /[a-z]/i
      if (LETTERS.test(char)) {
        let value = ""
        while (LETTERS.test(char) && current < length) {
          value += char

          // 指针后移
          current++
          char = code[current]
        }
        tokens.push({ type: "name", value })
      }

    }

    {
      let NUMBERS = /[0-9]/
      if (NUMBERS.test(char)) {
        let value = ""
        while (NUMBERS.test(char) && current < length) {
          value += char

          current++
          char = code[current]
        }
        tokens.push({ type: "number", value })
      }
    }

  }
  return tokens
}





