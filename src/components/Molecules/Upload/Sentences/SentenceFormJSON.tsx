import { FormInput } from "@/components/Atoms/Form/FormInput";
import { Button } from "@/components/ui/button";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateSentence } from "@/services/create-sentence/useCreateSentence";
import { useEditSentence } from "@/services/edit-sentence/useEditSentence";
import { createStringZodSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SingleSentenceDialogPropTypes } from "./type";
import { capitalizeFirstLetter } from "@/utils/common";
import { toast } from "react-toastify";

const formSchema = z.object({
  sentence: createStringZodSchema({ required: true }),
  sentence_json: createStringZodSchema({ required: true, json: true }),
  english: createStringZodSchema({ required: true }),
});

type FormType = z.infer<typeof formSchema>;

export const SentenceJSONForm = ({
  type,
  defaultValues,
  refetchData,
}: SingleSentenceDialogPropTypes) => {
  const isEdit = type === "edit";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      sentence_json: JSON.stringify(defaultValues?.sentence_json),
    },
  });

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
    await refetchData?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitFunction)}
        className="space-y-4 max-h-[80vh] overflow-auto"
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
          {capitalizeFirstLetter(type)}
        </Button>
      </form>
    </Form>
  );
};
