import { FetchFunctionType } from "@/app/upload/clientPage";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import { TableCell } from "@/components/Atoms/Table/Table";
import { Button } from "@/components/ui/button";
import { useDeleteSentence } from "@/services/delete-sentence/useDeleteSentence";
import { SupabaseSentenceType } from "@/models/sentence";
import { createStringZodSchema } from "@/utils/validation";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { capitalizeFirstLetter } from "@/utils/common";
import { SingleSentenceDialogPropTypes } from "./type";
import { SentencePerWordForm } from "./SentenceFormPerWord";
import { Switch } from "@/components/ui/switch";
import { SentenceJSONForm } from "./SentenceFormJSON";

export const SingleSentenceDialog = ({
  type,
  trigger,
  defaultValues,
  refetchData,
}: SingleSentenceDialogPropTypes) => {
  const [jsonMode, setJsonMode] = useState(true);
  const isEdit = type === "edit";

  const renderForm = () => {
    if (jsonMode) {
      if (isEdit) {
        <SentenceJSONForm
          type={type}
          defaultValues={defaultValues}
          refetchData={refetchData}
        />;
      } else {
        return (
          <SentenceJSONForm
            type={type}
            defaultValues={defaultValues}
            refetchData={refetchData}
          />
        );
      }
    } else {
      if (isEdit) {
        return (
          <SentencePerWordForm
            type={type}
            defaultValues={defaultValues}
            refetchData={refetchData}
          />
        );
      } else {
        return (
          <SentencePerWordForm
            type={type}
            defaultValues={defaultValues}
            refetchData={refetchData}
          />
        );
      }
    }
  };

  return (
    <DialogComponent
      title={`${capitalizeFirstLetter(type)} Sentence`}
      trigger={trigger}
    >
      <Switch
        checked={jsonMode}
        id="json-mode"
        onCheckedChange={(e) => {
          setJsonMode(e);
        }}
      />
      {renderForm()}
    </DialogComponent>
  );
};

export const SingleSentenceRow = ({
  sentence,
  refetchData,
}: {
  sentence: SupabaseSentenceType;
  refetchData: FetchFunctionType;
}) => {
  const { mutateAsync: deleteSentence, isPending: deleteSentencePending } =
    useDeleteSentence({ onError: (e) => toast(e.message, { type: "error" }) });

  return (
    <tr>
      <TableCell>{sentence?.sentence}</TableCell>
      <TableCell>{sentence?.english}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <SingleSentenceDialog
            defaultValues={sentence}
            type="edit"
            refetchData={refetchData}
            trigger={
              <Button>
                <PencilIcon size={16} />
              </Button>
            }
          />
          <Button
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete this particle "${sentence.sentence} (${sentence.english})" ?`,
                )
              ) {
                await deleteSentence(sentence.id);
                toast("Question deleted successfully", { type: "success" });
                await refetchData();
              }
            }}
            variant="destructive"
            isLoading={deleteSentencePending}
          >
            <TrashIcon className="text-foreground" size={16} />
          </Button>
        </div>
      </TableCell>
    </tr>
  );
};
