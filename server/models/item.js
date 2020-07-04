'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    type: DataTypes.STRING,
    name: DataTypes.TEXT,
    url: DataTypes.TEXT,
    folderId: {
      type: DataTypes.INTEGER,
      validate: {
        async function(value, next) {
          // disallow cyclic nesting and nesting in non-folders
          let ancestor = value && await Item.findByPk(value)
          while (ancestor) {
            const { folderId: gpId, type } = ancestor
            if (type !== 'folder') {
              return next(`Can only nest in folder, not ${type}`)
            }
            else if (this.type !== 'folder') {
              return next() // cyclicity only affects folders
            }
            else if (gpId && gpId === this.id) {
              return next('Cannot nest in a contained folder')
            }
            ancestor = gpId && await Item.findByPk(gpId)
          }

          next()
        }
      }
    },
    info: DataTypes.VIRTUAL,
  }, {});
  Item.associate = function (models) {
    Item.hasMany(Item, {
      as: 'children',
      foreignKey: 'folderId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    })
    Item.belongsTo(Item, {
      as: 'parent',
      foreignKey: 'folderId',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    })
  }
  Item.afterCreate(async function markParentFolderAsRecentlyUsed(item) {
    if (item.type !== 'folder' && item.folderId) {
      // https://github.com/sequelize/sequelize/issues/3759 prevents simply doing
      // await Item.update({ updatedAt: new Date() }, { where: { id: item.folderId }})
      const folder = await Item.findByPk(item.folderId)
      folder.changed('updatedAt', true)
      folder.save()
    }
  })
  return Item;
};
