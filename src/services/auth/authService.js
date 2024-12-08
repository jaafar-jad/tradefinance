import { client } from '../../lib/contentful'

export const authenticateUser = async (email, password) => {
  try {
    const response = await client.getEntries({
      content_type: 'userProfile',
      'fields.email': email,
      'fields.password': password,
    })

    if (response.items.length === 0) {
      throw new Error('Invalid credentials')
    }

    // Generate a simple accessToken using timestamp and user ID
    const accessToken = `${response.items[0].sys.id}_${Date.now()}`

    const userData = {
      id: response.items[0].sys.id,
      email: response.items[0].fields.email,
      name: response.items[0].fields.name,
      accessToken
    }

    return userData
  } catch (error) {
    throw new Error('Authentication failed')
  }
}
