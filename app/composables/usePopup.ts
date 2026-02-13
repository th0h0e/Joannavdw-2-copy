// composables/usePopup.ts
export function usePopup(projectsData: Ref<Array<{ title: string, description: string, responsibility: string[] }>>) {
  const showPopup = ref(false)
  const showAboutPopup = ref(false)
  const canOpenAboutPopup = ref(true)

  const popupProjectTitle = ref('')
  const popupProjectDescription = ref('')
  const popupProjectResponsibility = ref<string[]>([])

  function handleShowPopup(projectTitle: string) {
    const project = projectsData.value.find(p => p.title === projectTitle)
    popupProjectTitle.value = projectTitle
    popupProjectDescription.value = project?.description || ''
    popupProjectResponsibility.value = project?.responsibility || []
    showAboutPopup.value = false
    showPopup.value = true
  }

  function handleClosePopup() {
    showPopup.value = false
    canOpenAboutPopup.value = false
    setTimeout(() => {
      canOpenAboutPopup.value = true
    }, 100)
  }

  function handleShowAboutPopup() {
    if (showPopup.value || !canOpenAboutPopup.value)
      return
    showPopup.value = false
    showAboutPopup.value = true
  }

  function handleCloseAboutPopup() {
    showAboutPopup.value = false
  }

  return {
    showPopup,
    showAboutPopup,
    popupProjectTitle,
    popupProjectDescription,
    popupProjectResponsibility,
    handleShowPopup,
    handleClosePopup,
    handleShowAboutPopup,
    handleCloseAboutPopup,
  }
}
