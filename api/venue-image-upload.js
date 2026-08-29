import { handleUpload } from '@vercel/blob/client'
import jwt from 'jsonwebtoken'

// Dedicated Vercel function (not routed through the Express app) implementing
// Vercel Blob's client-upload handshake: the browser asks this route for a
// short-lived, scoped token, then uploads the file bytes straight to Blob
// storage — bypassing our serverless function's request body size limit.
export default async function handler(request, response) {
  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let token
        try {
          token = JSON.parse(clientPayload || '{}').token
        } catch {
          token = null
        }

        if (!token) {
          throw new Error('Missing admin token')
        }
        try {
          jwt.verify(token, process.env.JWT_SECRET)
        } catch {
          throw new Error('Invalid or expired admin token')
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })

    return response.status(200).json(jsonResponse)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
}
