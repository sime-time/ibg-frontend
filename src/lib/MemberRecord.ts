import { RecordModel } from "pocketbase";

export interface MemberRecord extends RecordModel {
  name: string;
  username: string;
  email: string;
}

