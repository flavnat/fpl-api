import * as auth from '../modules/auth/auth.schema.js'
import * as elementTypes from '../modules/element-types/element-types.schema.js'
import * as teams from '../modules/teams/teams.schema.js'

export * from '../modules/auth/auth.schema.js'
export * from '../modules/element-types/element-types.schema.js'
export * from '../modules/teams/teams.schema.js'

export const schema = {
  ...auth,
  ...teams,
  ...elementTypes,
}
