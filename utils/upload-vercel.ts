import { put } from '@vercel/blob'

export default async function Upload(buffer, name, mime, folder) {
  try {
    const path = folder ? folder+'/'+name : name
    console.log('Uploading', path)
    const result = await put(path, buffer, { access: 'public', contentType: mime })
    console.log('Uploaded', result)
    return { success:true, result }
  } catch(ex:any) {
    console.error(ex)
    return { success:false, error:ex?.message }
  }
}
