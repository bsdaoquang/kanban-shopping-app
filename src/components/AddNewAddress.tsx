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
	values?: AddressModel;
}

const AddNewAddress = (props: Props) => {
	const { onAddnew, values } = props;

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

	useEffect(() => {
		if (values) {
			form.setFieldsValue(values);
			setIsDefault(values?.isDefault ?? false);
			const vals = values.address.split(',');

			handleFormatForms(vals);

			vals.splice(vals.length - 3);
			form.setFieldValue('houseNo', vals.toString());
		}
	}, [values]);

	const handleFormatForms = async (vals: string[]) => {
		try {
			const provinceVal = vals[vals.length - 1];

			const provinceSelect = locationData.provinces.find(
				(element) => element.label === provinceVal.trim()
			);

			if (provinceSelect) {
				form.setFieldValue('province', provinceSelect.value);
				setLocationValues({
					...locationValues,
					province: provinceSelect.value,
				});
				await getProvinces(`districts`, provinceSelect.value);
			}

			const districtVal = vals[vals.length - 2];
			const districtSelect = locationData.districts.find(
				(element) => element.label === districtVal.trim()
			);

			if (districtSelect) {
				setLocationValues({
					...locationValues,
					district: districtSelect.value,
				});

				form.setFieldValue('district', districtSelect.value);
				await getProvinces(`wards`, districtSelect.value);
			}

			const wardVal = vals[vals.length - 3];

			const wardSelect = locationData.wards.find(
				(element) => element.label === wardVal.trim()
			);

			if (wardSelect) {
				setLocationValues({ ...locationValues, ward: wardSelect.value });
				form.setFieldValue('ward', wardSelect.value);
			}
		} catch (error) {
			console.log(error);
		}
	};

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

	const handleAddNewAddress = async (datas: any) => {
		let address = datas.houseNo ? `${datas.houseNo}` : '';

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
		delete datas.houseNo;
		datas['address'] = address;

		for (const i in datas) {
			datas[i] = datas[i] || datas[i] === false ? datas[i] : '';
		}

		datas['isDefault'] = isDefault;
		datas['createdBy'] = auth._id;

		setIsLoading(true);
		try {
			const res: any = await handleAPI({
				url: `/carts/${
					values ? `update-address?id=${values._id}` : 'add-new-address'
				}`,
				data: datas,
				method: values ? 'put' : 'post',
			});

			onAddnew(res.data.data);
			form.resetFields();
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
