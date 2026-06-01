export function saveLead(storageKey, payload) {
  const currentData = JSON.parse(localStorage.getItem(storageKey)) || []

  const newLead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toLocaleString('pt-BR'),
    ...payload,
  }

  localStorage.setItem(storageKey, JSON.stringify([...currentData, newLead]))

  return newLead
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}