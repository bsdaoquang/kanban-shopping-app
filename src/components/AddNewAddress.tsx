/** @format */

import handleAPI from '@/apis/handleApi';
import { SelectModel } from '@/models/FormModel';
import { AddressModel } from '@/models/Products';
import { authSelector } from '@/redux/reducers/authReducer';
import { replaceName } from '@/utils/replaceName';
import { Button, Checkbox, Form, Input, Select, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const OPENAPILOCATION = `https://open.oapi.vn/location`;

interface Props {
	onAddnew: (val: AddressModel) => void;
}

const AddNewAddress = (props: Props) => {
	const { onAddnew } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [locationData, setLocationData] = useState<{
		provinces: SelectModel[];
		districts: SelectModel[];
		wards: SelectModel[];
	}>({
		provinces: [],
		districts: [],
		wards: [],
	});
	const [locationValues, setLocationValues] = useState<any>({
		ward: '',
		district: '',
		province: '',
	});
	const [isDefault, setIsDefault] = useState(false);

	const [form] = Form.useForm();
	const auth = useSelector(authSelector);

	useEffect(() => {
		getProvinces(`provinces`);
	}, []);

	const getProvinces = async (url: string, id?: string) => {
		const api = `${OPENAPILOCATION}/${url}${
			id ? `/${id}` : ''
		}?page=0&size=1000`;
		try {
			const res: any[] = await axios(api);

			const data = res.map((item) => ({ label: item.name, value: item.id }));
			const val: any = {};
			val[url] = data;

			setLocationData({ ...locationData, ...val });
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddNewAddress = async (values: any) => {
		let address = values.houseNo ? `${values.houseNo}` : '';

		const items: any = { ...locationData };

		for (const i in locationValues) {
			const seletecs: SelectModel[] = items[`${i}s`];
			const item = seletecs.find(
				(element) => element.value === locationValues[i]
			);

			if (item) {
				address += `, ${item.label}`;
			}
		}
		delete values.houseNo;
		values['address'] = address;

		for (const i in values) {
			values[i] = values[i] || values[i] === false ? values[i] : '';
		}

		values['isDefault'] = isDefault;
		values['createdBy'] = auth._id;

		setIsLoading(true);
		try {
			const res: any = await handleAPI({
				url: '/carts/add-new-address',
				data: values,
				method: 'post',
			});

			onAddnew(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Typography.Title level={3}>Add new address</Typography.Title>
			<Form
				form={form}
				onFinish={handleAddNewAddress}
				disabled={isLoading}
				size='large'
				layout='vertical'>
				<Form.Item name={'name'} label='Name'>
					<Input allowClear />
				</Form.Item>
				<Form.Item name={'phoneNumber'} label='Mobile phone'>
					<Input type='tel' allowClear />
				</Form.Item>
				<Form.Item name={'houseNo'} label='houseNo'>
					<Input allowClear />
				</Form.Item>
				<Form.Item
					name={'province'}
					rules={[{ required: true, message: 'fafa' }]}
					label='Provice'>
					<Select
						disabled={locationData.provinces.length === 0}
						options={locationData['provinces']}
						optionLabelProp='label'
						onChange={async (val) => {
							await getProvinces(`districts`, val);
							setLocationValues({ ...locationValues, province: val });
						}}
						showSearch
						filterOption={(input, option) =>
							(replaceName(option?.label as string) ?? '').includes(
								replaceName(input)
							)
						}
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? '')
								.toLowerCase()
								.localeCompare((optionB?.label ?? '').toLowerCase())
						}
					/>
				</Form.Item>
				<Form.Item
					name={'district'}
					rules={[{ required: true, message: 'fafa' }]}
					label='Districts'>
					<Select
						disabled={
							locationData.districts.length === 0 || !locationValues.province
						}
						onChange={async (val) => {
							await getProvinces(`wards`, val);
							setLocationValues({ ...locationValues, district: val });
						}}
						options={locationData['districts']}
						optionLabelProp='label'
						showSearch
						filterOption={(input, option) =>
							(replaceName(option?.label as string) ?? '').includes(
								replaceName(input)
							)
						}
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? '')
								.toLowerCase()
								.localeCompare((optionB?.label ?? '').toLowerCase())
						}
					/>
				</Form.Item>
				<Form.Item
					name={'ward'}
					rules={[{ required: true, message: 'fafa' }]}
					label='Wards'>
					<Select
						disabled={
							locationData.wards.length === 0 || !locationValues.district
						}
						onChange={(val) =>
							setLocationValues({ ...locationValues, ward: val })
						}
						options={locationData['wards']}
						optionLabelProp='label'
						showSearch
						filterOption={(input, option) =>
							(replaceName(option?.label as string) ?? '').includes(
								replaceName(input)
							)
						}
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? '')
								.toLowerCase()
								.localeCompare((optionB?.label ?? '').toLowerCase())
						}
					/>
				</Form.Item>
				<Form.Item name={'isDefault'}>
					<Checkbox
						checked={isDefault}
						onChange={() => setIsDefault(!isDefault)}>
						Use as my default address
					</Checkbox>
				</Form.Item>
			</Form>

			<Button type='primary' size='large' onClick={() => form.submit()}>
				Add new address
			</Button>
		</div>
	);
};

export default AddNewAddress;
