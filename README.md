# html-parser
Parser is a function, that has one argument - input text,
<br> and return array, where items is object with fields:
- **name**
  <br>`String`. Name of node. Can ba as tag name
  <br>and can be technical name and starts with `#`
  <br>`div` - tag name
  <br>`#root`, `#comment`, `#text` - technical names
- **attrs**
  <br>`Object`. Object of node attributes, like {key: value}
  <br> For attributes without values, value will be `true`
- **content**
  <br>`Array`. Array of children nodes
- **parent**
  <br>`Object`. Parent node
  <br>For nodes of top level, parent node will be `#root`


```javascript
// Exemple.js
const parser = require('html-parser')

const input = `
<footer class="page__footer">
  <img src="./images/phone.png" alt="phone">
  <my-contacts phone="xxx-xxx-xxx"/>
</footer>
`
const parsedInput = parser(input)
console.log(parsedInput)
/*
  [
    {name: "#root", content: Array(3)},
    {name: "footer", attrs: {…}, content: Array(5), parent: {…}},
    {name: "img", attrs: {…}, parent: {…}},
    {name: "my-contacts", attrs: {…}, parent: {…}}
  ]
*/
```