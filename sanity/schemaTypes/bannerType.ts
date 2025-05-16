import {defineField, defineType} from 'sanity'

export const bannerType = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'link',
      type: 'url',
      title: 'Link URL',
    }),
    defineField({
      name: 'cta',
      type: 'string',
      title: 'Call to Action',
    }),
    defineField({
      name: 'active',
      type: 'boolean',
      initialValue: true,
      title: 'Active',
    }),
  ],
}) 