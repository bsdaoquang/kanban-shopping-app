/** @format */

import { createSlice } from '@reduxjs/toolkit';

export interface CartItemModel {
	createdBy: string;
	count: number;
	subProductId: string;
	size: string;
	color: string;
	price: number;
	qty: number;
	title: string;
	productId: string;
	image: string;
	_id: string;
}

const innitState: CartItemModel[] = [];

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		data: innitState,
	},
	reducers: {
		addProduct: (state, action) => {
			const items: CartItemModel[] = [...state.data];
			const item = action.payload;

			const index = items.findIndex(
				(element) => element.subProductId === item.subProductId
			);

			if (index !== -1) {
				items[index].count = items[index].count + item.count;
			} else {
				items.push(item);
			}

			state.data = items;
		},
		removeProduct: (state, action) => {
			const items = [...state.data];
			const item = action.payload;

			const index = items.findIndex((element) => element._id === item._id);

			if (index !== -1) {
				items.splice(index, 1);
			}

			state.data = items;
		},
		changeProduct: (state, action) => {
			const { id, data } = action.payload;
			const items = [...state.data];
			const index = items.findIndex((element) => element._id === id);
			if (index !== -1) {
				items[index] = { ...data, _id: id };
			}

			state.data = items;
		},
		changeCount: (state, action) => {
			const items = [...state.data];
			const { id, val } = action.payload;
			const index = items.findIndex((element) => element._id === id);

			if (index - 1) {
				const newValue = items[index].count + val;
				items[index].count = newValue;
			}

			state.data = items;
		},
		syncProducts: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const cartReducer = cartSlice.reducer;
export const {
	addProduct,
	syncProducts,
	removeProduct,
	changeCount,
	changeProduct,
} = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.data;
