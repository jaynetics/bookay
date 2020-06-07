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
          if (!value) next()
          const newParent = await Item.findByPk(value)
          const type = newParent && newParent.type
          if (type !== 'folder') next(`Can only nest in folder, not ${type}`)
          else next()
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
