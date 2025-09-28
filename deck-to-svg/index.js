import fs from "node:fs"
const svgWidth = 500
const svgHeight = 500
const points = [
  [200, 200],
  [200, 400],
  [400, 200],
  [400, 400]
]

const appendContent = (content) => {
  return `<svg xmlns='http://www.w3.org/2000/svg' width="${svgWidth}" height="${svgHeight}">${content}</svg>`
}

let content = ''

for (const point of points) {
  const circle = `<circle cx="${point[0]}" cy="${point[1]}" r="${10}" fill="${'red'}"/>`
  content += circle
}

const svg = appendContent(content)
fs.writeFileSync('umap.svg', svg)