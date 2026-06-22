import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { storage } from '../config/firebase'

function getSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function uploadPaymentProof(
  file: File,
  courseId: string,
  studentId: string
) {
  const safeFileName = getSafeFileName(file.name)
  const storagePath = `payment-proofs/${courseId}/${studentId}/${Date.now()}-${safeFileName}`
  const fileRef = ref(storage, storagePath)

  await uploadBytes(fileRef, file, {
    contentType: file.type,
  })

  const downloadUrl = await getDownloadURL(fileRef)

  return {
    downloadUrl,
    storagePath,
    fileName: file.name,
  }
}

export async function deletePaymentProof(storagePath: string) {
  await deleteObject(ref(storage, storagePath))
}
