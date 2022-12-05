const { Item } = require('../models')

// This endpoint is used by the browser plugin.
// It returns bookmark information about the current URL,
// plus some extra data such as recently added bookmarks.
const show = async (req, res) => {
  const { params: { url }, query: { historySize, suggestSize } } = req
  const bookmark = await Item.findOne({ attributes: ['id'], where: { url } })

  let suggestedFolders = []
  let recentBookmarks = []

  if (!bookmark && Number(suggestSize) > 0) {
    suggestedFolders = await Item.findAll({
      attributes: ['id', 'name'],
      limit: Math.min(Number(suggestSize), 20),
      order: [['updatedAt', 'DESC']],
      where: { type: 'folder' },
    })
  }

  if (Number(historySize) > 0) {
    recentBookmarks = await Item.findAll({
      attributes: ['id', 'name', 'url'],
      limit: Math.min(Number(historySize), 20),
      order: [['createdAt', 'DESC']],
      where: { type: 'url' },
    })
  }

  res.send({ bookmark, recentBookmarks, suggestedFolders })
}

module.exports = { show }
