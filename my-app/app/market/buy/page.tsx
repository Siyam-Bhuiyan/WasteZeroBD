'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getUserByEmail, getItems, purchaseItem } from '@/utils/db/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/loader';
import { Search, ShoppingCart } from 'react-feather'

type Item = {
  id: number
  name: string
  price: number
  description: string
}

const ITEMS_PER_PAGE = 5

export default function BuyPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null)

  useEffect(() => {
    const fetchUserAndItems = async () => {
      setLoading(true)
      try {
        // Fetch user
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail)
          if (fetchedUser) {
            setUser(fetchedUser)
          } else {
            toast.error('User not found. Please log in again.')
            // Redirect to login page or handle this case appropriately
          }
        } else {
          toast.error('User not logged in. Please log in.')
          // Redirect to login page or handle this case appropriately
        }

        // Fetch items
        const fetchedItems = await getItems(fetchedUser.id)
        setItems(fetchedItems as Item[])
      } catch (error) {
        console.error('Error fetching user and items:', error)
        toast.error('Failed to load user data and items. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndItems()
  }, [])

  const handlePurchase = async (itemId: number) => {
    if (!user) {
      toast.error('Please log in to purchase items.')
      return
    }

    try {
      const purchasedItem = await purchaseItem(user.id, itemId)
      if (purchasedItem) {
        toast.success('Item purchased successfully')
        // Update the items list
        const updatedItems = await getItems(user.id)
        setItems(updatedItems as Item[])
      } else {
        toast.error('Failed to purchase item. Please try again.')
      }
    } catch (error) {
      console.error('Error purchasing item:', error)
      toast.error('Failed to purchase item. Please try again.')
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Available Items</h1>
      
      <div className="mb-4 flex items-center">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
                  <span className="text-sm text-gray-600">{item.price} points</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-end">
                  <Button onClick={() => handlePurchase(item.id)} variant="outline" size="sm">
                    Buy
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2"
            >
              Previous
            </Button>
            <span className="mx-2 self-center">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="ml-2"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}