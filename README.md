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
