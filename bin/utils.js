function formatJSON (str) {
  str =  str.replace(/(?:\s*['"]*)?([a-zA-Z0-9]+)(?:['"]*\s*)?:/g, "$1:")
  return str
}

exports.formatJSON = formatJSON