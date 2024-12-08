import {client} from '../../lib/contentful'

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

    // Extract only the needed fields instead of the entire response
    const userData = {
      id: response.items[0].sys.id,
      email: response.items[0].fields.email,
      name: response.items[0].fields.name,
      // Add other needed fields here
    }

    return userData
  } catch (error) {
    throw new Error('Authentication failed')
  }
}
