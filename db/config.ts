import { column, defineDb, defineTable } from 'astro:db'

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),
    createAt: column.date({ default: new Date() }),
    role: column.text({
      references: () => Role.columns.id
    })
  }
})

const Role = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text()
  }
})

// Productos
const Product = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    stock: column.number(),
    slug: column.text({ unique: true }),
    description: column.text(),
    gender: column.text(),
    price: column.number(),
    sizes: column.text(),
    tags: column.text(),
    title: column.text(),
    type: column.text(),

    user: column.text({ references: () => User.columns.id })
  }
})

const ProductImage = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    productId: column.text({ references: () => Product.columns.id }),
    image: column.text()
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    Role,
    User,
    Product,
    ProductImage
  }
})
