// Compatibility shim — delegates to the async Redis-backed users store
export { getAllUsers as readUsers } from '@/lib/users'
