/**
 * Export selected experiences as JSON
 */
export function exportSelectedExperiences(experiences, selectedIds) {
  if (selectedIds.size === 0) {
    throw new Error('No rows selected')
  }

  const selected = experiences.filter((exp) =>
    selectedIds.has(exp.id)
  )

  const json = JSON.stringify(selected, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'experiences-selected.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
