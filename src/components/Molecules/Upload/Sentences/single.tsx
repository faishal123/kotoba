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
import { SentenceInputRenderer } from "@/utils/sentenceRenderer";
import {
  SentenceJSON,
  SentenceToEditType,
  SupabaseSentenceType,
  WordComponent,
} from "@/models/sentence";
import { createStringZodSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, TrashIcon } from "lucide-react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { capitalizeFirstLetter } from "@/utils/common";

const exampleJson: WordComponent[] = [];

const formSchema = z.object({
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
      english: defaultValues?.english || "",
      sentence_json: "[]",
    },
  });

  const isEdit = type === "edit";

  const { mutateAsync: editSentence, isPending: editSentencePending } =
    useEditSentence({
      onError: (e) => {
        toast(e.message, { type: "error" });
      },
      onSuccess: () => {
        closeOpenedDialog();
        toast("Particle updated successfully", { type: "success" });
      },
    });

  const { mutateAsync: createSentence, isPending: createSentencePending } =
    useCreateSentence({
      onError: (e) => {
        toast(e.message, { type: "error" });
      },
      onSuccess: () => {
        closeOpenedDialog();
        toast("Particle created successfully", { type: "success" });
      },
    });

  const submitFunction = async (data: FormType) => {
    let sentenceJson: SentenceJSON = [];
    try {
      sentenceJson = JSON.parse(data?.sentence_json);
    } catch {
      toast("Please enter valid JSON", { type: "error" });
      return;
    }
    const sentenceJapanese = sentenceJson?.reduce((a, c) => {
      return `${a}${c?.japanese || ""}`;
    }, "");
    if (!data.english || sentenceJson.length <= 0 || !sentenceJapanese) {
      toast("All fields are required", { type: "error" });
      return;
    }
    if (isEdit) {
      await editSentence({
        id: defaultValues?.id || "",
        english: data?.english,
        sentence_json: sentenceJson,
        sentence: sentenceJapanese,
      });
    } else {
      await createSentence({
        english: data?.english,
        sentence_json: sentenceJson,
        sentence: sentenceJapanese,
      });
    }
    form.reset();

    await refetchData();
  };

  return (
    <DialogComponent
      title={`${capitalizeFirstLetter(type)} Sentence`}
      trigger={trigger}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitFunction)}
          className="space-y-4 max-h-[80vh] overflow-auto"
        >
          {/* <FormInput
            label="Sentence"
            name="sentence"
            control={form.control}
            placeholder="Sentence"
            disabled={editSentencePending || createSentencePending}
          /> */}
          <FormInput
            label="English"
            name="english"
            control={form.control}
            placeholder="English"
            disabled={editSentencePending || createSentencePending}
          />
          {/* <FormInput
            label="JSON"
            name="sentence_json"
            control={form.control}
            placeholder="JSON"
            disabled={editSentencePending || createSentencePending}
          /> */}
          {/* <SentenceRenderer sentence={exampleJson} /> */}
          <SentenceInputRenderer
            control={form.control}
            name="sentence_json"
            defaultSentence={defaultValues?.sentence_json}
            setValue={(value) => {
              form.setValue("sentence_json", value);
            }}
          />
          <Button
            isLoading={editSentencePending || createSentencePending}
            type="submit"
          >
            {capitalizeFirstLetter(type)}
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
