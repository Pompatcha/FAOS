"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { ProductModal } from "./components/product-modal"
import { ProductImageGallery } from "./components/product-image-gallery"

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Smartphone",
    price: 39900,
    stock: 25,
    status: "active",
    images: [
      "/placeholder.svg?height=50&width=50&text=iPhone+Front",
      "/placeholder.svg?height=50&width=50&text=iPhone+Back",
      "/placeholder.svg?height=50&width=50&text=iPhone+Side",
    ],
  },
  {
    id: 2,
    name: "MacBook Air M2",
    category: "Laptop",
    price: 42900,
    stock: 12,
    status: "active",
    images: [
      "/placeholder.svg?height=50&width=50&text=MacBook+Open",
      "/placeholder.svg?height=50&width=50&text=MacBook+Closed",
    ],
  },
  {
    id: 3,
    name: "AirPods Pro",
    category: "Headphones",
    price: 8900,
    stock: 0,
    status: "out_of_stock",
    images: [
      "/placeholder.svg?height=50&width=50&text=AirPods+Case",
      "/placeholder.svg?height=50&width=50&text=AirPods+Open",
    ],
  },
  {
    id: 4,
    name: "iPad Air",
    category: "Tablet",
    price: 22900,
    stock: 8,
    status: "active",
    images: [
      "/placeholder.svg?height=50&width=50&text=iPad+Front",
      "/placeholder.svg?height=50&width=50&text=iPad+Back",
    ],
  },
  {
    id: 5,
    name: "Apple Watch Series 9",
    category: "Smartwatch",
    price: 13900,
    stock: 15,
    status: "active",
    images: [
      "/placeholder.svg?height=50&width=50&text=Watch+Face",
      "/placeholder.svg?height=50&width=50&text=Watch+Side",
    ],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    images: [],
    productName: "",
    initialIndex: 0,
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Math.max(...products.map((p) => p.id)) + 1,
    }
    setProducts([...products, newProduct])
  }

  const handleEditProduct = (productData) => {
    setProducts(products.map((p) => (p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p)))
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const openImageGallery = (product, initialIndex = 0) => {
    setGalleryState({
      isOpen: true,
      images: product.images || [],
      productName: product.name,
      initialIndex,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your store products</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>Total {products.length} products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex -space-x-2 cursor-pointer" onClick={() => openImageGallery(product)}>
                        {product.images?.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} ${index + 1}`}
                            className="h-10 w-10 rounded-md object-cover border-2 border-white hover:z-10 transition-all"
                          />
                        ))}
                        {product.images?.length > 3 && (
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs font-medium border-2 border-white">
                            +{product.images.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>฿{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
      />

      <ProductImageGallery
        images={galleryState.images}
        productName={galleryState.productName}
        isOpen={galleryState.isOpen}
        onClose={() => setGalleryState((prev) => ({ ...prev, isOpen: false }))}
        initialIndex={galleryState.initialIndex}
      />
    </div>
  )
}
