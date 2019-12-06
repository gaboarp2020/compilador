window.onload = () => {

  const codeArea = document.querySelector("#code-area")
  const runBtn = document.querySelector("#exec-btn")
  const clearBtn = document.querySelector("#clear-btn")
  const ouput = document.querySelector("#ouput-msg")
  const lex = document.querySelector("#lexical-analyzer")
  const syn = document.querySelector("#syntactic-analyzer")
  const sem = document.querySelector("#semantic-analyzer")

  const init = () => {
    ouput.value = "Ouput: "
    lex.value = "Analizador Léxico: \n\n    "
    syn.value = "Analizador Sintáctico: \n\n    "
    sem.value = "Analizador Semántico: \n\n    "
  }

  init()

  clearBtn.addEventListener("click", () => {
    codeArea.value = ''
    init()
  })

  runBtn.addEventListener("click", () => {

    init()

    code = codeArea.value.split('')

    if (code.length === 0) {
      init()
      return
    }

    lex.value += "Caracteres:\n\t"

    code.forEach(char => {
      if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
        lex.value += char + " => OK\n\t"
      } else if (char === "\n") {
        lex.value += "\n\tSalto de linea\n\n\t"
      } else {
        lex.value += char + " => NOT OK\n\t"
      }
    });

    lines = codeArea.value.split('\n')
    //lines = endLines.split(';')

    lines.forEach((line, index) => {
      lex.value += "\n    Linea " + (index + 1) + ":\n\t"
      
      console.log(line)
      let charAt = 0
      let prevArray = []
      let nextArray = []
      let lineArray = []

      for (let i = 0; i < line.length; i++) {
        let char = line[i].charCodeAt(0)

        console.log('Char: ', line[i])
        console.log('Next: ', line[i+1])
        if ((char >= 37 && char <= 47) || (char >= 60 && char <= 62) || (char == 32)) {
          if (!(line[i+1].charCodeAt(0) >= 60 && line[i+1].charCodeAt(0) <= 62)) {
            prevArray = line.slice(charAt, i)
            charAt = i+1
            nextArray = line.slice(charAt)
            lineArray.push(prevArray, line[i], nextArray)
            //console.log('Prev: ', prevArray, '\nnext: ', nextArray, '\nline: ', lineArray)
          }
        }
      }
      const result = lineArray.join(' ')
      //console.log('Result: ', result)
      const expresion = result.split(' ')
      let tokenList = {}
      let tokenListSimplified = {}

      expresion.forEach(word => {
        if ((word.charCodeAt(0) >= 65 && word.charCodeAt(0) >= 65) || (word.charCodeAt(0) >= 97 && word.charCodeAt(0) >= 122)) {
          let type
          switch (word) {
            case "int":
              type = "INTEGER"
              break;

            case "float":
              type = "FLOAT"
              break;

            case "decimal":
              type = "DECIMAL"
              break;

            case "double":
              type = "DOUBLE"
              break;

            case "long":
              type = "LONG_INTEGER"
              break;

            case "short":
              type = "SHORT_INTEGER"
              break;

            case "boolean":
              type = "BOOLEAN"
              break;

            case "string":
              type = "STRING"
              break;

            case "class":
              type = "CLASS"
              break;

            case "var":
              type = "VAR_DEFINE"
              break

            case "function":
              type = "FUNCTION_DEFINE"
              break

            case "true":
              type = "BOOLEAN_VALUE"
              break

            case "false":
              type = "BOOLEAN_VALUE"
              break

            default:
              type = "VAR_NAME"
              break;
          }

          //lex.value += word + " => " + type + "\n\t"
          tokenList[type] = word

          if (type === "VAR_NAME") {
            tokenListSimplified[type] = word
          } else if (type === "BOOLEAN_VALUE") {
            tokenListSimplified["VALUE"] = word
          } else {
            tokenListSimplified["VAR_TYPE"] = word
          }
          

        } else if (word.charCodeAt(0) >= 48 && word.charCodeAt(0) <= 57) {

          let value

          for (let i = 0; i < word.length; i++) {
            if (word.charCodeAt(i) >= 48 && word.charCodeAt(i) <= 57) {
              value = "INTEGER_VALUE"
            } else if (word.charCodeAt(i) === ',' || word.charCodeAt(i) === '.') {
              value = "DECIMAL_VALUE"
            } else {
              value = "WRONG_ASSIGNAMENT"
            }
          }

          //lex.value += word + " => " + value + "\n\t"
          tokenList[value] = word
          tokenListSimplified["VALUE"] = word
          
        } else {
          let operator

          switch (word) {
            case "(":
              operator = "OPEN_BRACKET"
              break;

            case ")":
              operator = "CLOSE_BRACKET"
              break;

            case "+":
              operator = "SUM"
              break;

            case "-":
              operator = "SUBTRACTION"
              break;

            case "/":
              operator = "DIVIDE"
              break;

            case "*":
              operator = "MULTIPLY"
              break;

            case "**":
              operator = "POWER"
              break;

            case "++":
              operator = "INCREMENT"
              break;

            case "--":
              operator = "DECREMENT"
              break;

            case ".":
              operator = "DOT"
              break

            case ",":
              operator = "POINT"
              break

            case ":":
              operator = "COLON"
              break

            case ";":
              operator = "SEMI_COLON"
              break
              
            case "=":
              operator = "EQUAL"
              break

            case "<":
              operator = "SMALLER_THAN"
              break

            case ">":
              operator = "GREATER_THAN"
              break

            case "<=":
              operator = "EQUAL_SMALLER_THAN"
              break

            case ">=":
              operator = "EQUAL_GREATER_THAN"
              break

            case "==":
              operator = "EQUAL_TO"
              break

            case "!=":
              operator = "DIFERENT_TO"
              break

            default:
              operator = "INEXISTENT_TOKEN"
              break;
          }

          if (operator !== "INEXISTENT_TOKEN") {
            if (!/\s/.word) {
              //lex.value += word + " => " + operator + "\n\t"
              tokenList[operator] = word
              tokenListSimplified[operator] = word
            }
          }

        }
      })
      console.log('Token List: ', tokenList)
      Object.entries(tokenList).forEach(([key, value]) => {
        console.log(`${key}: ${value} <---- Token List`);
        lex.value += value + " => " + key + "\n\t"
      });
      Object.entries(tokenListSimplified).forEach(([key, value]) => {
        console.log(`${key}: ${value} <---- Token List Simplified`);
      });
      console.log(tokenList, tokenListSimplified)
      
    })

  })

}