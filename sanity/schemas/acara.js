export default {
  name: 'acara',
  title: 'Acara',
  type: 'document',
  fields: [
    {
      name: 'judul',
      title: 'Judul Acara',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Tradisi', value: 'Tradisi' },
          { title: 'Sosial', value: 'Sosial' },
          { title: 'Nasional', value: 'Nasional' },
          { title: 'Olahraga', value: 'Olahraga' },
          { title: 'Budaya', value: 'Budaya' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tanggal',
      title: 'Tanggal',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'lokasi',
      title: 'Lokasi',
      type: 'string',
    },
    {
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'kegiatan',
      title: 'Kegiatan',
      type: 'array',
      of: [{ type: 'string' }],
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
