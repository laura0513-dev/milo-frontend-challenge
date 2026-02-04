import { useEffect, RefObject } from 'react'
import { Order } from '../../../shared/types.ts'

export const useOrderHighlight = (
  highlightedOrderId: string | null,
  orders: Order[],
  isLoading: boolean,
  orderRefs: RefObject<Record<number, HTMLDivElement | null>>,
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams, options?: any) => void
) => {
  useEffect(() => {
    if (highlightedOrderId && orders.length > 0 && !isLoading) {
      const orderId = parseInt(highlightedOrderId)
      const orderElement = orderRefs.current?.[orderId]
      if (orderElement) {
        setTimeout(() => {
          orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => {
            searchParams.delete('highlight')
            setSearchParams(searchParams, { replace: true })
          }, 1500)
        }, 100)
      }
    }
  }, [highlightedOrderId, orders, isLoading, orderRefs, searchParams, setSearchParams])
}
