/** @format */

import { SelectModel } from '@/models/FormModel';
import { replaceName } from '@/utils/replaceName';
import { Button, Checkbox, Form, Input, Select, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const OPENAPILOCATION = `https://open.oapi.vn/location`;

const AddNewAddress = () => {
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

		console.log(values);
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
				<Form.Item rules={[{ required: true, message: 'fafa' }]} label='Wards'>
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
