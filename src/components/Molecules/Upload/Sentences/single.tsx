import { FetchFunctionType } from "@/app/upload/clientPage";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import { FormInput } from "@/components/Atoms/Form/FormInput";
import { TableCell } from "@/components/Atoms/Table/Table";
import { Button } from "@/components/ui/button";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateSentence } from "@/services/create-sentence/useCreateSentence";
import { useDeleteSentence } from "@/services/delete-sentence/useDeleteSentence";
import { useEditSentence } from "@/services/edit-sentence/useEditSentence";
import { SentenceToEditType, SupabaseSentenceType } from "@/utils/supabase";
import { createStringZodSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, TrashIcon } from "lucide-react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  sentence: createStringZodSchema({ required: true }),
  sentence_json: createStringZodSchema({ required: true, json: true }),
  english: createStringZodSchema({ required: true }),
});

type FormType = z.infer<typeof formSchema>;

type SingleSentenceDialogPropTypes =
  | {
      type: "edit";
      trigger?: ReactNode;
      defaultValues: SentenceToEditType;
      refetchData: FetchFunctionType;
    }
  | {
      type: "create";
      trigger?: ReactNode;
      defaultValues?: undefined;
      refetchData: FetchFunctionType;
    };

export const SingleSentenceDialog = ({
  type,
  trigger,
  defaultValues,
  refetchData,
}: SingleSentenceDialogPropTypes) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      sentence_json: JSON.stringify(defaultValues?.sentence_json),
    },
  });

  const isEdit = type === "edit";

  const { mutateAsync: editSentence, isPending: editSentencePending } =
    useEditSentence({
      onError: (e) => {
        console.log("error oi");
        toast(e.message, { type: "error" });
      },
      onSuccess: () =>
        toast("Particle updated successfully", { type: "success" }),
    });

  const { mutateAsync: createSentence, isPending: createSentencePending } =
    useCreateSentence({
      onError: (e) => {
        toast(e.message, { type: "error" });
      },
      onSuccess: () =>
        toast("Particle created successfully", { type: "success" }),
    });

  const submitFunction = async (data: FormType) => {
    if (!data.english || !data.sentence || !data.sentence_json) {
      toast("All fields are required", { type: "error" });
      return;
    }
    if (isEdit) {
      await editSentence({
        ...data,
        sentence_json: JSON.parse(data?.sentence_json),
        id: defaultValues.id || "",
      });
    } else {
      await createSentence({
        ...data,
        sentence_json: JSON.parse(data?.sentence_json),
      });
    }
    form.reset();
    closeOpenedDialog();
    await refetchData();
  };

  return (
    <DialogComponent title={`${type} Sentence`} trigger={trigger}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitFunction)}
          className="space-y-4"
        >
          <FormInput
            label="Sentence"
            name="sentence"
            control={form.control}
            placeholder="Sentence"
            disabled={editSentencePending || createSentencePending}
          />
          <FormInput
            label="English"
            name="english"
            control={form.control}
            placeholder="English"
            disabled={editSentencePending || createSentencePending}
          />
          <FormInput
            label="JSON"
            name="sentence_json"
            control={form.control}
            placeholder="JSON"
            disabled={editSentencePending || createSentencePending}
          />
          <Button
            isLoading={editSentencePending || createSentencePending}
            type="submit"
          >
            {type.toUpperCase()}
          </Button>
        </form>
      </Form>
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
