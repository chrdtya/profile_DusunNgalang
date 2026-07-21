export default {
  name: 'berita',
  title: 'Berita',
  type: 'document',
  fields: [
    {
      name: 'judul',
      title: 'Judul Berita',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'konten',
      title: 'Konten',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tanggalPublikasi',
      title: 'Tanggal Publikasi',
      type: 'datetime',
    },
    {
      name: 'penulis',
      title: 'Penulis',
      type: 'string',
    },
    {
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Kegiatan', value: 'Kegiatan' },
          { title: 'Pengumuman', value: 'Pengumuman' },
          { title: 'UMKM', value: 'UMKM' },
          { title: 'Budaya', value: 'Budaya' },
        ],
      },
    },
    {
      name: 'image',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
