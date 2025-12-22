import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core'

export const elementTypes = pgTable('element_types', {
  id: integer('id').primaryKey(),
  plural_name: text('plural_name').notNull(),
  plural_name_short: text('plural_name_short').notNull(),
  singular_name: text('singular_name').notNull(),
  singular_name_short: text('singular_name_short').notNull(),
  squad_select: integer('squad_select'),
  squad_min_select: integer('squad_min_select'),
  squad_max_select: integer('squad_max_select'),
  squad_min_play: integer('squad_min_play'),
  squad_max_play: integer('squad_max_play'),
  ui_shirt_specific: boolean('ui_shirt_specific').notNull().default(false),
  sub_positions_locked: integer('sub_positions_locked').array(),
  element_count: integer('element_count'),
})
