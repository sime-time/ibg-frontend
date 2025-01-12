import type RecordModel from "pocketbase";

export enum UserType {
  Member = "member",
  Coach = "coach",
}

export interface MemberData {
  name: string,
  email: string,
  emailVisibility: boolean,
  password: string,
  passwordConfirm: string
}

export interface ContactInfo {
  avatar: File | null,
  phone: string,
  emergencyName: string,
  emergencyPhone: string,
}

export interface UpdateMemberData {
  avatar: File | null,
  name?: string,
  email?: string,
  phone?: string,
  emergencyName?: string,
  emergencyPhone?: string,
}

// fulfills the properties of the pocketbase update collection function
export interface UpdateMemberRecord {
  avatar?: File | null,
  name?: string,
  email?: string,
  password?: string,
  passwordConfirm?: string,
  oldPassword?: string,
  phone_number?: string,
}

export interface MemberRecord extends RecordModel {
  id: string;
  name: string;
  email: string;
  is_subscribed: string;
  program: string;
  phone_number: string;
  stripe_customer_id: string;
  avatarUrl: string;
  avatar?: string;
}

export interface ClassRecord extends RecordModel {
  id: string;
  date: Date;
  martial_art: string;
  is_recurring: boolean;
  active: boolean;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  week_day: number;
}

export interface MartialArtRecord extends RecordModel {
  id: string;
  name: string;
  shortname: string;
}

export interface PasswordUpdateResult {
  success: boolean;
  message: string;
}
