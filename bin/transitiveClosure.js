'use strict'

/**
 * In order to run this script install csvtojson and JSONStream with npm
 * 1st parameter is the path to the csv file to read.
 * 2nd parameter is the path to the json file to write.
 *
 * This is a memory heavy program!
 */

const csv = require('csvtojson')
const JSONStream = require('JSONStream')
const fs = require('fs')
const graph = []
const transformStream = JSONStream.stringify()
const outputStream = fs.createWriteStream(process.argv[3])

function findNode (tree, title) {
  const stack = [tree]
  let node

  while (stack.length > 0) {
    node = stack.pop()

    if (node.title === title) {
      return node
    } else {
      if (node.children.length > 0) {
        for (let [i] of node.children.entries()) {
          stack.push(node.children[i])
        }
      }
    }
  }

  return null
}

function iterateAndPrint (node, parents, table) {
  for (let item of parents) {
    table.push({
      supertype: item,
      subtype: node.title
    })
  }

  parents.push(node.title)

  for (let child of node.children) {
    iterateAndPrint(child, parents.slice(), table)
  }
}

function buildTable (graph) {
  const table = []
  const out = []

  for (let node of graph) {
    iterateAndPrint(node, [], table)
  }

  for (let element of table) {
    if (out.findIndex(o => element.subtype === o.subtype && element.supertype === o.supertype) < 0) out.push(element)
  }

  return out
}

csv({delimiter: 'auto'})
  .fromFile(process.argv[2])
  .on('json', obj => {
    if (obj.typeId !== '116680003' || obj.active === '0') return

    let parent = null
    let child = null

    for (let node of graph) {
      if (parent == null) parent = findNode(node, obj.sourceId)
      if (child == null) child = findNode(node, obj.destinationId)
      if (parent != null && child != null) break
    }

    child = child || {title: obj.destinationId, children: []}

    if (parent == null) graph.push({title: obj.sourceId, children: [child]})
    else parent.children.push(child)
  })
  .on('done', () => {
    transformStream.pipe(outputStream)
    buildTable(graph).forEach(transformStream.write)
    transformStream.end()
  })
