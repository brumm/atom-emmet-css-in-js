'use babel'
import { CompositeDisposable } from 'atom'
import path from 'path'

import expandAbbreviation from './shims'

const emmetLibDir = path.resolve(
  atom.packages.resolvePackagePath('emmet'),
  'node_modules',
  'emmet',
  'lib'
)

const editorProxyPath = path.resolve(
  atom.packages.resolvePackagePath('emmet'),
  'lib',
  'editor-proxy'
)

const FILTER_NAME = `css-in-js`

const singlePxValueRegExp = /^(-?\d+(?:\.\d+)?)(?:px)?$/

const cssToJs = (declarationText, abbreviation) => {
  let [property, value] = declarationText.slice(0, -1).split(': ')
  property = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase())

  if (singlePxValueRegExp.test(value)) {
    // single px value
    let [, unitLessValue] = value.match(singlePxValueRegExp)
    value = unitLessValue
  } else {
    value = `'${value}'`
  }

  return `${property}: ${value},`
}

const filter = tree => {
  console.log({ tree: { ...tree } })

  tree.children.forEach((child, index, { length }) => {
    child.content = cssToJs(child.content, child._name)
    if (index < length - 1) {
      child.end = '\n'
    }
  })

  return tree
}

export default {
  subscriptions: new CompositeDisposable(),

  activate(state) {
    if (!atom.packages.isPackageLoaded('emmet')) {
      return
    }

    this.emmet = require(path.join(emmetLibDir, 'emmet'))
    this.filters = require(path.join(emmetLibDir, 'filter', 'main'))
    const editorProxy = require(editorProxyPath)
    this.expand = () => {
      editorProxy.setup(atom.workspace.getActiveTextEditor())

      try {
        expandAbbreviation(editorProxy, 'css', { filters: 'css-in-js' })
      } catch (e) {
        console.error(e)
      }
    }

    this.filters.add(FILTER_NAME, filter)
    this.emmet.loadSnippets({ css: { filters: FILTER_NAME } })

    window.em = this

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-emmet-css-in-js:expand': this.expand,
      })
    )
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {
    return {}
  },
}
