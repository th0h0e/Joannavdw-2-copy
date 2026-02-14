export function useHomepageData() {
  const { data: homepageRes } = useNuxtData('homepage')

  const homepage = computed(() => homepageRes.value?.items?.find((i: Record<string, unknown>) => i.Is_Active) ?? null)

  const heroImage = computed(() => {
    if (!homepage.value) return ''
    return `https://admin.kontext.site/api/files/${homepage.value.collectionId}/${homepage.value.id}/${homepage.value.Hero_Image}`
  })

  const heroTitle = computed(() => (homepage.value?.Hero_Title as string) || 'Creative Strategy and Communication')

  return { heroImage, heroTitle }
}
