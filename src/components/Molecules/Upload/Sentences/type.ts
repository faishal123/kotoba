import { FetchFunctionType } from "@/app/upload/clientPage";
import { SentenceToEditType } from "@/models/sentence";
import { ReactNode } from "react";

export type SingleSentenceDialogPropTypes =
  | {
      type: "edit";
      trigger?: ReactNode;
      defaultValues: SentenceToEditType;
      refetchData?: FetchFunctionType;
    }
  | {
      type: "create";
      trigger?: ReactNode;
      defaultValues?: undefined;
      refetchData?: FetchFunctionType;
    };
