'use babel'
import path from 'path'

const emmetLibDir = path.resolve(
  atom.packages.resolvePackagePath('emmet'),
  'node_modules',
  'emmet',
  'lib'
)

const range = require(path.join(emmetLibDir, 'assets', 'range'))
const actionUtils = require(path.join(emmetLibDir, 'utils', 'action'))
const parser = require(path.join(emmetLibDir, 'parser', 'abbreviation'))

const findAbbreviation = editor => {
  var r = range(editor.getSelectionRange())
  var content = String(editor.getContent())
  if (r.length()) {
    // abbreviation is selected by user
    return r.substring(content)
  }

  // search for new abbreviation from current caret position
  var curLine = editor.getCurrentLineRange()
  return actionUtils.extractAbbreviation(
    content.substring(curLine.start, r.start)
  )
}

const expandAbbreviation = (editor, syntax, profile) => {
  var caretPos = editor.getSelectionRange().end
  var abbr = findAbbreviation(editor)

  if (abbr) {
    var content = parser.expand(abbr, {
      syntax: syntax,
      profile: profile,
      contextNode: actionUtils.captureContext(editor),
    })

    if (content) {
      var replaceFrom = caretPos - abbr.length
      var replaceTo = caretPos
      editor.replaceContent(content, replaceFrom, replaceTo)
      return true
    }
  }

  return false
}

export default expandAbbreviation
