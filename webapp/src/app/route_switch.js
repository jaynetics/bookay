import { Route, Switch } from 'wouter-preact'
import { Dashboard } from '../dashboard'
import { EditItem, ItemHealth, NewItem, RecentItems, SearchResult } from '../items'
import { NewImport } from '../imports/new'
import { NewExport } from '../exports/new'
import { EditUser, NewUser } from '../users'
import { NewSession, DestroySession } from '../sessions'

export const RouteSwitch = () =>
  <Switch>
    <Route component={Dashboard} path='/' />
    <Route component={Dashboard} path='/folders/:id' />
    <Route component={NewItem} path='/items/create/:subview*' />
    <Route component={EditItem} path='/items/:id/:subview*' />
    <Route component={ItemHealth} path='/health' />
    <Route component={SearchResult} path='/search' />
    <Route component={RecentItems} path='/recent' />
    <Route component={NewImport} path='/imports/create' />
    <Route component={NewImport} path='/imports/create/:subview*' />
    <Route component={NewExport} path='/exports/create/:subview*' />
    <Route component={NewUser} path='/users/create' />
    <Route component={EditUser} path='/settings' />
    <Route component={NewSession} path='/login' />
    <Route component={DestroySession} path='/logout' />
  </Switch>
