export default {
  name: 'tentangDusun',
  title: 'Tentang Dusun',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
  ],
}
