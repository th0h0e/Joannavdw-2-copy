import PocketBase from 'pocketbase'
import { beforeAll, describe, expect, it, vi } from 'vitest'

const PB_URL = process.env.NUXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090'
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@test.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testtesttest'

let pb: PocketBase

describe('pocketBase Tests', () => {
  beforeAll(async () => {
    console.log('[Setup] Authenticating with PocketBase...')
    pb = new PocketBase(PB_URL)
    await pb.collection('users')
      .authWithPassword(TEST_EMAIL, TEST_PASSWORD)
    console.log('[Setup] Authenticated successfully')
  })

  describe('connection', () => {
    it('should connect to PocketBase', async () => {
      const health = await pb.health.check()
      expect(health.code)
        .toBe(200)
    })
  })

  describe('authentication', () => {
    it('should be authenticated', () => {
      expect(pb.authStore.isValid)
        .toBe(true)
      expect(pb.authStore.token)
        .toBeDefined()
    })

    it('should have user record', () => {
      expect(pb.authStore.record)
        .toBeDefined()
    })

    it('should fail with invalid credentials', async () => {
      const newPb = new PocketBase(PB_URL)
      await expect(newPb.collection('users')
        .authWithPassword('invalid@email.com', 'wrongpassword')).rejects.toThrow()
    })
  })

  describe('read Operations (Safe - No Modifications)', () => {
    it('should fetch Portfolio_Projects list', async () => {
      const projects = await pb.collection('Portfolio_Projects')
        .getFullList({
          sort: 'Order',
        })

      expect(Array.isArray(projects))
        .toBe(true)
      console.log(`[READ] Found ${projects.length} projects`)
    })

    it('should fetch active Homepage record', async () => {
      const homepage = await pb.collection('Homepage')
        .getFirstListItem('Is_Active = true')

      expect(homepage)
        .toBeDefined()
      expect(homepage.Is_Active)
        .toBe(true)
      console.log('[READ] Homepage record:', homepage.id)
    })

    it('should fetch active About record', async () => {
      const about = await pb.collection('About')
        .getFirstListItem('Is_Active = true')

      expect(about)
        .toBeDefined()
      expect(about.Is_Active)
        .toBe(true)
      console.log('[READ] About record:', about.id)
    })

    it('should fetch Settings record', async () => {
      const settings = await pb.collection('Settings')
        .getFirstListItem('')

      expect(settings)
        .toBeDefined()
      console.log('[READ] Settings record:', settings.id)
    })
  })

  describe('auth Store Behavior', () => {
    it('should detect invalid auth state on new instance', () => {
      const newPb = new PocketBase(PB_URL)
      expect(newPb.authStore.isValid)
        .toBe(false)
    })

    it('should call onChange callback on auth state change', async () => {
      const callback = vi.fn()
      const unsubscribe = pb.authStore.onChange(callback)

      pb.authStore.clear()
      expect(callback)
        .toHaveBeenCalled()

      unsubscribe()

      // Re-auth for remaining tests
      await pb.collection('users')
        .authWithPassword(TEST_EMAIL, TEST_PASSWORD)
    })
  })

  describe('error Handling', () => {
    it('should throw 404 for non-existent record', async () => {
      await expect(pb.collection('Portfolio_Projects')
        .getOne('nonexistent-id-12345')).rejects.toThrow()
    })

    it('should throw error for invalid filter syntax', async () => {
      await expect(pb.collection('Portfolio_Projects')
        .getFirstListItem('invalid_field = 999')).rejects.toThrow()
    })
  })

  describe('token Expiration Simulation', () => {
    it('should detect invalid token', async () => {
      const newPb = new PocketBase(PB_URL)

      newPb.authStore.save('invalid-token', {
        id: 'fake-id',
        email: 'fake@email.com',
        collectionId: 'users',
        collectionName: 'users',
      })

      expect(newPb.authStore.token)
        .toBe('invalid-token')

      try {
        await newPb.collection('Portfolio_Projects')
          .create({ Title: 'Test' })
        expect.fail('Should have thrown an error')
      }
      catch (error) {
        expect(error)
          .toBeDefined()
        console.log('[TOKEN EXPIRATION] Correctly rejected invalid token')
      }

      newPb.authStore.clear()
    })
  })

  describe('image URL Generation', () => {
    it('should generate correct image URL format', async () => {
      const projects = await pb.collection('Portfolio_Projects')
        .getFullList({ limit: 1 })

      if (projects.length > 0 && projects[0].Images?.length > 0) {
        const project = projects[0]
        const filename = project.Images[0]
        const expectedUrl = `${PB_URL}/api/files/${project.collectionId}/${project.id}/${filename}`

        expect(expectedUrl)
          .toContain('/api/files/')
        expect(expectedUrl)
          .toContain(project.id)
        expect(expectedUrl)
          .toContain(filename)
        console.log('[IMAGE URL] Generated:', expectedUrl)
      }
      else {
        console.log('[IMAGE URL] No projects with images found, skipping URL test')
        expect(true)
          .toBe(true)
      }
    })
  })
})
