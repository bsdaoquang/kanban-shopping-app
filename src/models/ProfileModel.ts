/** @format */

export interface ProfileModel {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	isDeleted: boolean;
	isVerify: boolean;
	verifyCode: string;
	createdAt: string;
	updatedAt: string;
	photoURL?: string;
	__v: number;
}
