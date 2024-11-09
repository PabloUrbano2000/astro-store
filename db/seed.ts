import { Product, ProductImage, Role, User, db } from 'astro:db'
import bcrypt from 'bcryptjs'
import { v4 as UUID } from 'uuid'
import { seedProducts } from './seed-data'

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrador' },
    { id: 'user', name: 'Usuario de sistema' }
  ]

  const jhonDoe = {
    id: 'ABC-XXX-JHON', //UUID(),
    name: 'Jhon Doe',
    email: 'jhon.doe@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'admin'
  }

  const janeDoe = {
    id: 'ABC-XXX-JANE', // UUID(),
    name: 'Jane Doe',
    email: 'jane.doe@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'user'
  }

  await db.insert(Role).values(roles)
  await db.insert(User).values([jhonDoe, janeDoe])

  const queries: any = []

  seedProducts.forEach((p) => {
    const product = {
      id: UUID(),
      stock: p.stock,
      slug: p.slug,
      description: p.description,
      gender: p.gender,
      price: p.price,
      sizes: p.sizes.join(','),
      tags: p.tags.join(','),
      title: p.title,
      type: p.type,
      user: jhonDoe.id
    }
    queries.push(db.insert(Product).values(product))
    p.images.forEach((img) => {
      const image = {
        id: UUID(),
        image: img,
        productId: product.id
      }

      queries.push(db.insert(ProductImage).values(image))
    })
  })

  await db.batch(queries)
}
