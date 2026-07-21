export default {
  name: 'galeri',
  title: 'Galeri',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul Foto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Alam', value: 'Alam' },
          { title: 'Budaya', value: 'Budaya' },
          { title: 'UMKM', value: 'UMKM' },
          { title: 'Kegiatan', value: 'Kegiatan' },
        ],
      },
    },
    {
      name: 'image',
      title: 'Gambar',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
  ],
}
