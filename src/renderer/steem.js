module.exports = {
  init
}

const steem = require('steem')

function init (authors, percentage) {
  var authors = authors
  var percentage = percentage
  steem.api.setOptions({ url: 'wss://steemd.privex.io' });
  console.log('Initialization of Steem', authors, percentage)
  steem.api.streamOperations(function (err, op) {
    if (op[0] != 'comment') return
    if (op[1].parent_author.length > 0) return
    if (op[1].parent_permlink != 'dtube') return

    console.log(op[1])
    try {
      var magnet = JSON.parse(op[1].json_metadata).video.content.magnet
      if (authors && authors.indexOf(op[1].author) > -1) {
        window.dispatch('addTorrent', magnet)
        console.log('Added torrent from authors')
        return
      }
      if (percentage && percentage > Math.random()) {
        window.dispatch('addTorrent', magnet)
        console.log('Added torrent from random percentage')
        return
      }

      console.log('ignored torrent')
    } catch (e) {
      console.log(e)
    }
  });
}
