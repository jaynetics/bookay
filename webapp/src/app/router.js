/** @jsx h */
import { h } from 'preact'
import PreactRouter from 'preact-router'
import { history } from '../shared'
import { Dashboard } from '../dashboard'
import { EditItem, ItemHealth, NewItem, RecentItems, SearchResult } from '../items'
import { NewImport } from '../imports/new'
import { NewExport } from '../exports/new'
import { NewUser, ShowUser } from '../users'
import { NewSession, DestroySession } from '../sessions'

export const Router = () =>
  <PreactRouter history={history}>
    <Dashboard path='/' />
    <Dashboard path='/folders/:id' />

    <EditItem path='/items/:id' />
    <EditItem path='/items/:id/in/:folderId?' />

    <ItemHealth path='/health' />

    <NewItem path='/items/create' />
    <NewItem path='/items/create/in/:folderId?' />

    <SearchResult path='/search/:q' />
    <RecentItems path='/recent' />

    <NewImport path='/imports/create' />
    <NewImport path='/imports/create/in/:folderId?' />

    <NewExport path='/exports/create' />
    <NewExport path='/exports/create/in/:folderId?' />

    <NewUser path='/users/create' />
    <ShowUser path='/users/show' />

    <NewSession path='/login' />
    <DestroySession path='/logout' />
  </PreactRouter>
