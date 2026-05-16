import { defineStore } from "pinia";
import { api } from "@repo/convex/api";
import type { DataModel } from "@repo/convex/dataModel";

type Sku = DataModel["products"]["document"]["_id"]
type CustomerId = DataModel["customers"]["document"]["_id"]

type CartItem = {
    sku: Sku,
    title: string,
    price: number,
    quantity: number
}

type OrderDetails = {
    discount: number | null;
    bonusCard: number | null;
    tax: number;
    shipping: number;
}

type CartStore = {
    items: CartItem[],
    orderDetails: OrderDetails
}

export const useCartConvex = defineStore('cart', {
    state: (): CartStore => {
        return {
            items: [],
            orderDetails: {
                discount: null,
                bonusCard: null,
                tax: 50,
                shipping: 29
            }
        }
    },

    getters: {
        hasProduct(state) {
            return (sku: string) => Boolean(state.items.find(item => item.sku === sku))
        },
        subTotal(state): number {
            return state.items.reduce((acc, { price, quantity }) => {
                return acc + price * quantity
            }, 0)
        },
        total(state): number {
            const { tax, shipping } = state.orderDetails
            return this.subTotal + tax + shipping
        }
    },

    actions: {
        async fetch() {
            const convex = useConvex()

            const { user } = useConvexAuth()
    
            if (!user) {
                throw new Error('Not authenticated')
            }
    
            console.log(user)
    
            this.items = await convex.query(api.carts.getByCustomer, { customer: user.id })
        },

        async _mutateProduct(item: CartItem, customerId: CustomerId) {
            const convex = useConvex()

            await convex.mutation(api.carts.updateProduct, {
                product: item.sku,
                quantity: item.quantity,
                customer: customerId
            })
        },

        async addProduct(newItem: CartItem, customerId: CustomerId) {
            await this._mutateProduct(newItem, customerId)
        },

        async changeQuantity(updatedItem: CartItem, customerId: CustomerId) {
            await this._mutateProduct(updatedItem, customerId)
        },

        async clear(customerId: CustomerId) {
            const convex = useConvex()
            await convex.mutation(api.carts.clearByCustomer, { customer: customerId })
        }
    }
})

