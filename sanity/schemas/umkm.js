export default {
  name: 'umkm',
  title: 'UMKM',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nama UMKM',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Kuliner', value: 'Kuliner' },
          { title: 'Kerajinan', value: 'Kerajinan' },
          { title: 'Fashion', value: 'Fashion' },
          { title: 'Pertanian', value: 'Pertanian' },
          { title: 'Peternakan', value: 'Peternakan' },
          { title: 'Jasa', value: 'Jasa' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'address',
      title: 'Alamat / Lokasi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    },
    {
      name: 'image',
      title: 'Gambar',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
