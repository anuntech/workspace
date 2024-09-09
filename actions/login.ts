'use server'

export async function login(state: object, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  console.log(`email: ${email}`)
  console.log(`password: ${password}`)

  return { ok: true, error: '', data: null }
}
