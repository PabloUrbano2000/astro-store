import type { CartItem } from '@/interfaces'
import { defineAction } from 'astro:actions'
import { db, eq, inArray, Product, ProductImage } from 'astro:db'
import { z } from 'astro:schema'

export const loadProductsFromCart = defineAction({
  accept: 'json',
  input: z.object({
    cookies: z.string()
  }),
  handler: async ({ cookies }) => {
    // const cart = JSON.parse(cookies.get('cart')?.value ?? '[]') as CartItem[]
    const cart = JSON.parse(cookies) as CartItem[]
    if (cart.length === 0) return []

    // load products
    const productIds = cart.map((item) => item.productId)

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds))

    return cart.map((item) => {
      const dbProduct = dbProducts.find((p) => p.Product.id === item.productId)
      if (!dbProduct) {
        throw new Error(`Product with id ${item.productId} not found`)
      }
      const { title, price, slug } = dbProduct.Product
      const image = dbProduct.ProductImage.image

      return {
        productId: item.productId,
        title,
        size: item.size,
        quantity: item.quantity,
        image: image.startsWith('http')
          ? image
          : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
        price,
        slug
      }
    })
  }
})
