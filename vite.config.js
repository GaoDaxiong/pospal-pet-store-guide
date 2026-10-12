import { defineConfig } from 'vite'

// Default base './' emits relative URLs, so the same dist/ works at a domain root
// or under any subpath. Set BASE (e.g. BASE=/pospal-v2/) for an absolute base.
export default defineConfig({ base: process.env.BASE || './' })
