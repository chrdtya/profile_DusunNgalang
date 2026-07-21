import { useEffect, useState } from 'react'

export function useSanityData(load, fallback) {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    let isMounted = true

    load()
      .then((result) => {
        if (isMounted && result?.length) setData(result)
      })
      .catch((error) => console.error('Gagal memuat konten Sanity:', error))

    return () => {
      isMounted = false
    }
  }, [load])

  return data
}
