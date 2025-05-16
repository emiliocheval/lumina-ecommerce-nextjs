import { type SchemaTypeDefinition } from 'sanity'
import {bannerType} from './bannerType'
import {categoryType} from './categoryType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [bannerType, categoryType],
}

export const schemaTypes = [bannerType, categoryType]
