/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientPage } from "./clientPage"; 
import {
  deleteData,
  editData,
  getAllData,
  insertNewData,
} from "@/utils/supabase";

export default async function Page() {
  return (
    <div>
      <ClientPage
        insertNewData={insertNewData}
        editData={editData}
        getAllData={getAllData}
        deleteData={deleteData}
      />
    </div>
  );
}
