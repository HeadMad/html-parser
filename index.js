const COLLECTION = [{
  open: true,
  index: 0,
  name: '#root',
  content: []
}]
const COMMENTS = new Map()
const HASH = Date.now().toString(32)
const SINGLE_TAGS = new Set([
  "area", "base", "basefont", "br", "col",
  "embed", "frame", "hr", "img", "input",
  "isindex", "link", "menuitem", "meta",
  "param", "source", "track", "wbr"
])
let INPUT

const findLast = (handler) => {
  let i = COLLECTION.length
  while (i--) {
    const node = COLLECTION[i]
    if (handler(node))
      return node
  }
  return false
}

const parseAttrsString = (attrsString) => {
  const attrs = {}
  const attrRE = /\b([\w:.@-]+)(=("|'|`)(.*?)\3)?/g
  let match
  while (match = attrRE.exec(attrsString))
    attrs[match[1]] = match[4] || true
  return attrs
}

const createTextNode = (inPoint, outPoint) => ({
  name: '#text',
  content: INPUT.substring(inPoint, outPoint)
})

const addTextNode = (content, startPoint, endPoint) => {
  if (startPoint < endPoint)
    content.push(createTextNode(startPoint, endPoint))
}

const createCommentNode = (attrsString) => ({
  name: '#comment',
  content: COMMENTS.get(Number(attrsString))
})

const createTagNode = (name, attrsString) => {
  const node = { name }
  if (attrsString && attrsString.trim())
    node.attrs = parseAttrsString(attrsString)
  return node
}

const createDoubleTagNode = (index, ...args) => {
  const node = createTagNode(...args)
  node.open = true
  node.content = []
  node.index = index
  return node
}

const createNode = (name, attrsString, isSingle, outPoint) => {
  const node = name === HASH
    ? createCommentNode(attrsString)
    : isSingle
      ? createTagNode(name, attrsString)
      : createDoubleTagNode(outPoint, name, attrsString)
  return node
}

const closeNode = (node, inPoint) => {
  addTextNode(node.content, node.index, inPoint)
  delete node.open
  delete node.index
}

const addNodeToCollection = (match) => {
  const [source, isClose, name, attrsString] = match
  const isSingle = match[4] || SINGLE_TAGS.has(name)
  const inPoint = match.index
  const outPoint = inPoint + source.length
  const openedNode = findLast(node => node.open)

  if (isClose) {
    if (!openedNode || openedNode.name !== name) return
    closeNode(openedNode, inPoint)
    openedNode.parent.index = outPoint

  } else {
    const node = createNode(name, attrsString, isSingle, outPoint)
    node.parent = openedNode
    addTextNode(openedNode.content, openedNode.index, inPoint)
    openedNode.content.push(node)
    if (isSingle)
      openedNode.index = outPoint
    COLLECTION.push(node)
  }
}

const replaceComments = (input) => input.replace(/<!--[\s\S]*?-->/g, (match) => {
  const i = COMMENTS.size
  COMMENTS.set(i, match)
  return `<${HASH} ${i}/>`
})

const Parser = (input) => {
  const tagRE = /<(\/)?([\w-]+)(\s+[^>]*?)?(\/)?>/g
  INPUT = replaceComments(input)
  let match
  while (match = tagRE.exec(INPUT))
    addNodeToCollection(match)
  closeNode(COLLECTION[0], INPUT.length)
  return COLLECTION
}


module.exports = Parser